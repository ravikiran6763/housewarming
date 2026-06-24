import { createSlice } from '@reduxjs/toolkit';

// Safe date parsing for cross-browser support (specifically Safari/iOS)
export const safeParseDate = (dateStr) => {
  if (!dateStr) return new Date();
  if (typeof dateStr === 'string') {
    const formatted = dateStr.trim().replace(' ', 'T');
    return new Date(formatted);
  }
  return new Date(dateStr);
};

// Default template configuration
export const DEFAULT_CONFIG = {
  hostNames: 'Ramyashree & Ravikiran',
  houseName: 'Laxmi Kote',
  waxSealInitials: 'R&R',
  headerOrnament: 'New Beginnings',
  invitationMessage: 'We built a house, now help us make it a home with your presence and blessings.',
  eventType: 'GRIHA PRAVESHA',
  
  targetDate: '2026-07-05T10:00:00',
  displayDate: 'Sunday, July 5, 2026',
  displayTime: '10:00 AM Onwards',
  scheduleDetails: 'Pooja followed by Lunch',
  
  venueLine1: 'No: 41, 1st A Cross',
  venueLine2: 'Adarsha layout, Ganapatipura, Konanakunte cross, Bangalore 560062',
  landmark: 'Near Konanakunte Cross',
  latitude: '12.888201',
  longitude: '77.567145',
  
  theme: 'marigold', 
  petals: 'marigold', 
  envelopeArt: 'kalash_lakshmi', 
  
  musicType: 'traditional_flute', 
  customMusicUrl: '',
  
  showCountdown: true,
  showGallery: true,
  showRsvp: true,
  showGuestbook: true,
  
  eventId: 'laxmi-kote-default',
  slides: [] 
};

const KEY_MAP = {
  hostNames: 'hn',
  houseName: 'h',
  waxSealInitials: 'ws',
  headerOrnament: 'ho',
  invitationMessage: 'im',
  eventType: 'et',
  targetDate: 'td',
  displayDate: 'dd',
  displayTime: 'dt',
  scheduleDetails: 'sd',
  venueLine1: 'v1',
  venueLine2: 'v2',
  landmark: 'lm',
  latitude: 'lat',
  longitude: 'lng',
  theme: 't',
  petals: 'p',
  envelopeArt: 'ea',
  musicType: 'mt',
  customMusicUrl: 'cmu',
  showCountdown: 'sc',
  showGallery: 'sg',
  showRsvp: 'sr',
  showGuestbook: 'sgb',
  eventId: 'eid',
  slides: 'sld'
};

const REVERSE_KEY_MAP = Object.fromEntries(
  Object.entries(KEY_MAP).map(([k, v]) => [v, k])
);

const safeBtoa = (str) => {
  try {
    return btoa(unescape(encodeURIComponent(str)));
  } catch (e) {
    console.error("Base64 encoding failed:", e);
    return "";
  }
};

const safeAtob = (str) => {
  try {
    return decodeURIComponent(escape(atob(str)));
  } catch (e) {
    console.error("Base64 decoding failed:", e);
    return "";
  }
};

export const compressConfig = (config) => {
  const compressed = {};
  for (const [key, value] of Object.entries(config)) {
    if (KEY_MAP[key]) {
      if (JSON.stringify(value) === JSON.stringify(DEFAULT_CONFIG[key])) {
        continue;
      }
      compressed[KEY_MAP[key]] = value;
    }
  }
  return compressed;
};

export const decompressConfig = (compressed) => {
  const decompressed = { ...DEFAULT_CONFIG };
  for (const [key, value] of Object.entries(compressed)) {
    if (REVERSE_KEY_MAP[key]) {
      decompressed[REVERSE_KEY_MAP[key]] = value;
    }
  }
  return decompressed;
};

export const generateShareableLink = (config) => {
  const compressed = compressConfig(config);
  const jsonStr = JSON.stringify(compressed);
  const b64 = safeBtoa(jsonStr);
  const url = new URL(window.location.origin + window.location.pathname);
  if (Object.keys(compressed).length > 0) {
    url.searchParams.set('config', b64);
  }
  return url.toString();
};

export const loadConfigFromUrl = () => {
  try {
    const params = new URLSearchParams(window.location.search);
    const configB64 = params.get('config');
    if (configB64) {
      const jsonStr = safeAtob(configB64);
      if (jsonStr) {
        const compressed = JSON.parse(jsonStr);
        return decompressConfig(compressed);
      }
    }
  } catch (e) {
    console.error("Failed to parse URL config:", e);
  }
  return DEFAULT_CONFIG;
};

const getInitialConfig = () => {
  const urlConfig = loadConfigFromUrl();
  const searchParams = new URLSearchParams(window.location.search);
  if (searchParams.has('config')) {
    return urlConfig;
  }
  const savedDraft = localStorage.getItem('housewarming_config_draft');
  if (savedDraft) {
    try {
      return JSON.parse(savedDraft);
    } catch (e) {
      console.error("Failed to parse config draft", e);
    }
  }
  return urlConfig || DEFAULT_CONFIG;
};

const initialState = {
  eventConfig: getInitialConfig()
};

const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    updateEventConfig(state, action) {
      state.eventConfig = action.payload;
      localStorage.setItem('housewarming_config_draft', JSON.stringify(action.payload));
    },
    resetEventConfig(state) {
      state.eventConfig = DEFAULT_CONFIG;
      localStorage.removeItem('housewarming_config_draft');
    }
  }
});

export const { updateEventConfig, resetEventConfig } = eventSlice.actions;

export default eventSlice.reducer;
