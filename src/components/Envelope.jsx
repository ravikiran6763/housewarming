import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Sparkles } from 'lucide-react';
import { setEnvelopeOpened, setIntroComplete } from '../store/uiSlice';

// Falling flower petals configuration layouts
const PETAL_LAYOUTS = Array.from({ length: 40 }).map((_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  size: `${Math.random() * 12 + 8}px`, // Petal size (8px to 20px)
  delay: `${Math.random() * 8}s`,
  duration: `${Math.random() * 5 + 6}s`, // Falling speed
  drift: `${Math.random() * 100 - 50}px`, // Swaying amount
  initialRotation: `${Math.random() * 360}deg`,
  colorIndex: Math.floor(Math.random() * 4)
}));

// Falling particles gradient colors
const PETAL_COLORS_MAP = {
  marigold: [
    'linear-gradient(135deg, #ff9f00, #ff5e00)',
    'linear-gradient(135deg, #ffe066, #f5c000)',
    'linear-gradient(135deg, #ff758c, #ff7eb3)',
    'linear-gradient(135deg, #ff4e50, #f9d423)',
  ],
  rose: [
    'linear-gradient(135deg, #e63946, #b70918)',
    'linear-gradient(135deg, #ff4d6d, #ff85a1)',
    'linear-gradient(135deg, #ffb3c1, #ffccd5)',
    'linear-gradient(135deg, #a70000, #5c0000)',
  ],
  gold: [
    'linear-gradient(135deg, #ffe066, #f5c000)',
    'linear-gradient(135deg, #ffd700, #b8860b)',
    'linear-gradient(135deg, #ffffff, #ffe066)',
    'linear-gradient(135deg, #f9d423, #ff4e50)',
  ],
  cherry: [
    'linear-gradient(135deg, #ffccd5, #ffb3c1)',
    'linear-gradient(135deg, #ff85a1, #ff4d6d)',
    'linear-gradient(135deg, #fff0f3, #ffccd5)',
    'linear-gradient(135deg, #ff7096, #ff85a1)',
  ],
  leaves: [
    'linear-gradient(135deg, #2d5a4c, #122e24)',
    'linear-gradient(135deg, #74c69d, #52b788)',
    'linear-gradient(135deg, #f5cc00, #b8860b)',
    'linear-gradient(135deg, #d8a48f, #9c7b6c)',
  ]
};

// Sound effect helper
const playSoundEffect = (src) => {
  const sfx = new Audio(src);
  sfx.volume = 0.5;
  sfx.play().catch((err) => {
    console.log("Sound effect playback blocked or failed:", err);
  });
};

export function Envelope({ onOpenEnvelope }) {
  const dispatch = useDispatch();
  const eventConfig = useSelector((state) => state.event.eventConfig);
  const { isEnvelopeOpened, isIntroComplete } = useSelector((state) => state.ui);

  const handleOpen = () => {
    dispatch(setEnvelopeOpened(true));
    playSoundEffect('/assets/wish_success.mp3');
    
    if (onOpenEnvelope) {
      onOpenEnvelope();
    }
    
    // Auto-transition to main page after opening animation completes (1.5s)
    setTimeout(() => {
      dispatch(setIntroComplete(true));
    }, 1500);
  };

  return (
    <div className={`envelope-overlay ${isIntroComplete ? 'fade-out' : ''}`}>
      {/* Falling Flower Petals inside overlay */}
      <div className="flower-petals-container">
        {PETAL_LAYOUTS.map((petal) => {
          const colors = PETAL_COLORS_MAP[eventConfig.petals] || PETAL_COLORS_MAP.marigold;
          const petalColor = colors[petal.colorIndex % colors.length];
          return (
            <span 
              key={`intro-petal-${petal.id}`} 
              className="flower-petal"
              style={{
                left: petal.left,
                width: petal.size,
                height: petal.size,
                background: petalColor,
                animationDelay: petal.delay,
                animationDuration: petal.duration,
                '--drift': petal.drift,
                transform: `rotate(${petal.initialRotation})`,
              }}
            />
          );
        })}
      </div>

      <div 
        className={`envelope-container ${isEnvelopeOpened ? 'opened' : ''}`} 
        onClick={!isEnvelopeOpened ? handleOpen : undefined}
      >
        <div className="envelope">
          <div className="envelope-flap"></div>
          <div className="envelope-pocket"></div>
          
          {/* The Letter Card inside */}
          <div className="envelope-card">
            <div className="envelope-card-content">
              <div className="envelope-card-step" style={{ paddingTop: '24px' }}>
                <span className="envelope-card-subtitle">{eventConfig.headerOrnament}</span>
                <h2 className="envelope-card-title">WE ARE MOVING!</h2>
                
                <div className="section-divider" style={{ margin: '15px 0 20px' }}>
                  <div className="line" style={{ width: '50px' }}></div>
                  <div className="diamond"></div>
                  <div className="line" style={{ width: '50px' }}></div>
                </div>

                <p className="envelope-card-names">{eventConfig.hostNames}</p>
                <p className="envelope-card-msg" style={{ fontSize: '15px', lineHeight: '1.6', maxWidth: '320px', margin: '0 auto' }}>
                  {eventConfig.invitationMessage}
                </p>
              </div>
            </div>
          </div>

          {/* Envelope Cover Content - Top (Art & Subtitle) */}
          <div className="envelope-cover-top">
            {eventConfig.envelopeArt === 'kalash_lakshmi' ? (
              <svg className="kalash-svg" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
            ) : eventConfig.envelopeArt === 'modern_home' ? (
              <svg className="modern-house-svg" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '80px', height: '80px', margin: '0 auto', color: 'var(--color-gold)' }}>
                <path d="M15 45L50 15L85 45V85H15V45Z" fill="rgba(181, 148, 80, 0.05)" />
                <path d="M42 85V60H58V85" />
                <rect x="25" y="52" width="12" height="12" rx="1" />
                <rect x="63" y="52" width="12" height="12" rx="1" />
                <path d="M68 20V31" />
              </svg>
            ) : (
              <svg className="floral-wreath-svg" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: '80px', height: '80px', margin: '0 auto', color: 'var(--color-gold)' }}>
                <circle cx="50" cy="50" r="35" strokeDasharray="5 2 2 2" opacity="0.3" />
                <path d="M20 50 C20 30, 35 15, 50 15 C58 15, 66 18, 72 24" />
                <path d="M20 50 C20 70, 35 85, 50 85 C68 85, 80 70, 80 50" />
                <path d="M20 50 L15 47 M25 40 L20 35 M32 30 L28 24 M42 20 L39 13 M50 15 L52 8 M60 20 L64 14 M70 25 L75 20" />
                <path d="M20 50 L25 53 M23 60 L28 65 M30 70 L35 75 M40 80 L43 87 M50 85 L48 92 M60 80 L56 86 M70 75 L67 81 M80 50 L85 47 M78 40 L83 35" />
              </svg>
            )}
            <span className="envelope-cover-subtitle">{eventConfig.eventType}</span>
          </div>

          {/* Envelope Cover Content - Bottom (House Name) */}
          <div className="envelope-cover-bottom">
            {eventConfig.envelopeArt === 'kalash_lakshmi' ? (
              <svg className="gaja-lakshmi-svg" viewBox="0 0 140 50" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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
            ) : (
              <svg className="modern-bottom-svg" viewBox="0 0 140 30" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '120px', height: '30px', margin: '0 auto 15px', color: 'var(--color-gold)', display: 'block' }}>
                <path d="M10 15 H55 M130 15 H85" opacity="0.5" />
                <circle cx="70" cy="15" r="4" fill="currentColor" />
                <path d="M62 15 C60 10, 58 15, 55 12" />
                <path d="M78 15 C80 10, 82 15, 85 12" />
              </svg>
            )}
            <h1 className="envelope-cover-title">{eventConfig.houseName}</h1>
          </div>

          <div 
            className="wax-seal" 
            onClick={!isEnvelopeOpened ? (e) => { e.stopPropagation(); handleOpen(); } : undefined}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (!isEnvelopeOpened && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                e.stopPropagation();
                handleOpen();
              }
            }}
            aria-label="Open invitation"
          >
            <span className="wax-seal-inner">{eventConfig.waxSealInitials}</span>
            {!isEnvelopeOpened && (
              <div className="tap-indicator">
                <div className="tap-ripple"></div>
                <svg className="tap-hand" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 11V3a1.5 1.5 0 0 1 3 0v8M13 11v-2a1.5 1.5 0 0 1 3 0v2M16 11V9.5a1.5 1.5 0 0 1 3 0v1.5M19 11v-1a1.5 1.5 0 0 1 3 0v5a7 7 0 0 1-14 0v-2a1.5 1.5 0 0 1 3 0v2" />
                  <path d="M8 12V9a1.5 1.5 0 0 1 3 0v3" />
                </svg>
              </div>
            )}
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
  );
}

export default Envelope;
