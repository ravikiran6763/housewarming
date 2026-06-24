import React from 'react';
import { Sparkles } from 'lucide-react';

export function CustomAlert({ show, message, onClose }) {
  if (!show) return null;
  
  return (
    <div className="custom-alert-overlay" onClick={onClose}>
      <div className="custom-alert-card glass-card" onClick={(e) => e.stopPropagation()}>
        <div className="custom-alert-icon">
          <Sparkles size={24} />
        </div>
        <p className="custom-alert-message">{message}</p>
        <button 
          onClick={onClose} 
          className="btn-primary custom-alert-btn"
        >
          Okay
        </button>
      </div>
    </div>
  );
}

export default CustomAlert;
