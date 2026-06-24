import React from 'react';
import { useSelector } from 'react-redux';
import { useCountdown } from '../hooks/useCountdown';

const PETAL_LAYOUTS = Array.from({ length: 40 }).map((_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  size: `${Math.random() * 12 + 8}px`,
  delay: `${Math.random() * 8}s`,
  duration: `${Math.random() * 5 + 6}s`,
  drift: `${Math.random() * 100 - 50}px`,
  initialRotation: `${Math.random() * 360}deg`,
  colorIndex: Math.floor(Math.random() * 4)
}));

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

export function HeroSection() {
  const eventConfig = useSelector((state) => state.event.eventConfig);
  const timeLeft = useCountdown(eventConfig.targetDate);

  return (
    <header className="hero-section" id="home">
      <div className="hero-border-frame glass-card">
        {/* Falling Flower Petals Effect */}
        <div className="flower-petals-container">
          {PETAL_LAYOUTS.map((petal) => {
            const colors = PETAL_COLORS_MAP[eventConfig.petals] || PETAL_COLORS_MAP.marigold;
            const petalColor = colors[petal.colorIndex % colors.length];
            return (
              <span 
                key={`hero-petal-${petal.id}`} 
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

        <div className="hero-card">
          <span className="hero-header-ornament">{eventConfig.headerOrnament}</span>
          <h1 className="hero-main-title">WE ARE MOVING!</h1>
          <p className="hero-names">{eventConfig.hostNames}</p>
          
          <div className="section-divider">
            <div className="line"></div>
            <div className="diamond"></div>
            <div className="line"></div>
          </div>

          <p className="hero-tagline">
            {eventConfig.invitationMessage}
          </p>

          {/* Countdown Timer */}
          {eventConfig.showCountdown && (
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
          )}
        </div>
      </div>
    </header>
  );
}

export default HeroSection;
