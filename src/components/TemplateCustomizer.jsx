import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Sliders, X, Trash2, Plus, Check, Copy, RefreshCw } from 'lucide-react';
import { toggleCustomizer } from '../store/uiSlice';
import { 
  updateEventConfig, 
  resetEventConfig, 
  generateShareableLink, 
  DEFAULT_CONFIG 
} from '../store/eventSlice';
import { SLIDES } from './GallerySection';

export function TemplateCustomizer() {
  const dispatch = useDispatch();
  const config = useSelector((state) => state.event.eventConfig);
  const isOpen = useSelector((state) => state.ui.isCustomizerOpen);

  const [activeTab, setActiveTab] = useState('basic');
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  // Update shareable link whenever config changes
  useEffect(() => {
    if (isOpen) {
      setShareUrl(generateShareableLink(config));
    }
  }, [config, isOpen]);

  const handleClose = () => {
    dispatch(toggleCustomizer(false));
    if (window.location.hash === '#/customize' || window.location.hash === '#customize') {
      window.history.pushState({}, '', window.location.pathname + window.location.search);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    dispatch(updateEventConfig({
      ...config,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all changes to the original template?")) {
      dispatch(resetEventConfig());
    }
  };

  // Gallery Slide Helpers
  const handleSlideChange = (idx, field, value) => {
    const updatedSlides = [...(config.slides && config.slides.length > 0 ? config.slides : SLIDES)];
    updatedSlides[idx] = {
      ...updatedSlides[idx],
      [field]: value
    };
    dispatch(updateEventConfig({
      ...config,
      slides: updatedSlides
    }));
  };

  const handleAddSlide = () => {
    const defaultNewSlide = {
      url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=600&auto=format&fit=crop',
      title: 'New Space',
      desc: 'Customize this description for your new home.'
    };
    const currentSlides = config.slides && config.slides.length > 0 ? config.slides : [...SLIDES];
    dispatch(updateEventConfig({
      ...config,
      slides: [...currentSlides, defaultNewSlide]
    }));
  };

  const handleRemoveSlide = (idx) => {
    const currentSlides = config.slides && config.slides.length > 0 ? config.slides : [...SLIDES];
    const updated = currentSlides.filter((_, i) => i !== idx);
    dispatch(updateEventConfig({
      ...config,
      slides: updated
    }));
  };

  const handleLoadSampleSlides = () => {
    dispatch(updateEventConfig({
      ...config,
      slides: [] // Reset to default SLIDES array
    }));
  };

  if (!isOpen) return null;

  return (
    <div className={`customizer-panel ${isOpen ? 'open' : ''}`}>
      <div className="customizer-header">
        <h2 className="customizer-header-title">
          <Sliders size={20} />
          Template Builder
        </h2>
        <button onClick={handleClose} className="customizer-close-btn" aria-label="Close customizer">
          <X size={24} />
        </button>
      </div>

      <div className="customizer-tabs">
        <button 
          className={`customizer-tab-btn ${activeTab === 'basic' ? 'active' : ''}`}
          onClick={() => setActiveTab('basic')}
        >
          Basic Info
        </button>
        <button 
          className={`customizer-tab-btn ${activeTab === 'datetime' ? 'active' : ''}`}
          onClick={() => setActiveTab('datetime')}
        >
          Date & Time
        </button>
        <button 
          className={`customizer-tab-btn ${activeTab === 'location' ? 'active' : ''}`}
          onClick={() => setActiveTab('location')}
        >
          Venue
        </button>
        <button 
          className={`customizer-tab-btn ${activeTab === 'theme' ? 'active' : ''}`}
          onClick={() => setActiveTab('theme')}
        >
          Aesthetics
        </button>
        <button 
          className={`customizer-tab-btn ${activeTab === 'gallery' ? 'active' : ''}`}
          onClick={() => setActiveTab('gallery')}
        >
          Gallery & Features
        </button>
        <button 
          className={`customizer-tab-btn ${activeTab === 'share' ? 'active' : ''}`}
          onClick={() => setActiveTab('share')}
        >
          Share
        </button>
      </div>

      <div className="customizer-body">
        {activeTab === 'basic' && (
          <>
            <div className="customizer-section-title">Invitation Identity</div>
            <div className="customizer-field">
              <label className="customizer-label">Host Names</label>
              <input 
                type="text" 
                name="hostNames" 
                value={config.hostNames} 
                onChange={handleInputChange} 
                className="customizer-input"
                placeholder="e.g. John & Sarah"
              />
            </div>
            <div className="customizer-field">
              <label className="customizer-label">House / Nest Name</label>
              <input 
                type="text" 
                name="houseName" 
                value={config.houseName} 
                onChange={handleInputChange} 
                className="customizer-input"
                placeholder="e.g. Laxmi Kote / Cozy Nest"
              />
            </div>
            <div className="customizer-row-2">
              <div className="customizer-field">
                <label className="customizer-label">Wax Seal Initials</label>
                <input 
                  type="text" 
                  name="waxSealInitials" 
                  value={config.waxSealInitials} 
                  onChange={handleInputChange} 
                  maxLength={3}
                  className="customizer-input"
                  placeholder="e.g. R&R"
                />
              </div>
              <div className="customizer-field">
                <label className="customizer-label">Header Ornament</label>
                <input 
                  type="text" 
                  name="headerOrnament" 
                  value={config.headerOrnament} 
                  onChange={handleInputChange} 
                  className="customizer-input"
                  placeholder="e.g. New Beginnings"
                />
              </div>
            </div>
            <div className="customizer-field">
              <label className="customizer-label">Event Type / Subtitle</label>
              <input 
                type="text" 
                name="eventType" 
                value={config.eventType} 
                onChange={handleInputChange} 
                className="customizer-input"
                placeholder="e.g. GRIHA PRAVESHA"
              />
            </div>
            <div className="customizer-field">
              <label className="customizer-label">Welcoming Message</label>
              <textarea 
                name="invitationMessage" 
                value={config.invitationMessage} 
                onChange={handleInputChange} 
                className="customizer-input"
                rows={3}
                placeholder="Describe your invitation..."
              />
            </div>
          </>
        )}

        {activeTab === 'datetime' && (
          <>
            <div className="customizer-section-title">Date & Countdown Target</div>
            <div className="customizer-field">
              <label className="customizer-label">Countdown Target Date & Time</label>
              <input 
                type="datetime-local" 
                name="targetDate" 
                value={config.targetDate.slice(0, 16)} 
                onChange={handleInputChange} 
                className="customizer-input"
              />
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>
                Used for the live countdown clock and Google Calendar events.
              </span>
            </div>
            <div className="customizer-field">
              <label className="customizer-label">Display Date Text</label>
              <input 
                type="text" 
                name="displayDate" 
                value={config.displayDate} 
                onChange={handleInputChange} 
                className="customizer-input"
                placeholder="e.g. Sunday, July 5, 2026"
              />
            </div>
            <div className="customizer-field">
              <label className="customizer-label">Display Time Text</label>
              <input 
                type="text" 
                name="displayTime" 
                value={config.displayTime} 
                onChange={handleInputChange} 
                className="customizer-input"
                placeholder="e.g. 10:00 AM Onwards"
              />
            </div>
            <div className="customizer-field">
              <label className="customizer-label">Timeline / Schedule Details</label>
              <input 
                type="text" 
                name="scheduleDetails" 
                value={config.scheduleDetails} 
                onChange={handleInputChange} 
                className="customizer-input"
                placeholder="e.g. Pooja followed by Lunch"
              />
            </div>
          </>
        )}

        {activeTab === 'location' && (
          <>
            <div className="customizer-section-title">Venue Address</div>
            <div className="customizer-field">
              <label className="customizer-label">Address Line 1</label>
              <input 
                type="text" 
                name="venueLine1" 
                value={config.venueLine1} 
                onChange={handleInputChange} 
                className="customizer-input"
                placeholder="e.g. No: 41, 1st A Cross"
              />
            </div>
            <div className="customizer-field">
              <label className="customizer-label">Address Line 2 (Full Address)</label>
              <input 
                type="text" 
                name="venueLine2" 
                value={config.venueLine2} 
                onChange={handleInputChange} 
                className="customizer-input"
                placeholder="Full address details"
              />
            </div>
            <div className="customizer-field">
              <label className="customizer-label">Landmark</label>
              <input 
                type="text" 
                name="landmark" 
                value={config.landmark} 
                onChange={handleInputChange} 
                className="customizer-input"
                placeholder="e.g. Near Konanakunte Cross"
              />
            </div>
            <div className="customizer-section-title" style={{ marginTop: '20px' }}>Geographic Coordinates</div>
            <div className="customizer-row-2">
              <div className="customizer-field">
                <label className="customizer-label">Latitude</label>
                <input 
                  type="text" 
                  name="latitude" 
                  value={config.latitude} 
                  onChange={handleInputChange} 
                  className="customizer-input"
                  placeholder="e.g. 12.888201"
                />
              </div>
              <div className="customizer-field">
                <label className="customizer-label">Longitude</label>
                <input 
                  type="text" 
                  name="longitude" 
                  value={config.longitude} 
                  onChange={handleInputChange} 
                  className="customizer-input"
                  placeholder="e.g. 77.567145"
                />
              </div>
            </div>
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>
              Used to render the interactive Google Map and directions button.
            </span>
          </>
        )}

        {activeTab === 'theme' && (
          <>
            <div className="customizer-section-title">Theme Aesthetics</div>
            <div className="customizer-field">
              <label className="customizer-label">Color Palette Theme</label>
              <select 
                name="theme" 
                value={config.theme} 
                onChange={handleInputChange} 
                className="customizer-select"
              >
                <option value="marigold">🌻 Classic Marigold (Orange & Gold)</option>
                <option value="crimson">🌹 Royal Crimson (Ruby Red & Gold)</option>
                <option value="emerald">🌿 Emerald Forest (Teal & Gold)</option>
                <option value="sapphire">🌌 Midnight Sapphire (Navy & Rose Gold)</option>
                <option value="champagne">🌸 Rose Champagne (Soft Pink & Gold)</option>
              </select>
            </div>
            <div className="customizer-field">
              <label className="customizer-label">Falling Element Type</label>
              <select 
                name="petals" 
                value={config.petals} 
                onChange={handleInputChange} 
                className="customizer-select"
              >
                <option value="marigold">Marigold Petals (Orange/Yellow)</option>
                <option value="rose">Rose Petals (Red/Pink)</option>
                <option value="gold">Golden Dust Sparkles</option>
                <option value="cherry">Cherry Blossoms (Sakura Pink)</option>
                <option value="leaves">Forest Sage Leaves</option>
              </select>
            </div>
            <div className="customizer-field">
              <label className="customizer-label">Envelope Cover Art</label>
              <select 
                name="envelopeArt" 
                value={config.envelopeArt} 
                onChange={handleInputChange} 
                className="customizer-select"
              >
                <option value="kalash_lakshmi">Traditional Kalash & Gaja Lakshmi</option>
                <option value="modern_home">Universal Cozy Home Outline</option>
                <option value="floral_wreath">Elegant Botanical Wreath</option>
              </select>
            </div>
            <div className="customizer-section-title" style={{ marginTop: '20px' }}>Background Music</div>
            <div className="customizer-field">
              <label className="customizer-label">Select Audio Track</label>
              <select 
                name="musicType" 
                value={config.musicType} 
                onChange={handleInputChange} 
                className="customizer-select"
              >
                <option value="traditional_flute">Traditional Flute Instrumental (Default)</option>
                <option value="festive_shehnai">Festive Shehnai Instrumental</option>
                <option value="soft_piano">Soft Classical Piano</option>
                <option value="lofi_guitar">Lofi Acoustic Guitar</option>
                <option value="custom">Provide Custom MP3 URL...</option>
              </select>
            </div>
            {config.musicType === 'custom' && (
              <div className="customizer-field">
                <label className="customizer-label">Direct MP3 Link</label>
                <input 
                  type="text" 
                  name="customMusicUrl" 
                  value={config.customMusicUrl} 
                  onChange={handleInputChange} 
                  className="customizer-input"
                  placeholder="https://example.com/song.mp3"
                />
              </div>
            )}
          </>
        )}

        {activeTab === 'gallery' && (
          <>
            <div className="customizer-section-title">Interactive Toggles</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label className="customizer-checkbox-label">
                <input 
                  type="checkbox" 
                  name="showCountdown" 
                  checked={config.showCountdown} 
                  onChange={handleInputChange} 
                />
                Show Countdown Timer
              </label>
              <label className="customizer-checkbox-label">
                <input 
                  type="checkbox" 
                  name="showGallery" 
                  checked={config.showGallery} 
                  onChange={handleInputChange} 
                />
                Show Interior Design Gallery
              </label>
              <label className="customizer-checkbox-label">
                <input 
                  type="checkbox" 
                  name="showRsvp" 
                  checked={config.showRsvp} 
                  onChange={handleInputChange} 
                />
                Enable RSVP Form
              </label>
              <label className="customizer-checkbox-label">
                <input 
                  type="checkbox" 
                  name="showGuestbook" 
                  checked={config.showGuestbook} 
                  onChange={handleInputChange} 
                />
                Enable Guestbook Wishes Wall
              </label>
            </div>

            {config.showGallery && (
              <>
                <div className="customizer-section-title" style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Gallery Photos ({(config.slides && config.slides.length > 0) ? config.slides.length : SLIDES.length})</span>
                  <button onClick={handleLoadSampleSlides} className="customizer-btn-outline" style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '4px' }}>
                    Reset to Presets
                  </button>
                </div>
                
                <div className="slides-editor-container">
                  {((config.slides && config.slides.length > 0) ? config.slides : SLIDES).map((slide, idx) => (
                    <div key={idx} className="slide-editor-card">
                      <button onClick={() => handleRemoveSlide(idx)} className="slide-remove-btn" title="Delete Slide">
                        <Trash2 size={16} />
                      </button>
                      <img src={slide.url} alt="" className="slide-thumbnail" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=600&auto=format&fit=crop' }} />
                      <div className="customizer-field" style={{ margin: 0 }}>
                        <label className="customizer-label">Image URL</label>
                        <input 
                          type="text" 
                          value={slide.url} 
                          onChange={(e) => handleSlideChange(idx, 'url', e.target.value)} 
                          className="customizer-input" 
                          style={{ fontSize: '12px', padding: '6px 8px' }} 
                        />
                      </div>
                      <div className="customizer-field" style={{ margin: 0 }}>
                        <label className="customizer-label">Title</label>
                        <input 
                          type="text" 
                          value={slide.title} 
                          onChange={(e) => handleSlideChange(idx, 'title', e.target.value)} 
                          className="customizer-input" 
                          style={{ fontSize: '12px', padding: '6px 8px' }} 
                        />
                      </div>
                      <div className="customizer-field" style={{ margin: 0 }}>
                        <label className="customizer-label">Description</label>
                        <input 
                          type="text" 
                          value={slide.desc} 
                          onChange={(e) => handleSlideChange(idx, 'desc', e.target.value)} 
                          className="customizer-input" 
                          style={{ fontSize: '12px', padding: '6px 8px' }} 
                        />
                      </div>
                    </div>
                  ))}
                  
                  <button onClick={handleAddSlide} className="customizer-btn-outline" style={{ marginTop: '5px' }}>
                    <Plus size={16} /> Add Photo Slide
                  </button>
                </div>
              </>
            )}
          </>
        )}

        {activeTab === 'share' && (
          <>
            <div className="customizer-section-title">RSVP Namespace</div>
            <div className="customizer-field">
              <label className="customizer-label">Unique Event ID</label>
              <input 
                type="text" 
                name="eventId" 
                value={config.eventId} 
                onChange={handleInputChange} 
                className="customizer-input"
                placeholder="laxmi-kote-default"
              />
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>
                Segregates RSVPs and guestbook entries. Change this to standard letters (e.g. `wedding-john-sarah`) so you only see guests for your specific card.
              </span>
            </div>

            <div className="customizer-section-title" style={{ marginTop: '24px' }}>Get Shareable Link</div>
            <div className="share-card">
              <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '10px', lineHeight: '1.4' }}>
                Your complete template configurations are encoded directly in this link. Send it to guests, or publish it online!
              </p>
              <textarea 
                value={shareUrl} 
                readOnly 
                onClick={(e) => e.target.select()}
                className="share-url-box"
              />
              <button 
                onClick={handleCopyLink} 
                className="customizer-btn-gold" 
                style={{ width: '100%', padding: '10px' }}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'Copied to Clipboard!' : 'Copy Shareable Link'}
              </button>
            </div>

            <div className="customizer-actions" style={{ marginTop: '30px' }}>
              <button onClick={handleReset} className="customizer-btn-danger">
                <RefreshCw size={16} /> Reset Template Defaults
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default TemplateCustomizer;
