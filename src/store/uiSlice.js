import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isCustomizerOpen: window.location.hash === '#/customize' || window.location.hash === '#customize',
  isEnvelopeOpened: false,
  isIntroComplete: false,
  envelopeStep: 0,
  customAlert: { show: false, message: '' },
  lightboxImageIndex: null,
  currentView: (() => {
    const hash = window.location.hash;
    if (hash === '#host' || hash === '#/host') return 'host';
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('view') === 'host' || searchParams.has('host')) return 'host';
    return 'invitation';
  })()
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleCustomizer(state, action) {
      state.isCustomizerOpen = action.payload;
    },
    setEnvelopeOpened(state, action) {
      state.isEnvelopeOpened = action.payload;
    },
    setIntroComplete(state, action) {
      state.isIntroComplete = action.payload;
    },
    setEnvelopeStep(state, action) {
      state.envelopeStep = action.payload;
    },
    showAlert(state, action) {
      state.customAlert = { show: true, message: action.payload };
    },
    hideAlert(state) {
      state.customAlert = { show: false, message: '' };
    },
    setLightboxImageIndex(state, action) {
      state.lightboxImageIndex = action.payload;
    },
    setCurrentView(state, action) {
      state.currentView = action.payload;
    }
  }
});

export const {
  toggleCustomizer,
  setEnvelopeOpened,
  setIntroComplete,
  setEnvelopeStep,
  showAlert,
  hideAlert,
  setLightboxImageIndex,
  setCurrentView
} = uiSlice.actions;

export default uiSlice.reducer;
