import React, { useState, useEffect, useRef } from 'react'
import { Calendar, MapPin, Clock, Users, Heart, ChevronLeft, ChevronRight, Check, Send, Sparkles, VolumeX, Play, Pause } from 'lucide-react'
import './App.css'
import { supabase } from './supabaseClient'
import img2 from './assets/interior/Mrs. Ramya - Design Presentation_page-0002.jpg'
import img3 from './assets/interior/Mrs. Ramya - Design Presentation_page-0003.jpg'
import img4 from './assets/interior/Mrs. Ramya - Design Presentation_page-0004.jpg'
import img5 from './assets/interior/Mrs. Ramya - Design Presentation_page-0005.jpg'
import img6 from './assets/interior/Mrs. Ramya - Design Presentation_page-0006.jpg'
import img7 from './assets/interior/Mrs. Ramya - Design Presentation_page-0007.jpg'
import img8 from './assets/interior/Mrs. Ramya - Design Presentation_page-0008.jpg'
import img9 from './assets/interior/Mrs. Ramya - Design Presentation_page-0009.jpg'
import img10 from './assets/interior/Mrs. Ramya - Design Presentation_page-0010.jpg'
import img11 from './assets/interior/Mrs. Ramya - Design Presentation_page-0011.jpg'
import img12 from './assets/interior/Mrs. Ramya - Design Presentation_page-0012.jpg'
import img13 from './assets/interior/Mrs. Ramya - Design Presentation_page-0013.jpg'
import img14 from './assets/interior/Mrs. Ramya - Design Presentation_page-0014.jpg'
import invitationMusic from './assets/invitation.mp3'

// Image slides details
const SLIDES = [
  {
    url: img2,
    title: 'Modern Living Space',
    desc: 'An elegant layout with warm lighting, plush furnishings, and a cozy ambience.'
  },
  {
    url: img3,
    title: 'Foyer Entryway',
    desc: 'A welcoming entrance design with a sleek console table, mirror, and soft accents.'
  },
  {
    url: img4,
    title: 'Dining Area',
    desc: 'A cozy dining setup perfect for family dinners, gatherings, and celebrations.'
  },
  {
    url: img5,
    title: 'Gourmet Kitchen',
    desc: 'A modular kitchen with smart storage, modern built-in appliances, and high-end finishes.'
  },
  {
    url: img6,
    title: 'Master Bedroom Concept',
    desc: 'A luxurious and tranquil sanctuary designed specifically for deep rest and relaxation.'
  },
  {
    url: img7,
    title: 'Master Bedroom Wardrobes',
    desc: 'Sleek, handle-less built-in wardrobes with modular shelving and dresser units.'
  },
  {
    url: img8,
    title: 'Guest Bedroom Setup',
    desc: 'A warm and inviting space designed to make guests feel comfortable and at home.'
  },
  {
    url: img9,
    title: 'Kids / Study Bedroom',
    desc: 'A creative, vibrant space designed for work, study, and play.'
  },
  {
    url: img10,
    title: 'TV & Entertainment Console',
    desc: 'A minimalist entertainment hub with floating shelves and built-in ambient lighting.'
  },
  {
    url: img11,
    title: 'Foyer Accent Wall',
    desc: 'A striking feature wall that sets a premium, artistic tone for the entire home.'
  },
  {
    url: img12,
    title: 'Cozy Leisure Balcony',
    desc: 'A small outdoor escape featuring artificial turf, planters, and relaxing seating.'
  },
  {
    url: img13,
    title: 'Premium Bathroom Vanity',
    desc: 'A modern utility space featuring smart back-lit mirrors and high-quality quartz tops.'
  },
  {
    url: img14,
    title: 'Overall Interior Plan',
    desc: 'A detailed floor layout highlighting the conceptual flow of our beautiful new residence.'
  }
];

// Falling flower petals configuration
const PETAL_COLORS = [
  'linear-gradient(135deg, #ff9f00, #ff5e00)', // Marigold Orange
  'linear-gradient(135deg, #ffe066, #f5c000)', // Marigold Yellow
  'linear-gradient(135deg, #ff758c, #ff7eb3)', // Rose Pink
  'linear-gradient(135deg, #ff4e50, #f9d423)', // Sunset Gold
];

const PETALS = Array.from({ length: 40 }).map((_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  size: `${Math.random() * 12 + 8}px`, // Petal size (8px to 20px)
  delay: `${Math.random() * 8}s`,
  duration: `${Math.random() * 5 + 6}s`, // Falling speed
  color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
  drift: `${Math.random() * 100 - 50}px`, // Swaying amount
  initialRotation: `${Math.random() * 360}deg`
}));

// URL-encoding helper for Netlify forms submission
const encode = (data) => {
  return Object.keys(data)
    .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&");
};

function App() {
  // Music state
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef(null)

  // Envelope states
  const [isEnvelopeOpened, setIsEnvelopeOpened] = useState(false)
  const [isIntroComplete, setIsIntroComplete] = useState(false)
  const [envelopeStep, setEnvelopeStep] = useState(0)
  const [miniSlideIndex, setMiniSlideIndex] = useState(0)
  const [customAlert, setCustomAlert] = useState({ show: false, message: '' })

  const showAlert = (message) => {
    setCustomAlert({ show: true, message })
  }

  const handleSealEnvelope = () => {
    setIsEnvelopeOpened(false)
    playSoundEffect('/assets/wish_success.mp3')
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setIsPlaying(false)
    }
    setTimeout(() => {
      setIsIntroComplete(true)
    }, 1500)
  }

  // Control scroll lock on body depending on intro completion
  useEffect(() => {
    if (!isIntroComplete) {
      document.body.classList.add('no-scroll')
      document.documentElement.classList.add('no-scroll')
    } else {
      document.body.classList.remove('no-scroll')
      document.documentElement.classList.remove('no-scroll')
    }
    return () => {
      document.body.classList.remove('no-scroll')
      document.documentElement.classList.remove('no-scroll')
    }
  }, [isIntroComplete])

  const handleOpenEnvelope = () => {
    setIsEnvelopeOpened(true)
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true)
        })
        .catch((err) => {
          console.log("Audio autoplay from envelope click was blocked:", err)
        })
    }
    playSoundEffect('/assets/wish_success.mp3')
  }

  // Sound effect helper
  const playSoundEffect = (src) => {
    const sfx = new Audio(src);
    sfx.volume = 0.5;
    sfx.play().catch((err) => {
      console.log("Sound effect playback blocked or failed:", err);
    });
  };

  // Auto-play attempt on user interaction
  useEffect(() => {
    const startAudioOnInteraction = () => {
      // Remove listeners immediately to prevent double-firing
      document.removeEventListener('click', startAudioOnInteraction)
      document.removeEventListener('touchstart', startAudioOnInteraction)

      if (audioRef.current) {
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true)
          })
          .catch((err) => {
            console.log("Autoplay blocked or failed:", err)
          })
      }
    }

    document.addEventListener('click', startAudioOnInteraction)
    document.addEventListener('touchstart', startAudioOnInteraction)

    return () => {
      document.removeEventListener('click', startAudioOnInteraction)
      document.removeEventListener('touchstart', startAudioOnInteraction)
    }
  }, [])

  const togglePlay = (e) => {
    if (e) {
      e.stopPropagation()
    }
    
    if (!audioRef.current) return
    
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true)
        })
        .catch((err) => {
          console.log("Failed to play audio:", err)
        })
    }
  }

  // Countdown state
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  
  // Slider state
  const [currentSlide, setCurrentSlide] = useState(0)

  // RSVP state
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false)
  const [rsvpForm, setRsvpForm] = useState({
    name: '',
    phone: '',
    attending: 'yes',
    guests: '1',
    message: ''
  })
  const [rsvpList, setRsvpList] = useState([])

  const totalAttendingGuests = rsvpList.reduce((acc, curr) => {
    if (curr.attending === 'yes') {
      const val = parseInt(curr.guests, 10);
      return acc + (isNaN(val) ? 1 : val);
    }
    return acc;
  }, 0)

  // Guestbook state
  const [wishes, setWishes] = useState([])
  const [guestbookForm, setGuestbookForm] = useState({
    name: '',
    wish: ''
  })

  // Target Date: July 5, 2026, 10:00 AM
  const TARGET_DATE = new Date('2026-07-05T10:00:00');

  useEffect(() => {
    console.log("Supabase client initialized:", !!supabase)
    if (!supabase) {
      console.warn("Supabase credentials missing. Operating in localStorage fallback mode. Please check your .env file or restart the Vite dev server.")
    }

    // Migration: clear old seeded data from localStorage if present
    const savedRsvpListCheck = localStorage.getItem('housewarming_rsvp_list')
    if (savedRsvpListCheck && savedRsvpListCheck.includes('Siddharth & Ananya')) {
      localStorage.removeItem('housewarming_rsvp_list')
      localStorage.removeItem('housewarming_wishes')
      localStorage.removeItem('housewarming_rsvp')
    }

    // Check if user has already RSVP'd
    const savedRsvp = localStorage.getItem('housewarming_rsvp')
    if (savedRsvp) {
      setRsvpSubmitted(true)
      setRsvpForm(JSON.parse(savedRsvp))
    }

    // Load RSVP list and wishes from Supabase or localStorage fallback
    const fetchRsvps = async () => {
      if (supabase) {
        const { data, error } = await supabase
          .from('rsvps')
          .select('*')
          .order('created_at', { ascending: true })
        if (error) {
          console.error("Error fetching RSVPs:", error)
        } else if (data) {
          setRsvpList(data)
        }
      } else {
        const savedRsvpList = localStorage.getItem('housewarming_rsvp_list')
        if (savedRsvpList) {
          setRsvpList(JSON.parse(savedRsvpList))
        } else {
          setRsvpList([])
        }
      }
    }

    const fetchWishes = async () => {
      if (supabase) {
        const { data, error } = await supabase
          .from('wishes')
          .select('*')
          .order('created_at', { ascending: false })
        if (error) {
          console.error("Error fetching wishes:", error)
        } else if (data) {
          setWishes(data)
        }
      } else {
        const savedWishes = localStorage.getItem('housewarming_wishes')
        if (savedWishes) {
          setWishes(JSON.parse(savedWishes))
        } else {
          setWishes([])
        }
      }
    }

    fetchRsvps()
    fetchWishes()

    // Setup real-time listeners if Supabase is connected
    let rsvpsChannel;
    let wishesChannel;

    if (supabase) {
      rsvpsChannel = supabase
        .channel('rsvps-realtime')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'rsvps' }, () => {
          fetchRsvps()
        })
        .subscribe()

      wishesChannel = supabase
        .channel('wishes-realtime')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'wishes' }, () => {
          fetchWishes()
        })
        .subscribe()
    }

    // Countdown interval
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = TARGET_DATE.getTime() - now;

      if (difference <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => {
      clearInterval(timer);
      if (rsvpsChannel) supabase.removeChannel(rsvpsChannel);
      if (wishesChannel) supabase.removeChannel(wishesChannel);
    };
  }, []);

  // Slider Autoplay
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1))
    }, 6000);
    return () => clearInterval(slideInterval);
  }, []);

  // Slider Navigation
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1))
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1))
  }

  // RSVP Form handler
  const handleRsvpChange = (e) => {
    const { name, value } = e.target
    setRsvpForm(prev => ({ ...prev, [name]: value }))
  }

  const handleRsvpSubmit = async (e) => {
    e.preventDefault()
    if (!rsvpForm.name.trim()) return
    if (rsvpForm.attending === 'yes' && !rsvpForm.phone.trim()) return

    // Save to global RSVP list
    const savedRsvpList = localStorage.getItem('housewarming_rsvp_list')
    let currentList = savedRsvpList ? JSON.parse(savedRsvpList) : []

    // 1. Check duplicate phone in Supabase (if phone number is provided)
    if (rsvpForm.phone.trim()) {
      if (supabase) {
        const { data, error } = await supabase
          .from('rsvps')
          .select('name')
          .eq('phone', rsvpForm.phone.trim())
          .maybeSingle()

        if (error) {
          console.error("Error checking for duplicate phone number:", error)
        } else if (data) {
          showAlert(`We've already saved a spot for you! This phone number is registered under "${data.name}". We are so excited to celebrate our new home with you! 🏡✨`);
          return; // Halt submission
        }
      } else {
        // Fallback duplicate check locally
        const duplicateLocal = currentList.find(item => item.phone && item.phone.trim() === rsvpForm.phone.trim())
        if (duplicateLocal) {
          showAlert(`We've already saved a spot for you! This phone number is registered under "${duplicateLocal.name}". We are so excited to celebrate our new home with you! 🏡✨`);
          return; // Halt submission
        }
      }
    }

    localStorage.setItem('housewarming_rsvp', JSON.stringify(rsvpForm))
    setRsvpSubmitted(true)
    playSoundEffect('/assets/rsvp_success.mp3')

    const existingIndex = currentList.findIndex(item => item.name.toLowerCase() === rsvpForm.name.toLowerCase())
    if (existingIndex > -1) {
      currentList[existingIndex] = { ...rsvpForm }
    } else {
      currentList.push({ ...rsvpForm })
    }
    localStorage.setItem('housewarming_rsvp_list', JSON.stringify(currentList))
    setRsvpList(currentList)

    // Calculate new total attending guests from currentList
    const newTotalGuests = currentList.reduce((acc, curr) => {
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
          message: rsvpForm.message,
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
          message: rsvpForm.message
        }])
      if (error) {
        console.error("Error saving RSVP to Supabase:", error)
      }
    }

    // Automatically add to guestbook as well if there's a message
    if (rsvpForm.message.trim()) {
      const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      const newWish = {
        id: Date.now(),
        name: rsvpForm.name,
        wish: rsvpForm.message,
        date: dateStr
      }
      const updatedWishes = [newWish, ...wishes]
      setWishes(updatedWishes)
      localStorage.setItem('housewarming_wishes', JSON.stringify(updatedWishes))

      if (supabase) {
        const { error } = await supabase
          .from('wishes')
          .insert([{
            name: rsvpForm.name,
            wish: rsvpForm.message,
            date: dateStr
          }])
        if (error) {
          console.error("Error saving automatic wish to Supabase:", error)
        }
      }
    }

    if (!isIntroComplete) {
      if (rsvpForm.attending === 'yes') {
        setEnvelopeStep(4)
      } else {
        handleSealEnvelope()
      }
    }
  }

  // Guestbook Form Handler
  const handleWishChange = (e) => {
    const { name, value } = e.target
    setGuestbookForm(prev => ({ ...prev, [name]: value }))
  }

  const handleWishSubmit = async (e) => {
    e.preventDefault()
    if (!guestbookForm.name.trim() || !guestbookForm.wish.trim()) return

    playSoundEffect('/assets/wish_success.mp3')

    // Submit to Netlify Forms (only on hosted site)
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode({
          "form-name": "guestbook",
          name: guestbookForm.name,
          wish: guestbookForm.wish
        })
      })
        .then(() => console.log("Netlify guestbook form submitted successfully"))
        .catch(error => console.error("Netlify guestbook form submission error:", error));
    }

    const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

    const newWish = {
      id: Date.now(),
      name: guestbookForm.name,
      wish: guestbookForm.wish,
      date: dateStr
    }

    const updatedWishes = [newWish, ...wishes]
    setWishes(updatedWishes)
    localStorage.setItem('housewarming_wishes', JSON.stringify(updatedWishes))

    if (supabase) {
      const { error } = await supabase
        .from('wishes')
        .insert([{
          name: guestbookForm.name,
          wish: guestbookForm.wish,
          date: dateStr
        }])
      if (error) {
        console.error("Error saving wish to Supabase:", error)
      }
    }

    setGuestbookForm({ name: '', wish: '' })
  }

  // Google Calendar Link generator
  const getGoogleCalendarLink = () => {
    const title = encodeURIComponent("Ramya & Ravikiran's Housewarming Celebration");
    const details = encodeURIComponent("Join us for our housewarming party and lunch to celebrate our new home!");
    const location = encodeURIComponent("No: 41, 1st A Cross, Adarsha layout, Ganapatipura, Konanakunte cross, Bangalore 560062");
    // Date formats: 20260705T100000 (Local time 10 AM to 3 PM)
    const dates = "20260705T043000Z/20260705T093000Z"; // UTC time equivalent (10 AM IST is 4:30 AM UTC)
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}`;
  }

  return (
    <div className="app-container">
      {/* Background Music */}
      <audio 
        ref={audioRef} 
        src={invitationMusic} 
        loop 
        preload="auto"
      />

      {/* Custom Alert Modal Overlay */}
      {customAlert.show && (
        <div className="custom-alert-overlay" onClick={() => setCustomAlert({ show: false, message: '' })}>
          <div className="custom-alert-card glass-card" onClick={(e) => e.stopPropagation()}>
            <div className="custom-alert-icon">
              <Sparkles size={24} />
            </div>
            <p className="custom-alert-message">{customAlert.message}</p>
            <button 
              onClick={() => setCustomAlert({ show: false, message: '' })} 
              className="btn-primary custom-alert-btn"
            >
              Okay
            </button>
          </div>
        </div>
      )}

      {/* Envelope Intro Overlay */}
      <div className={`envelope-overlay ${isIntroComplete ? 'fade-out' : ''}`}>
        {/* Falling Flower Petals inside overlay */}
        <div className="flower-petals-container">
          {PETALS.map((petal) => (
            <span 
              key={`intro-petal-${petal.id}`} 
              className="flower-petal"
              style={{
                left: petal.left,
                width: petal.size,
                height: petal.size,
                background: petal.color,
                animationDelay: petal.delay,
                animationDuration: petal.duration,
                '--drift': petal.drift,
                transform: `rotate(${petal.initialRotation})`,
              }}
            />
          ))}
        </div>

        <div className={`envelope-container ${isEnvelopeOpened ? 'opened' : ''}`} onClick={!isEnvelopeOpened ? handleOpenEnvelope : undefined}>
          <div className="envelope">
            <div className="envelope-flap"></div>
            <div className="envelope-pocket"></div>
            
            {/* The Letter Card inside */}
            <div className="envelope-card">
              <div className="envelope-card-content">
                {/* Step 0: Welcome & Countdown */}
                {envelopeStep === 0 && (
                  <div className="envelope-card-step" style={{ paddingTop: '18px' }}>
                    <span className="envelope-card-subtitle">New Beginnings</span>
                    <h2 className="envelope-card-title">WE ARE MOVING!</h2>
                    
                    <div className="section-divider" style={{ margin: '12px 0 15px' }}>
                      <div className="line" style={{ width: '40px' }}></div>
                      <div className="diamond"></div>
                      <div className="line" style={{ width: '40px' }}></div>
                    </div>

                    <p className="envelope-card-names">Ramya & Ravikiran</p>
                    <p className="envelope-card-msg">
                      A new home is a blank canvas. We warmly invite you to join us for our housewarming celebration as we step into this new chapter.
                    </p>
                    
                    {/* Countdown Timer */}
                    <div className="countdown-container" style={{ transform: 'scale(0.85)', margin: '5px 0 15px' }}>
                      <div className="countdown-item">
                        <span className="countdown-val">{timeLeft.days}</span>
                        <span className="countdown-lbl">Days</span>
                      </div>
                      <div className="countdown-item">
                        <span className="countdown-val">{timeLeft.hours}</span>
                        <span className="countdown-lbl">Hours</span>
                      </div>
                      <div className="countdown-item">
                        <span className="countdown-val">{timeLeft.minutes}</span>
                        <span className="countdown-lbl">Mins</span>
                      </div>
                      <div className="countdown-item">
                        <span className="countdown-val">{timeLeft.seconds}</span>
                        <span className="countdown-lbl">Secs</span>
                      </div>
                    </div>

                    <div className="stepper-nav">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setEnvelopeStep(1);
                        }} 
                        className="btn-stepper-next"
                        style={{ width: '100%' }}
                      >
                        See Our New Home
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 1: Gallery Slider */}
                {envelopeStep === 1 && (
                  <div className="envelope-card-step">
                    <span className="envelope-card-subtitle">A Glimpse Inside</span>
                    <h2 className="envelope-card-title" style={{ fontSize: '22px' }}>Our New Home</h2>
                    
                    <div className="mini-slider">
                      <div className="mini-slider-img-wrapper">
                        <img src={SLIDES[miniSlideIndex].url} alt={SLIDES[miniSlideIndex].title} className="mini-slider-img" />
                      </div>
                      <div className="mini-slider-controls">
                        <button 
                          type="button"
                          className="mini-slider-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            setMiniSlideIndex(prev => prev === 0 ? SLIDES.length - 1 : prev - 1);
                          }}
                        >
                          <ChevronLeft size={16} />
                        </button>
                        <span className="mini-slider-title">{miniSlideIndex + 1} / {SLIDES.length}</span>
                        <button 
                          type="button"
                          className="mini-slider-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            setMiniSlideIndex(prev => prev === SLIDES.length - 1 ? 0 : prev + 1);
                          }}
                        >
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="stepper-nav">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setEnvelopeStep(0);
                        }} 
                        className="btn-stepper-back"
                      >
                        Back
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setEnvelopeStep(2);
                        }} 
                        className="btn-stepper-next"
                      >
                        Celebration Details
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Celebration Details & Map */}
                {envelopeStep === 2 && (
                  <div className="envelope-card-step">
                    <span className="envelope-card-subtitle">Where & When</span>
                    <h2 className="envelope-card-title" style={{ fontSize: '22px' }}>Celebration Details</h2>
                    
                    <div className="mini-details-group">
                      <div className="mini-details-item">
                        <div className="mini-details-icon"><Calendar size={18} /></div>
                        <div className="mini-details-text">
                          <span className="mini-details-val">Sunday, July 5, 2026</span>
                          <span className="mini-details-lbl">Date</span>
                        </div>
                      </div>
                      <div className="mini-details-item">
                        <div className="mini-details-icon"><Clock size={18} /></div>
                        <div className="mini-details-text">
                          <span className="mini-details-val">10:00 AM Onwards</span>
                          <span className="mini-details-lbl">Time (Pooja followed by Lunch)</span>
                        </div>
                      </div>
                      <div className="mini-details-item">
                        <div className="mini-details-icon"><MapPin size={18} /></div>
                        <div className="mini-details-text">
                          <span className="mini-details-val" style={{ fontSize: '11px', lineHeight: '1.3' }}>
                            No: 41, 1st A Cross, Adarsha layout, Konanakunte cross, Bangalore
                          </span>
                          <span className="mini-details-lbl">Venue</span>
                        </div>
                      </div>
                    </div>

                    <div className="stepper-nav">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setEnvelopeStep(1);
                        }} 
                        className="btn-stepper-back"
                      >
                        Back
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setEnvelopeStep(3);
                        }} 
                        className="btn-stepper-next"
                      >
                        RSVP & Blessings
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: RSVP & Blessings Form */}
                {envelopeStep === 3 && (
                  <div className="envelope-card-step">
                    <span className="envelope-card-subtitle">Response</span>
                    <h2 className="envelope-card-title" style={{ fontSize: '20px', marginBottom: '8px' }}>Kindly RSVP</h2>
                    
                    <form 
                      onSubmit={handleRsvpSubmit} 
                      onClick={(e) => e.stopPropagation()} 
                      style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center' }}
                    >
                      <div className="form-group">
                        <label className="form-label" htmlFor="wz-rsvp-name">Your Full Name</label>
                        <input 
                          type="text" 
                          id="wz-rsvp-name" 
                          name="name" 
                          value={rsvpForm.name} 
                          onChange={handleRsvpChange} 
                          className="form-input" 
                          placeholder="Enter your name" 
                          required 
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label" htmlFor="wz-rsvp-phone">
                          Phone Number {rsvpForm.attending === 'no' && <span style={{ opacity: 0.6, fontSize: '11px' }}>(Optional)</span>}
                        </label>
                        <input 
                          type="tel" 
                          id="wz-rsvp-phone" 
                          name="phone" 
                          value={rsvpForm.phone} 
                          onChange={handleRsvpChange} 
                          className="form-input" 
                          placeholder={rsvpForm.attending === 'yes' ? "Enter phone number" : "Enter phone (optional)"} 
                          required={rsvpForm.attending === 'yes'} 
                        />
                      </div>

                      <div className="form-group">
                        <div className="radio-group">
                          <label className={`radio-label ${rsvpForm.attending === 'yes' ? 'selected' : ''}`}>
                            <input 
                              type="radio" 
                              name="attending" 
                              value="yes" 
                              checked={rsvpForm.attending === 'yes'} 
                              onChange={handleRsvpChange} 
                            />
                            <Check size={14} /> Attending
                          </label>
                          <label className={`radio-label ${rsvpForm.attending === 'no' ? 'selected' : ''}`}>
                            <input 
                              type="radio" 
                              name="attending" 
                              value="no" 
                              checked={rsvpForm.attending === 'no'} 
                              onChange={handleRsvpChange} 
                            />
                            Regretfully No
                          </label>
                        </div>
                      </div>

                      {rsvpForm.attending === 'yes' && (
                        <div className="form-group">
                          <label className="form-label" htmlFor="wz-rsvp-guests">Guests</label>
                          <select 
                            id="wz-rsvp-guests" 
                            name="guests" 
                            value={rsvpForm.guests} 
                            onChange={handleRsvpChange} 
                            className="form-input"
                          >
                            <option value="1">1 Person</option>
                            <option value="2">2 People</option>
                            <option value="3">3 People</option>
                            <option value="4">4 People</option>
                            <option value="5">5+ People</option>
                          </select>
                        </div>
                      )}

                      <div className="form-group">
                        <label className="form-label" htmlFor="wz-rsvp-message">Warm Wishes</label>
                        <textarea 
                          id="wz-rsvp-message" 
                          name="message" 
                          value={rsvpForm.message} 
                          onChange={handleRsvpChange} 
                          className="form-input" 
                          placeholder="Blessings for our new home" 
                          rows="2"
                          required
                          onInvalid={(e) => e.target.setCustomValidity("Please share your warm wishes or blessings! It would mean the world to us as we step into our new home. ❤️")}
                          onInput={(e) => e.target.setCustomValidity("")}
                        ></textarea>
                      </div>

                      <div className="stepper-nav" style={{ width: '100%', maxWidth: 'none' }}>
                        <button 
                          type="button" 
                          onClick={(e) => {
                            e.stopPropagation();
                            setEnvelopeStep(2);
                          }} 
                          className="btn-stepper-back"
                        >
                          Back
                        </button>
                        <button type="submit" className="btn-stepper-next">
                          Submit Response
                        </button>
                      </div>
                    </form>
                    
                    <span 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSealEnvelope();
                      }}
                      style={{ fontSize: '11px', marginTop: '10px', textDecoration: 'underline', color: 'var(--color-text-muted)', cursor: 'pointer' }}
                    >
                      Skip RSVP & Enter Site
                    </span>
                  </div>
                )}

                {/* Step 4: Add to Calendar */}
                {envelopeStep === 4 && (
                  <div className="envelope-card-step">
                    <span className="envelope-card-subtitle">Calendar Reminder</span>
                    <h2 className="envelope-card-title">Save the Date!</h2>
                    <div className="details-icon-wrapper" style={{ margin: '10px auto 15px', background: 'rgba(181, 148, 80, 0.1)', color: 'var(--color-gold)' }}>
                      <Sparkles size={24} />
                    </div>
                    <p className="envelope-card-msg">
                      We are absolutely thrilled that you will join us! Please save this celebration to your Google Calendar.
                    </p>

                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center', marginBottom: '15px' }}>
                      <a 
                        href={getGoogleCalendarLink()} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="btn-primary"
                        id="wz-btn-add-calendar"
                        style={{ width: '100%', maxWidth: '280px', textDecoration: 'none', padding: '10px 18px', fontSize: '14px' }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Sparkles size={16} />
                        Add to Calendar
                      </a>
                    </div>

                    <div className="stepper-nav">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSealEnvelope();
                        }} 
                        className="btn-stepper-next"
                        style={{ width: '100%', maxWidth: 'none' }}
                      >
                        Seal Response & Enter Site
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Envelope Cover Content - Top (Kalash & Subtitle) */}
            <div className="envelope-cover-top">
              {/* Gold Kalash SVG Outline */}
              <svg className="kalash-svg" width="48" height="48" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-gold)', display: 'block' }}>
                {/* Coconut */}
                <path d="M 44 48 C 41 38, 44 26, 50 18 C 56 26, 59 38, 56 48 Z" fill="rgba(181, 148, 80, 0.15)" />
                <path d="M 50 18 V 48" strokeWidth="1.5" strokeDasharray="2 3" />
                
                {/* Mango Leaves */}
                <path d="M 43 48 C 30 42, 22 30, 26 20 C 31 18, 38 28, 45 42" fill="rgba(181, 148, 80, 0.1)" />
                <path d="M 57 48 C 70 42, 78 30, 74 20 C 69 18, 62 28, 55 42" fill="rgba(181, 148, 80, 0.1)" />
                <path d="M 46 48 C 38 35, 38 22, 43 14 C 47 18, 48 30, 48 48" fill="rgba(181, 148, 80, 0.1)" />
                <path d="M 54 48 C 62 35, 62 22, 57 14 C 53 18, 52 30, 52 48" fill="rgba(181, 148, 80, 0.1)" />

                {/* Pot Neck / Rim */}
                <rect x="40" y="48" width="20" height="6" rx="2" fill="rgba(181, 148, 80, 0.2)" />
                
                {/* Pot Body */}
                <path d="M 41 54 C 28 56, 23 76, 35 84 C 40 87, 60 87, 65 84 C 77 76, 72 56, 59 54 Z" fill="rgba(181, 148, 80, 0.1)" />
                
                {/* Pot Base */}
                <path d="M 43 85 C 43 85, 45 88, 50 88 C 55 88, 57 85, 57 85" />
                
                {/* Swastika / Sacred Mark on Pot */}
                <path d="M 45 70 H 55 M 50 65 V 75 M 45 70 V 65 H 50 M 55 70 V 75 H 50" strokeWidth="1.5" />
                
                {/* Small dots around Swastika */}
                <circle cx="47.5" cy="67.5" r="1" fill="currentColor" stroke="none" />
                <circle cx="52.5" cy="67.5" r="1" fill="currentColor" stroke="none" />
                <circle cx="47.5" cy="72.5" r="1" fill="currentColor" stroke="none" />
                <circle cx="52.5" cy="72.5" r="1" fill="currentColor" stroke="none" />
              </svg>
              <span className="envelope-cover-subtitle">GRIHA PRAVESHA</span>
            </div>

            {/* Envelope Cover Content - Bottom (House Name) */}
            <div className="envelope-cover-bottom">
              {/* Gaja Lakshmi Icon flanking Lakshmi with elephants */}
              <svg className="gaja-lakshmi-svg" width="120" height="42" viewBox="0 0 140 50" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-gold)', margin: '12px auto 8px', display: 'block' }}>
                {/* Center Lakshmi on Lotus */}
                <path d="M 60 43 C 63 46, 77 46, 80 43" strokeWidth="1.5" />
                <path d="M 56 40 C 52 38, 62 33, 67 36" strokeWidth="1.5" />
                <path d="M 84 40 C 88 38, 78 33, 73 36" strokeWidth="1.5" />
                <path d="M 67 36 C 66 31, 74 31, 73 36" strokeWidth="1.5" />
                
                {/* Lakshmi Seated Torso & Head */}
                <circle cx="70" cy="18" r="3.5" />
                <path d="M 68 14 L 70 9 L 72 14 Z" fill="currentColor" stroke="none" />
                <path d="M 66 23 L 74 23 L 71 31 L 69 31 Z" />
                <path d="M 61 33 C 61 29, 79 29, 79 33 Z" fill="rgba(181, 148, 80, 0.15)" strokeWidth="1.5" />
                
                {/* Upper Hands holding Lotuses */}
                <path d="M 66 21 C 60 21, 57 16, 58 13" strokeWidth="1.2" />
                <circle cx="58" cy="12" r="1.5" fill="currentColor" stroke="none" />
                <path d="M 74 21 C 80 21, 83 16, 82 13" strokeWidth="1.2" />
                <circle cx="82" cy="12" r="1.5" fill="currentColor" stroke="none" />
                
                {/* Lower Hands Mudra & Gold Coins */}
                <path d="M 66 25 H 62 V 20" strokeWidth="1.2" />
                <path d="M 74 25 H 78 V 30" strokeWidth="1.2" />
                <circle cx="78" cy="33" r="0.8" fill="currentColor" stroke="none" />
                <circle cx="79" cy="36" r="0.6" fill="currentColor" stroke="none" />
                <circle cx="77" cy="39" r="0.4" fill="currentColor" stroke="none" />
                
                {/* Left Elephant (facing right) */}
                <path d="M 12 36 C 12 26, 17 20, 29 20" />
                <circle cx="31" cy="22" r="4.5" />
                <path d="M 28 20 C 25 20, 25 26, 28 26 Z" strokeWidth="1.2" />
                <path d="M 35 23 C 39 23, 43 18, 40 10 C 38 6, 33 8, 35 13 C 36 16, 35 18, 33 19" strokeWidth="1.8" />
                <path d="M 40 8 C 42 6, 45 6, 47 9 C 45 11, 41 11, 40 8 Z" fill="currentColor" stroke="none" />
                <path d="M 47 10 C 52 12, 57 13, 63 14" strokeWidth="1" strokeDasharray="1.5 2" />
                <path d="M 30 27 V 39" />
                <path d="M 15 32 V 39" />
                <path d="M 12 32 C 10 32, 9 35, 10 38" strokeWidth="1" />

                {/* Right Elephant (facing left) */}
                <path d="M 128 36 C 128 26, 123 20, 111 20" />
                <circle cx="109" cy="22" r="4.5" />
                <path d="M 112 20 C 115 20, 115 26, 112 26 Z" strokeWidth="1.2" />
                <path d="M 105 23 C 101 23, 97 18, 100 10 C 102 6, 107 8, 105 13 C 104 16, 105 18, 107 19" strokeWidth="1.8" />
                <path d="M 100 8 C 98 6, 95 6, 93 9 C 95 11, 99 11, 100 8 Z" fill="currentColor" stroke="none" />
                <path d="M 93 10 C 88 12, 83 13, 77 14" strokeWidth="1" strokeDasharray="1.5 2" />
                <path d="M 110 27 V 39" />
                <path d="M 125 32 V 39" />
                <path d="M 128 32 C 130 32, 131 35, 130 38" strokeWidth="1" />
              </svg>
              <h1 className="envelope-cover-title">Laxmi Kote</h1>
            </div>

            <div className="wax-seal">
              <span className="wax-seal-inner">R&R</span>
            </div>
          </div>
        </div>

        {!isEnvelopeOpened && (
          <p className="envelope-prompt">
            You have received an invitation<br />
            <span style={{ fontSize: '12px', opacity: 0.7, letterSpacing: '1px' }}>Click wax seal to open</span>
          </p>
        )}
      </div>

      {/* Floating Music Control Button */}
      <div className="music-control-wrapper">
        {isPlaying && (
          <div className="music-visualizer-container">
            <div className="music-icon-active">
              <span className="bar"></span>
              <span className="bar"></span>
              <span className="bar"></span>
              <span className="bar"></span>
            </div>
          </div>
        )}
        <button 
          onClick={togglePlay} 
          className={`music-btn ${isPlaying ? 'playing' : ''}`}
          aria-label={isPlaying ? "Pause background music" : "Play background music"}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>
        <span className="music-tooltip">
          {isPlaying ? "Pause Music" : "Play Music"}
        </span>
      </div>

      {/* Decorative Orbs */}
      <div className="ambient-glow top-left"></div>
      <div className="ambient-glow middle"></div>
      <div className="ambient-glow bottom-right"></div>

      <div className="content-wrapper">
        
        {isIntroComplete && (
          <header className="revealed-header glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', textAlign: 'center', animation: 'stepFadeIn 0.8s ease' }}>
            <span className="section-subtitle">Welcome to our new home!</span>
            <h1 className="house-name-title" style={{ fontSize: '42px', margin: '5px 0' }}>Laxmi Kote</h1>
            <p className="envelope-card-names" style={{ margin: '0 0 10px' }}>Ramya & Ravikiran</p>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '16px', maxWidth: '600px', lineHeight: '1.6' }}>
              We are excited to step into our new home, <span style={{ color: 'var(--color-gold)', fontWeight: 'bold' }}>Laxmi Kote</span>! Thank you for celebrating this milestone with us!
            </p>
            
            <div className="rsvp-attending-count-badge" style={{ margin: '5px 0 0' }}>
              <Users size={16} />
              <span>{totalAttendingGuests} guests attending</span>
            </div>

            {rsvpList.filter(r => r.attending === 'yes').length > 0 && (
              <div className="rsvp-attending-names-preview" style={{ width: '100%', maxWidth: '500px', margin: '5px 0 0' }}>
                <strong>Joined by:</strong> {rsvpList.filter(r => r.attending === 'yes').map(r => r.name).join(', ')}
              </div>
            )}
          </header>
        )}

        {!isIntroComplete && (
          <>
            {/* HERO SECTION */}
            <header className="hero-section" id="home">
          <div className="hero-border-frame glass-card">
            {/* Falling Flower Petals Effect */}
            <div className="flower-petals-container">
              {PETALS.map((petal) => (
                <span 
                  key={petal.id} 
                  className="flower-petal"
                  style={{
                    left: petal.left,
                    width: petal.size,
                    height: petal.size,
                    background: petal.color,
                    animationDelay: petal.delay,
                    animationDuration: petal.duration,
                    '--drift': petal.drift,
                    transform: `rotate(${petal.initialRotation})`,
                  }}
                />
              ))}
            </div>

            <div className="hero-card">
              <span className="hero-header-ornament">New Beginnings</span>
              <h1 className="hero-main-title">WE ARE MOVING!</h1>
              <p className="hero-names">Ramya & Ravikiran</p>
              
              <div className="section-divider">
                <div className="line"></div>
                <div className="diamond"></div>
                <div className="line"></div>
              </div>

              <p className="hero-tagline">
                A new home is a blank canvas, and we cannot wait to fill it with the colors of laughter, friendship, and family. We warmly invite you to join us for our housewarming celebration as we step into this new chapter.
              </p>

              {/* Countdown Timer */}
              <div className="countdown-container">
                <div className="countdown-item">
                  <span className="countdown-val">{timeLeft.days}</span>
                  <span className="countdown-lbl">Days</span>
                </div>
                <div className="countdown-item">
                  <span className="countdown-val">{timeLeft.hours}</span>
                  <span className="countdown-lbl">Hours</span>
                </div>
                <div className="countdown-item">
                  <span className="countdown-val">{timeLeft.minutes}</span>
                  <span className="countdown-lbl">Mins</span>
                </div>
                <div className="countdown-item">
                  <span className="countdown-val">{timeLeft.seconds}</span>
                  <span className="countdown-lbl">Secs</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* PHOTOGRAPH GALLERY SECTION */}
        <section id="gallery">
          <div className="section-title-container">
            <span className="section-subtitle">A Glimpse Inside</span>
            <h2 className="section-title">Our New Home</h2>
            <div className="section-divider">
              <div className="line"></div>
              <div className="diamond"></div>
              <div className="line"></div>
            </div>
          </div>

          <div className="gallery-container glass-card">
            <div className="gallery-slider-wrapper">
              {SLIDES.map((slide, index) => (
                <div 
                  key={index} 
                  className={`gallery-slide ${index === currentSlide ? 'active' : ''}`}
                >
                  <img src={slide.url} alt={slide.title} />
                  <div className="gallery-slide-overlay">
                    <p className="gallery-slide-desc">{slide.desc}</p>
                  </div>
                </div>
              ))}
              
              <button 
                className="gallery-arrow prev" 
                onClick={prevSlide}
                aria-label="Previous image"
              >
                <ChevronLeft size={24} />
              </button>
              
              <button 
                className="gallery-arrow next" 
                onClick={nextSlide}
                aria-label="Next image"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            <div className="gallery-indicators">
              {SLIDES.map((_, index) => (
                <span 
                  key={index} 
                  className={`gallery-dot ${index === currentSlide ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(index)}
                ></span>
              ))}
            </div>
          </div>
        </section>

        {/* DETAILS & RSVP SECTION */}
        <section id="details">
          <div className="details-rsvp-grid">
            
            {/* Event Details Card */}
            <div className="glass-card event-details-card">
              <h2 className="rsvp-title">Celebration Details</h2>
              
              <div className="details-row">
                <div className="details-icon-wrapper">
                  <Calendar size={22} />
                </div>
                <div className="details-text-group">
                  <span className="details-label">Date</span>
                  <span className="details-value-main">Sunday, July 5, 2026</span>
                  <span className="details-value-sub">Mark your calendars!</span>
                </div>
              </div>

              <div className="details-row">
                <div className="details-icon-wrapper">
                  <Clock size={22} />
                </div>
                <div className="details-text-group">
                  <span className="details-label">Time</span>
                  <span className="details-value-main">10:00 AM Onwards</span>
                  <span className="details-value-sub">Pooja followed by Lunch</span>
                </div>
              </div>

              <div className="details-row">
                <div className="details-icon-wrapper">
                  <MapPin size={22} />
                </div>
                <div className="details-text-group">
                  <span className="details-label">Venue</span>
                  <span className="details-value-main">No: 41, 1st A Cross</span>
                  <span className="details-value-sub">Adarsha layout, Ganapatipura, Konanakunte cross, Bangalore 560062</span>
                </div>
              </div>

              <div className="action-btn-container">
                <a 
                  href={getGoogleCalendarLink()} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn-primary"
                  id="btn-add-calendar"
                >
                  <Sparkles size={18} />
                  Add to Calendar
                </a>
              </div>
            </div>

            {/* RSVP Form Card */}
            <div className="glass-card rsvp-form-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <h2 className="rsvp-title" style={{ marginBottom: '10px', textAlign: 'center' }}>Kindly RSVP</h2>
              
              <div className="rsvp-attending-count-badge">
                <Users size={16} />
                <span>{totalAttendingGuests} guests attending</span>
              </div>

              {!rsvpSubmitted ? (
                <form onSubmit={handleRsvpSubmit} style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                  
                  <div className="form-group">
                    <label className="form-label" htmlFor="rsvp-name">Your Full Name</label>
                    <input 
                      type="text" 
                      id="rsvp-name" 
                      name="name" 
                      value={rsvpForm.name} 
                      onChange={handleRsvpChange} 
                      className="form-input" 
                      placeholder="Enter your name" 
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="rsvp-phone">
                      Phone Number {rsvpForm.attending === 'no' && <span style={{ opacity: 0.6, fontSize: '13px' }}>(Optional)</span>}
                    </label>
                    <input 
                      type="tel" 
                      id="rsvp-phone" 
                      name="phone" 
                      value={rsvpForm.phone} 
                      onChange={handleRsvpChange} 
                      className="form-input" 
                      placeholder={rsvpForm.attending === 'yes' ? "Enter your phone number" : "Enter your phone number (optional)"} 
                      required={rsvpForm.attending === 'yes'} 
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Will you attend?</label>
                    <div className="radio-group">
                      <label className={`radio-label ${rsvpForm.attending === 'yes' ? 'selected' : ''}`}>
                        <input 
                          type="radio" 
                          name="attending" 
                          value="yes" 
                          checked={rsvpForm.attending === 'yes'} 
                          onChange={handleRsvpChange} 
                        />
                        <Check size={16} /> Yes, I will come
                      </label>
                      <label className={`radio-label ${rsvpForm.attending === 'no' ? 'selected' : ''}`}>
                        <input 
                          type="radio" 
                          name="attending" 
                          value="no" 
                          checked={rsvpForm.attending === 'no'} 
                          onChange={handleRsvpChange} 
                        />
                        Regretfully No
                      </label>
                    </div>
                  </div>

                  {rsvpForm.attending === 'yes' && (
                    <div className="form-group">
                      <label className="form-label" htmlFor="rsvp-guests">Number of Guests</label>
                      <select 
                        id="rsvp-guests" 
                        name="guests" 
                        value={rsvpForm.guests} 
                        onChange={handleRsvpChange} 
                        className="form-input"
                      >
                        <option value="1">1 Person</option>
                        <option value="2">2 People</option>
                        <option value="3">3 People</option>
                        <option value="4">4 People</option>
                        <option value="5">5+ People</option>
                      </select>
                    </div>
                  )}

                  <div className="form-group">
                    <label className="form-label" htmlFor="rsvp-message">Message / Warm Wishes</label>
                    <textarea 
                      id="rsvp-message" 
                      name="message" 
                      value={rsvpForm.message} 
                      onChange={handleRsvpChange} 
                      className="form-input" 
                      placeholder="Leave a message for our new home" 
                      rows="3"
                      required
                      onInvalid={(e) => e.target.setCustomValidity("Please share your warm wishes or blessings! It would mean the world to us as we step into our new home. ❤️")}
                      onInput={(e) => e.target.setCustomValidity("")}
                    ></textarea>
                  </div>

                  <button type="submit" className="btn-primary" style={{ width: '100%' }} id="btn-submit-rsvp">
                    Confirm Attendance
                  </button>
                </form>
              ) : (
                <div className="rsvp-success-state" style={{ width: '100%' }}>
                  <div className="success-icon-wrapper" style={{ margin: '0 auto 10px' }}>
                    <Heart size={36} fill="currentColor" />
                  </div>
                  <h3 className="rsvp-title" style={{ marginBottom: '5px', textAlign: 'center' }}>Thank You!</h3>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '15px', lineHeight: '1.6', marginBottom: '20px', textAlign: 'center' }}>
                    {rsvpForm.attending === 'yes' 
                      ? "Your response has been saved. We are thrilled to celebrate this special day with you!"
                      : "Your response has been saved. We will miss you! We would love it if you could leave a message of blessing in our Guestbook."
                    }
                  </p>

                  <button 
                    onClick={() => {
                      localStorage.removeItem('housewarming_rsvp')
                      setRsvpSubmitted(false)
                    }} 
                    className="btn-secondary"
                    id="btn-edit-rsvp"
                    style={{ display: 'block', margin: '0 auto', width: '100%' }}
                  >
                    Change RSVP Response
                  </button>
                </div>
              )}
              
              {/* Joined Guest Names Preview */}
              {rsvpList.filter(r => r.attending === 'yes').length > 0 && (
                <div className="rsvp-attending-names-preview" style={{ width: '100%' }}>
                  <strong>Joined by:</strong> {rsvpList.filter(r => r.attending === 'yes').map(r => r.name).join(', ')}
                </div>
              )}
            </div>

          </div>
        </section>
          </>
        )}

        {/* VENUE MAP SECTION */}
        <section id="map">
          <div className="section-title-container">
            <span className="section-subtitle">Find Your Way</span>
            <h2 className="section-title">Route Map</h2>
            <div className="section-divider">
              <div className="line"></div>
              <div className="diamond"></div>
              <div className="line"></div>
            </div>
          </div>

          <div className="glass-card map-section-card">
            <div className="map-wrapper">
              {/* Google Maps Stylized Iframe pointing to the Bangalore address */}
              <iframe 
                title="Venue Location Map"
                src="https://maps.google.com/maps?q=12.888201,77.567145&t=&z=15&ie=UTF8&iwloc=&output=embed"
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            <div className="map-details-container">
              <div className="map-address-box">
                <h3>New Residence</h3>
                <p>
                  No: 41, 1st A Cross, Adarsha layout, Ganapatipura, Konanakunte cross, Bangalore - 560062.<br />
                  <strong>Landmark:</strong> Near Konanakunte Cross.
                </p>
              </div>
              <div>
                <a 
                  href="https://www.google.com/maps/dir/?api=1&destination=12.888201,77.567145" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn-primary"
                  id="btn-get-directions"
                >
                  <MapPin size={18} />
                  Get Directions
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* GUESTBOOK SECTION */}
        <section id="guestbook">
          <div className="section-title-container">
            <span className="section-subtitle">Warm Wishes</span>
            <h2 className="section-title">Home Guestbook</h2>
            <div className="section-divider">
              <div className="line"></div>
              <div className="diamond"></div>
              <div className="line"></div>
            </div>
          </div>

          <div className="guestbook-section">
            {/* Wish Submission Form */}
            <div className="glass-card guestbook-form-card">
              <form onSubmit={handleWishSubmit}>
                <h3 className="rsvp-title" style={{ fontSize: '20px', textAlign: 'center', marginBottom: '15px' }}>Leave a Blessing</h3>
                <div className="form-group">
                  <label className="form-label" htmlFor="wish-name">Your Name</label>
                  <input 
                    type="text" 
                    id="wish-name" 
                    name="name" 
                    value={guestbookForm.name} 
                    onChange={handleWishChange} 
                    className="form-input" 
                    placeholder="Enter your name" 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="wish-text">Your Wish / Message</label>
                  <textarea 
                    id="wish-text" 
                    name="wish" 
                    value={guestbookForm.wish} 
                    onChange={handleWishChange} 
                    className="form-input" 
                    placeholder="Write your blessings for our new home..." 
                    rows="3" 
                    required
                  ></textarea>
                </div>
                <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} id="btn-submit-wish">
                  <Send size={18} />
                  Send Wishes
                </button>
              </form>
            </div>

            {/* Wishes Wall */}
            <div className="guestbook-wall">
              {wishes.length > 0 ? (
                wishes.map((item) => (
                  <div key={item.id} className="guestbook-note">
                    <p className="note-message">"{item.wish}"</p>
                    <div className="note-footer">
                      <span className="note-author">{item.name}</span>
                      <span className="note-date">{item.date}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="guestbook-empty">
                  No wishes posted yet. Be the first to leave a warm message!
                </div>
              )}
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer>
          <p className="footer-logo">Ramya & Ravikiran</p>
          <p className="footer-text">Made with ❤️ • Excited to welcome you home</p>
        </footer>

      </div>
    </div>
  )
}

export default App
