import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../supabaseClient';
import { showAlert, setEnvelopeStep, setIntroComplete } from './uiSlice';

// Helper for Netlify forms submission
const encode = (data) => {
  return Object.keys(data)
    .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&");
};

// Safe date parsing helper
const safeParseDate = (dateStr) => {
  if (!dateStr) return new Date();
  if (typeof dateStr === 'string') {
    const formatted = dateStr.trim().replace(' ', 'T');
    return new Date(formatted);
  }
  return new Date(dateStr);
};

// Sound effect helper
const playSoundEffect = (src) => {
  const sfx = new Audio(src);
  sfx.volume = 0.5;
  sfx.play().catch((err) => {
    console.log("Sound effect playback blocked or failed:", err);
  });
};

export const fetchRsvpsAndWishes = createAsyncThunk(
  'db/fetchRsvpsAndWishes',
  async (_, { dispatch }) => {
    let rsvps = [];
    let wishes = [];

    if (supabase) {
      const { data: rsvpsData, error: rsvpsError } = await supabase
        .from('rsvps')
        .select('*')
        .order('created_at', { ascending: true });
      if (rsvpsError) {
        console.error("Error fetching RSVPs:", rsvpsError);
      } else if (rsvpsData) {
        rsvps = rsvpsData;
      }

      const { data: wishesData, error: wishesError } = await supabase
        .from('wishes')
        .select('*')
        .order('created_at', { ascending: false });
      if (wishesError) {
        console.error("Error fetching wishes:", wishesError);
      } else if (wishesData) {
        wishes = wishesData;
      }
    } else {
      const savedRsvpList = localStorage.getItem('housewarming_rsvp_list');
      if (savedRsvpList) rsvps = JSON.parse(savedRsvpList);

      const savedWishes = localStorage.getItem('housewarming_wishes');
      if (savedWishes) wishes = JSON.parse(savedWishes);
    }

    return { rsvps, wishes };
  }
);

export const submitRsvpThunk = createAsyncThunk(
  'db/submitRsvpThunk',
  async ({ rsvpForm, eventConfig }, { dispatch, getState }) => {
    const state = getState();
    const wishes = state.db.wishes;

    // Save to global RSVP list
    const savedRsvpList = localStorage.getItem('housewarming_rsvp_list');
    let currentList = savedRsvpList ? JSON.parse(savedRsvpList) : [];

    // 1. Duplicate phone check for this event (if phone number is provided)
    if (rsvpForm.phone.trim()) {
      if (supabase) {
        const { data, error } = await supabase
          .from('rsvps')
          .select('name, message')
          .eq('phone', rsvpForm.phone.trim());

        if (error) {
          console.error("Error checking duplicate phone:", error);
        } else if (data) {
          const duplicate = data.find(item => (item.message || '').startsWith(`[${eventConfig.eventId}]`));
          if (duplicate) {
            dispatch(showAlert(`We've already saved a spot for you! This phone number is registered under "${duplicate.name}". We are so excited to celebrate our new home with you! 🏡✨`));
            return { success: false };
          }
        }
      } else {
        const duplicateLocal = currentList.find(item => 
          item.phone && 
          item.phone.trim() === rsvpForm.phone.trim() && 
          (item.message || '').startsWith(`[${eventConfig.eventId}]`)
        );
        if (duplicateLocal) {
          dispatch(showAlert(`We've already saved a spot for you! This phone number is registered under "${duplicateLocal.name}". We are so excited to celebrate our new home with you! 🏡✨`));
          return { success: false };
        }
      }
    }

    // Save locally for guest (clean state without prefix)
    localStorage.setItem('housewarming_rsvp', JSON.stringify(rsvpForm));
    playSoundEffect('/assets/rsvp_success.mp3');

    // Prefix the message for storing in database / global list
    const prefixedMessage = `[${eventConfig.eventId}] ${rsvpForm.message || ''}`;
    const rsvpItemWithPrefix = { ...rsvpForm, message: prefixedMessage };

    const existingIndex = currentList.findIndex(item => 
      item.name.toLowerCase() === rsvpForm.name.toLowerCase() && 
      (item.message || '').startsWith(`[${eventConfig.eventId}]`)
    );
    if (existingIndex > -1) {
      currentList[existingIndex] = rsvpItemWithPrefix;
    } else {
      currentList.push(rsvpItemWithPrefix);
    }
    localStorage.setItem('housewarming_rsvp_list', JSON.stringify(currentList));

    // Calculate total attending guests matching this event
    const newTotalGuests = currentList
      .filter(item => (item.message || '').startsWith(`[${eventConfig.eventId}]`))
      .reduce((acc, curr) => {
        if (curr.attending === 'yes') {
          const val = parseInt(curr.guests, 10);
          return acc + (isNaN(val) ? 1 : val);
        }
        return acc;
      }, 0);

    // Submit to Netlify Forms (only on hosted site)
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode({
          "form-name": "rsvp",
          name: rsvpForm.name,
          phone: rsvpForm.phone,
          attending: rsvpForm.attending,
          guests: rsvpForm.attending === 'yes' ? rsvpForm.guests : '0',
          message: prefixedMessage,
          total_guests: newTotalGuests
        })
      })
        .then(() => console.log("Netlify RSVP form submitted successfully"))
        .catch(error => console.error("Netlify RSVP form submission error:", error));
    }

    // Save to Supabase (if configured)
    if (supabase) {
      const { error } = await supabase
        .from('rsvps')
        .insert([{
          name: rsvpForm.name,
          phone: rsvpForm.phone.trim(),
          attending: rsvpForm.attending,
          guests: rsvpForm.attending === 'yes' ? parseInt(rsvpForm.guests, 10) : 0,
          message: prefixedMessage
        }]);
      if (error) {
        console.error("Error saving RSVP to Supabase:", error);
      }
    }

    // Auto-add to guestbook if there's a message
    let updatedWishes = [...wishes];
    if (rsvpForm.message.trim()) {
      const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      const newWish = {
        id: Date.now(),
        name: rsvpForm.name,
        wish: prefixedMessage,
        date: dateStr,
        likes: 0
      };
      updatedWishes = [newWish, ...wishes];
      localStorage.setItem('housewarming_wishes', JSON.stringify(updatedWishes));

      if (supabase) {
        const { error } = await supabase
          .from('wishes')
          .insert([{
            name: rsvpForm.name,
            wish: prefixedMessage,
            date: dateStr,
            likes: 0
          }]);
        if (error) {
          console.error("Error saving automatic wish to Supabase:", error);
        }
      }
    }

    // Envelope transitions
    const isIntroComplete = state.ui.isIntroComplete;
    if (!isIntroComplete) {
      if (rsvpForm.attending === 'yes') {
        dispatch(setEnvelopeStep(4));
      } else {
        // Seal and complete
        dispatch(setEnvelopeStep(0));
        playSoundEffect('/assets/wish_success.mp3');
        setTimeout(() => {
          dispatch(setIntroComplete(true));
        }, 1500);
      }
    }

    return { 
      success: true, 
      rsvps: currentList, 
      wishes: updatedWishes,
      rsvpForm
    };
  }
);

export const likeWishThunk = createAsyncThunk(
  'db/likeWishThunk',
  async (wishId, { getState }) => {
    const state = getState();
    const likedWishIds = state.db.likedWishIds;
    const wishes = state.db.wishes;

    const isLiked = likedWishIds.includes(wishId);
    let newLikedIds;
    if (isLiked) {
      newLikedIds = likedWishIds.filter(id => id !== wishId);
    } else {
      newLikedIds = [...likedWishIds, wishId];
    }
    localStorage.setItem('housewarming_liked_wishes', JSON.stringify(newLikedIds));

    // Find and update likes count
    const targetWish = wishes.find(w => w.id === wishId);
    if (!targetWish) return { likedWishIds: newLikedIds, wishes };

    const currentLikes = targetWish.likes || 0;
    const newLikes = isLiked ? Math.max(0, currentLikes - 1) : currentLikes + 1;

    const updatedWishes = wishes.map(w => {
      if (w.id === wishId) {
        return { ...w, likes: newLikes };
      }
      return w;
    });

    if (supabase) {
      const { error } = await supabase
        .from('wishes')
        .update({ likes: newLikes })
        .eq('id', wishId);
      if (error) {
        console.error("Error updating likes in Supabase:", error);
      }
    } else {
      localStorage.setItem('housewarming_wishes', JSON.stringify(updatedWishes));
    }

    return { likedWishIds: newLikedIds, wishes: updatedWishes };
  }
);

const getInitialRsvpSubmitted = () => {
  const savedRsvpListCheck = localStorage.getItem('housewarming_rsvp_list');
  if (savedRsvpListCheck && savedRsvpListCheck.includes('Siddharth & Ananya')) {
    localStorage.removeItem('housewarming_rsvp_list');
    localStorage.removeItem('housewarming_wishes');
    localStorage.removeItem('housewarming_rsvp');
    return false;
  }
  return !!localStorage.getItem('housewarming_rsvp');
};

const getInitialRsvpForm = () => {
  const savedRsvp = localStorage.getItem('housewarming_rsvp');
  if (savedRsvp) {
    try {
      return JSON.parse(savedRsvp);
    } catch {
      // fallback
    }
  }
  return {
    name: '',
    phone: '',
    attending: 'yes',
    guests: '1',
    message: ''
  };
};

const initialState = {
  rsvpList: [],
  wishes: [],
  rsvpSubmitted: getInitialRsvpSubmitted(),
  rsvpForm: getInitialRsvpForm(),
  likedWishIds: (() => {
    const saved = localStorage.getItem('housewarming_liked_wishes');
    return saved ? JSON.parse(saved) : [];
  })(),
  loading: false
};

const dbSlice = createSlice({
  name: 'db',
  initialState,
  reducers: {
    setRsvps(state, action) {
      state.rsvpList = action.payload;
    },
    setWishes(state, action) {
      state.wishes = action.payload;
    },
    updateRsvpForm(state, action) {
      state.rsvpForm = { ...state.rsvpForm, ...action.payload };
    },
    resetRsvpSubmission(state) {
      localStorage.removeItem('housewarming_rsvp');
      state.rsvpSubmitted = false;
      state.rsvpForm = {
        name: '',
        phone: '',
        attending: 'yes',
        guests: '1',
        message: ''
      };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRsvpsAndWishes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRsvpsAndWishes.fulfilled, (state, action) => {
        state.rsvpList = action.payload.rsvps;
        state.wishes = action.payload.wishes;
        state.loading = false;
      })
      .addCase(fetchRsvpsAndWishes.rejected, (state) => {
        state.loading = false;
      })
      .addCase(submitRsvpThunk.fulfilled, (state, action) => {
        if (action.payload && action.payload.success) {
          state.rsvpList = action.payload.rsvps;
          state.wishes = action.payload.wishes;
          state.rsvpSubmitted = true;
          state.rsvpForm = action.payload.rsvpForm;
        }
      })
      .addCase(likeWishThunk.fulfilled, (state, action) => {
        state.likedWishIds = action.payload.likedWishIds;
        state.wishes = action.payload.wishes;
      });
  }
});

export const { setRsvps, setWishes, updateRsvpForm, resetRsvpSubmission } = dbSlice.actions;

export default dbSlice.reducer;
