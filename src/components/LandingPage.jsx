import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Sparkles, ArrowRight, Eye, Sliders, Calendar, MapPin, Music, MessageSquare } from 'lucide-react';
import { setShowLandingPage, toggleCustomizer } from '../store/uiSlice';

const THEMES = [
  {
    id: 'marigold',
    name: 'Classic Marigold',
    emoji: '🌻',
    colors: ['#ff9f00', '#b59450', '#f5f2eb'],
    desc: 'Golden marigolds paired with warm sandstone tones.'
  },
  {
    id: 'crimson',
    name: 'Royal Crimson',
    emoji: '🌹',
    colors: ['#b82c3c', '#d4af37', '#fbf6f6'],
    desc: 'Deep imperial red matched with metallic gold.'
  },
  {
    id: 'emerald',
    name: 'Emerald Forest',
    emoji: '🌿',
    colors: ['#2d5a4c', '#b59450', '#f2f6f4'],
    desc: 'Traditional forest green set against gold accents.'
  },
  {
    id: 'sapphire',
    name: 'Midnight Sapphire',
    emoji: '🌌',
    colors: ['#1d2d44', '#d4af37', '#f4f6fa'],
    desc: 'Royal navy combined with majestic gold sparkles.'
  },
  {
    id: 'champagne',
    name: 'Rose Champagne',
    emoji: '🌸',
    colors: ['#b38c82', '#d8a48f', '#fbf8f7'],
    desc: 'Sophisticated rose pink with champagne highlights.'
  }
];

export function LandingPage() {
  const dispatch = useDispatch();
  const [selectedThemeId, setSelectedThemeId] = useState('marigold');

  const handleStartBuilding = () => {
    dispatch(setShowLandingPage(false));
    dispatch(toggleCustomizer(true));
  };

  const handleViewDemo = () => {
    dispatch(setShowLandingPage(false));
  };

  const activeTheme = THEMES.find(t => t.id === selectedThemeId) || THEMES[0];

  return (
    <div className="landing-container">
      {/* Decorative Blur Orbs */}
      <div className="landing-orb orb-1"></div>
      <div className="landing-orb orb-2"></div>

      <header className="landing-header">
        <div className="landing-logo">
          <Sparkles className="logo-sparkle animate-pulse" size={24} />
          <span>Housewarming Card Studio</span>
        </div>
      </header>

      <main className="landing-hero-section">
        <div className="landing-hero-text">
          <span className="landing-badge">
            <Sparkles size={14} /> New: Dynamic Base64 Sharing & Supabase Realtime
          </span>
          <h1 className="landing-title">
            Design & Share Premium <br />
            <span className="gradient-text">Housewarming Invitations</span>
          </h1>
          <p className="landing-subtitle">
            Welcome your friends and family to your new residence with a gorgeous, interactive digital card. Customize details, colors, background music, and route maps in real-time, then share your invitation link instantly.
          </p>

          <div className="landing-actions">
            <button 
              onClick={handleStartBuilding} 
              className="landing-btn-primary"
            >
              <Sliders size={18} />
              Start Designing
              <ArrowRight size={18} />
            </button>
            <button 
              onClick={handleViewDemo} 
              className="landing-btn-secondary"
            >
              <Eye size={18} />
              See Live Demo
            </button>
          </div>
        </div>

        {/* Dynamic Theme Showroom Device Previews */}
        <div className="landing-showroom glass-card">
          <div className="showroom-header">
            <h3>Theme Showroom</h3>
            <p>Pick a preset aesthetic to preview</p>
          </div>

          <div className="showroom-palettes">
            {THEMES.map((theme) => (
              <button
                key={theme.id}
                className={`showroom-palette-btn ${selectedThemeId === theme.id ? 'active' : ''}`}
                onClick={() => setSelectedThemeId(theme.id)}
              >
                <div className="swatch-circles">
                  <span className="swatch" style={{ backgroundColor: theme.colors[0] }}></span>
                  <span className="swatch" style={{ backgroundColor: theme.colors[1] }}></span>
                  <span className="swatch" style={{ backgroundColor: theme.colors[2] }}></span>
                </div>
                <span className="showroom-theme-name">
                  {theme.emoji} {theme.name}
                </span>
              </button>
            ))}
          </div>

          <div className="showroom-preview-card" style={{ '--preview-gold': activeTheme.colors[1] }}>
            <div className="preview-card-interior">
              <span className="preview-subtitle">New Beginnings</span>
              <h4 className="preview-title">Laxmi Kote</h4>
              <p className="preview-names">Ramyashree & Ravikiran</p>
              <div className="preview-divider">
                <span className="line"></span>
                <span className="diamond" style={{ backgroundColor: activeTheme.colors[1] }}></span>
                <span className="line"></span>
              </div>
              <p className="preview-desc">"We built a house, now help us make it a home..."</p>
              <div className="preview-badge" style={{ backgroundColor: activeTheme.colors[0], color: '#fff' }}>
                {activeTheme.name} Preset
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Feature Highlighting Grid */}
      <section className="landing-features">
        <div className="features-intro">
          <h2>Interactive invitation features built for hosts</h2>
          <p>Everything you need to gather RSVP counts, details, and blessings in one digital card.</p>
        </div>

        <div className="features-grid">
          <div className="feature-item glass-card">
            <div className="feature-icon-box pink">
              <MessageSquare size={24} />
            </div>
            <h3>Supabase Guestbook</h3>
            <p>Gather wishes and warm blessings directly on your home wishes wall with interactive hearts and real-time page updates.</p>
          </div>

          <div className="feature-item glass-card">
            <div className="feature-icon-box green">
              <Calendar size={24} />
            </div>
            <h3>Calendar Invites</h3>
            <p>One-click 'Add to Calendar' links generated dynamically based on your custom dates, automatically linking address details.</p>
          </div>

          <div className="feature-item glass-card">
            <div className="feature-icon-box blue">
              <MapPin size={24} />
            </div>
            <h3>Route Navigation</h3>
            <p>Embed an interactive Google Map with coordinates. Guests get directions straight from their location with one tap.</p>
          </div>

          <div className="feature-item glass-card">
            <div className="feature-icon-box gold">
              <Music size={24} />
            </div>
            <h3>Ambient Soundtracks</h3>
            <p>Traditional Indian flutes, celebratory shehnai, classical piano, lofi guitar, or load your own customized MP3 file link.</p>
          </div>
        </div>
      </section>

      <footer className="landing-footer-banner">
        <p>© 2026 Housewarming Card Studio • Zero Server Setup Required</p>
      </footer>
    </div>
  );
}

export default LandingPage;
