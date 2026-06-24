import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './uiSlice';
import eventReducer from './eventSlice';
import dbReducer from './dbSlice';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    event: eventReducer,
    db: dbReducer
  }
});

export default store;
