import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Users, ChevronLeft, ChevronRight, Settings, X } from 'lucide-react';
import './App.css';

// Supabase client
import { supabase } from './supabaseClient';

// Store slices
import { 
  toggleCustomizer,
  setCurrentView,
  setEnvelopeOpened,
  setIntroComplete,
  setEnvelopeStep,
  hideAlert,
  setLightboxImageIndex
} from './store/uiSlice';
import { fetchRsvpsAndWishes } from './store/dbSlice';

// Custom Hooks
import { useAudio } from './hooks/useAudio';

// Components
import { CustomAlert } from './components/CustomAlert';
import { Envelope } from './components/Envelope';
import { HeroSection } from './components/HeroSection';
import { GallerySection, SLIDES } from './components/GallerySection';
import { DetailsSection } from './components/DetailsSection';
import { MapSection } from './components/MapSection';
import { GuestbookSection } from './components/GuestbookSection';
import { TemplateCustomizer } from './components/TemplateCustomizer';
import { HostDashboard } from './components/HostDashboard';
import { MusicPlayer } from './components/MusicPlayer';

// Assets
import invitationMusic from './assets/invitation.mp3';
import housewarmingMusic from './assets/housewarming.mp3';

// Premium Theme Mappings
const themeStyles = {
  marigold: {
    '--color-gold': '#b59450',
    '--color-rose': '#9c7b6c',
    '--color-text-primary': '#3d352e',
    '--color-text-secondary': '#5c534c',
    '--color-text-muted': '#8c8279',
    '--bg-deep': '#f5f2eb',
    '--bg-mid': '#fbfaf7',
    '--envelope-bg-start': '#4a3f37',
    '--envelope-bg-end': '#241e1a',
    '--envelope-flap-start': '#564a40',
    '--envelope-flap-end': '#352c26',
    '--envelope-shadow': 'rgba(36, 30, 26, 0.55)',
    '--border-glass': 'rgba(181, 148, 80, 0.2)',
    '--border-focus': 'rgba(181, 148, 80, 0.5)',
    '--color-gold-glow': 'rgba(181, 148, 80, 0.15)',
  },
  crimson: {
    '--color-gold': '#d4af37',
    '--color-rose': '#a87c7c',
    '--color-text-primary': '#361d20',
    '--color-text-secondary': '#5a3d41',
    '--color-text-muted': '#8a6b6f',
    '--bg-deep': '#fbf6f6',
    '--bg-mid': '#fcfaf9',
    '--envelope-bg-start': '#521c22',
    '--envelope-bg-end': '#280a0d',
    '--envelope-flap-start': '#61242b',
    '--envelope-flap-end': '#3c1015',
    '--envelope-shadow': 'rgba(40, 10, 13, 0.55)',
    '--border-glass': 'rgba(184, 44, 60, 0.2)',
    '--border-focus': 'rgba(184, 44, 60, 0.5)',
    '--color-gold-glow': 'rgba(184, 44, 60, 0.15)',
  },
  emerald: {
    '--color-gold': '#b59450',
    '--color-rose': '#2d5a4c',
    '--color-text-primary': '#1b3029',
    '--color-text-secondary': '#385248',
    '--color-text-muted': '#688277',
    '--bg-deep': '#f2f6f4',
    '--bg-mid': '#fafcfb',
    '--envelope-bg-start': '#122e24',
    '--envelope-bg-end': '#081712',
    '--envelope-flap-start': '#1b4033',
    '--envelope-flap-end': '#0d241d',
    '--envelope-shadow': 'rgba(8, 23, 18, 0.55)',
    '--border-glass': 'rgba(45, 90, 76, 0.2)',
    '--border-focus': 'rgba(45, 90, 76, 0.5)',
    '--color-gold-glow': 'rgba(45, 90, 76, 0.15)',
  },
  sapphire: {
    '--color-gold': '#d4af37',
    '--color-rose': '#415a77',
    '--color-text-primary': '#1b263b',
    '--color-text-secondary': '#3c4c66',
    '--color-text-muted': '#6e7f99',
    '--bg-deep': '#f4f6fa',
    '--bg-mid': '#fafbfc',
    '--envelope-bg-start': '#0d1b2a',
    '--envelope-bg-end': '#050a11',
    '--envelope-flap-start': '#162b42',
    '--envelope-flap-end': '#0a1624',
    '--envelope-shadow': 'rgba(5, 10, 17, 0.55)',
    '--border-glass': 'rgba(65, 90, 119, 0.2)',
    '--border-focus': 'rgba(65, 90, 119, 0.5)',
    '--color-gold-glow': 'rgba(65, 90, 119, 0.15)',
  },
  champagne: {
    '--color-gold': '#d8a48f',
    '--color-rose': '#b38c82',
    '--color-text-primary': '#4a3530',
    '--color-text-secondary': '#6e5651',
    '--color-text-muted': '#967d78',
    '--bg-deep': '#fbf8f7',
    '--bg-mid': '#fdfbfb',
    '--envelope-bg-start': '#5e4540',
    '--envelope-bg-end': '#2d1f1c',
    '--envelope-flap-start': '#6e524c',
    '--envelope-flap-end': '#3b2925',
    '--envelope-shadow': 'rgba(45, 31, 28, 0.55)',
    '--border-glass': 'rgba(179, 140, 130, 0.2)',
    '--border-focus': 'rgba(179, 140, 130, 0.5)',
    '--color-gold-glow': 'rgba(179, 140, 130, 0.15)',
  }
};

// Music track mappings
const MUSIC_MAP = {
  traditional_flute: invitationMusic,
  festive_shehnai: housewarmingMusic,
  soft_piano: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  lofi_guitar: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  custom: ''
};

// Helper for filtering RSVPs by event namespace preview
const filterRsvpsByEvent = (list, eventId) => {
  if (!list) return [];
  const targetPrefix = `[${eventId}]`;
  return list.filter(item => {
    const msg = item.message || '';
    if (eventId === 'laxmi-kote-default') {
      return msg.startsWith(targetPrefix) || !msg.trim().startsWith('[');
    }
    return msg.startsWith(targetPrefix);
  }).map(item => {
    const msg = item.message || '';
    let cleanMessage = msg;
    if (msg.startsWith(targetPrefix)) {
      cleanMessage = msg.slice(targetPrefix.length).trim();
    }
    return { ...item, message: cleanMessage };
  });
};

function App() {
  const dispatch = useDispatch();
  
  // Select configs and states
  const eventConfig = useSelector((state) => state.event.eventConfig);
  const { 
    isCustomizerOpen, 
    isEnvelopeOpened, 
    isIntroComplete, 
    lightboxImageIndex, 
    customAlert, 
    currentView 
  } = useSelector((state) => state.ui);
  const { rsvpList } = useSelector((state) => state.db);

  const activeSlides = eventConfig.slides && eventConfig.slides.length > 0 ? eventConfig.slides : SLIDES;
  const filteredRsvpList = filterRsvpsByEvent(rsvpList, eventConfig.eventId);

  const totalAttendingGuests = filteredRsvpList.reduce((acc, curr) => {
    if (curr.attending === 'yes') {
      const val = parseInt(curr.guests, 10);
      return acc + (isNaN(val) ? 1 : val);
    }
    return acc;
  }, 0);

  // Setup Music controls
  const musicSrc = eventConfig.musicType === 'custom' 
    ? eventConfig.customMusicUrl 
    : (MUSIC_MAP[eventConfig.musicType] || invitationMusic);
    
  const { isPlaying, setIsPlaying, audioRef, togglePlay } = useAudio(musicSrc);

  // Sync Supabase Realtime & fetch initials
  useEffect(() => {
    dispatch(fetchRsvpsAndWishes());

    let rsvpsChannel;
    let wishesChannel;

    if (supabase) {
      rsvpsChannel = supabase
        .channel('rsvps-realtime')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'rsvps' }, () => {
          dispatch(fetchRsvpsAndWishes());
        })
        .subscribe();

      wishesChannel = supabase
        .channel('wishes-realtime')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'wishes' }, () => {
          dispatch(fetchRsvpsAndWishes());
        })
        .subscribe();
    }

    return () => {
      if (rsvpsChannel) supabase.removeChannel(rsvpsChannel);
      if (wishesChannel) supabase.removeChannel(wishesChannel);
    };
  }, [dispatch]);

  // Listen to hash changes for customized view
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#/customize' || window.location.hash === '#customize') {
        dispatch(toggleCustomizer(true));
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [dispatch]);

  // Listen to hash changes for host routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#host' || hash === '#/host') {
        dispatch(setCurrentView('host'));
      } else {
        const searchParams = new URLSearchParams(window.location.search);
        if (searchParams.get('view') === 'host' || searchParams.has('host')) {
          dispatch(setCurrentView('host'));
        } else {
          dispatch(setCurrentView('invitation'));
        }
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [dispatch]);

  // Page Scroll Locks on transitions
  useEffect(() => {
    if (currentView === 'host') {
      document.body.classList.remove('no-scroll');
      document.documentElement.classList.remove('no-scroll');
      document.body.classList.remove('intro-active');
      return;
    }
    if (!isIntroComplete) {
      document.body.classList.add('no-scroll');
      document.documentElement.classList.add('no-scroll');
      document.body.classList.add('intro-active');
    } else if (lightboxImageIndex !== null) {
      document.body.classList.add('no-scroll');
      document.documentElement.classList.add('no-scroll');
      document.body.classList.remove('intro-active');
    } else {
      document.body.classList.remove('no-scroll');
      document.documentElement.classList.remove('no-scroll');
      document.body.classList.remove('intro-active');
    }
    return () => {
      document.body.classList.remove('no-scroll');
      document.documentElement.classList.remove('no-scroll');
      document.body.classList.remove('intro-active');
    };
  }, [isIntroComplete, lightboxImageIndex, currentView]);

  // Handle keyboard navigation for lightbox
  useEffect(() => {
    if (lightboxImageIndex === null) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        dispatch(setLightboxImageIndex(null));
      } else if (e.key === 'ArrowRight') {
        dispatch(setLightboxImageIndex(
          lightboxImageIndex === activeSlides.length - 1 ? 0 : lightboxImageIndex + 1
        ));
      } else if (e.key === 'ArrowLeft') {
        dispatch(setLightboxImageIndex(
          lightboxImageIndex === 0 ? activeSlides.length - 1 : lightboxImageIndex - 1
        ));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lightboxImageIndex, activeSlides.length, dispatch]);

  // Inject themes into document root
  useEffect(() => {
    const theme = eventConfig.theme || 'marigold';
    const variables = themeStyles[theme] || themeStyles.marigold;
    for (const [key, value] of Object.entries(variables)) {
      document.documentElement.style.setProperty(key, value);
    }
  }, [eventConfig.theme]);

  // Play audio on opening envelope
  const handleOpenEnvelopeAudio = () => {
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.log("Audio autoplay from envelope click was blocked:", err);
        });
    }
  };

  // Stop audio on returning from host panel
  const handleBackToSiteAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const closeLightbox = () => {
    dispatch(setLightboxImageIndex(null));
  };

  const prevLightboxImage = (e) => {
    if (e) e.stopPropagation();
    dispatch(setLightboxImageIndex(
      lightboxImageIndex === 0 ? activeSlides.length - 1 : lightboxImageIndex - 1
    ));
  };

  const nextLightboxImage = (e) => {
    if (e) e.stopPropagation();
    dispatch(setLightboxImageIndex(
      lightboxImageIndex === activeSlides.length - 1 ? 0 : lightboxImageIndex + 1
    ));
  };

  const handleToggleCustomizer = (open) => {
    dispatch(toggleCustomizer(open));
    if (!open) {
      if (window.location.hash === '#/customize' || window.location.hash === '#customize') {
        window.history.pushState({}, '', window.location.pathname + window.location.search);
      }
    } else {
      window.location.hash = '#/customize';
    }
  };

  const searchParams = new URLSearchParams(window.location.search);
  const showBuilderButton = !searchParams.has('config') || 
                            searchParams.get('edit') === 'true' || 
                            searchParams.get('builder') === 'true' || 
                            window.location.hash === '#customize' || 
                            window.location.hash === '#/customize';

  return (
    <div className="app-container">
      {/* Background Music */}
      <audio 
        ref={audioRef} 
        src={musicSrc} 
        loop 
        preload="auto"
      />

      {/* Custom Alert Modal Overlay */}
      <CustomAlert 
        show={customAlert.show} 
        message={customAlert.message} 
        onClose={() => dispatch(hideAlert())} 
      />

      {/* Envelope Intro Overlay */}
      {currentView !== 'host' && (
        <Envelope onOpenEnvelope={handleOpenEnvelopeAudio} />
      )}

      {/* Floating Music Control Button */}
      {currentView !== 'host' && isIntroComplete && (
        <MusicPlayer isPlaying={isPlaying} togglePlay={togglePlay} />
      )}

      {/* Decorative Orbs */}
      <div className="ambient-glow top-left"></div>
      <div className="ambient-glow middle"></div>
      <div className="ambient-glow bottom-right"></div>

      <div className="content-wrapper">
        {currentView === 'host' ? (
          <HostDashboard onBackToSite={handleBackToSiteAudio} />
        ) : (
          <>
            {isIntroComplete && (
              <header className="revealed-header glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', textAlign: 'center', animation: 'stepFadeIn 0.8s ease' }}>
                <span className="section-subtitle">Welcome to our new home!</span>
                <h1 className="house-name-title">{eventConfig.houseName}</h1>
                <p className="envelope-card-names" style={{ margin: '0 0 10px' }}>{eventConfig.hostNames}</p>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '16px', maxWidth: '600px', lineHeight: '1.6' }}>
                  We are excited to step into our new home, <span style={{ color: 'var(--color-gold)', fontWeight: 'bold' }}>{eventConfig.houseName}</span>! Thank you for celebrating this milestone with us!
                </p>
                
                <div className="rsvp-attending-count-badge" style={{ margin: '5px 0 0' }}>
                  <Users size={16} />
                  <span>{totalAttendingGuests} guests attending</span>
                </div>

                {filteredRsvpList.filter(r => r.attending === 'yes').length > 0 && (
                  <div className="rsvp-attending-names-preview" style={{ width: '100%', maxWidth: '500px', margin: '5px 0 0' }}>
                    <strong>Joined by:</strong> {filteredRsvpList.filter(r => r.attending === 'yes').map(r => r.name).join(', ')}
                  </div>
                )}
              </header>
            )}

            {isIntroComplete && (
              <>
                <HeroSection />
                <GallerySection />
                <DetailsSection />
                <MapSection />
                <GuestbookSection />

                {/* FOOTER */}
                <footer>
                  <p className="footer-logo">{eventConfig.hostNames}</p>
                  <p className="footer-text">Made with ❤️ • Excited to welcome you home</p>
                  <p className="footer-host-link" style={{ marginTop: '12px' }}>
                    <span 
                      onClick={() => {
                        window.location.hash = '#host';
                        dispatch(setCurrentView('host'));
                      }} 
                      style={{ cursor: 'pointer', opacity: 0.5, fontSize: '11px', textDecoration: 'underline', color: 'var(--color-text-muted)', transition: 'opacity 0.2s' }}
                      onMouseEnter={(e) => e.target.style.opacity = 0.8}
                      onMouseLeave={(e) => e.target.style.opacity = 0.5}
                    >
                      Host Panel
                    </span>
                  </p>
                </footer>
              </>
            )}
          </>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxImageIndex !== null && (
        <div 
          className="lightbox-overlay" 
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
        >
          <button 
            className="lightbox-close" 
            onClick={closeLightbox}
            aria-label="Close full screen view"
          >
            &times;
          </button>

          <button 
            className="lightbox-arrow prev" 
            onClick={prevLightboxImage}
            aria-label="Previous image"
          >
            <ChevronLeft size={36} />
          </button>

          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img 
              src={activeSlides[lightboxImageIndex].url} 
              alt={activeSlides[lightboxImageIndex].title} 
              className="lightbox-image"
            />
          </div>

          <button 
            className="lightbox-arrow next" 
            onClick={nextLightboxImage}
            aria-label="Next image"
          >
            <ChevronRight size={36} />
          </button>
          
          <div className="lightbox-counter">
            {lightboxImageIndex + 1} / {activeSlides.length}
          </div>
        </div>
      )}

      {/* Customizer trigger floating button */}
      {showBuilderButton && currentView !== 'host' && (
        <button 
          onClick={() => handleToggleCustomizer(!isCustomizerOpen)} 
          className={`customizer-trigger-btn ${isCustomizerOpen ? 'active' : ''}`}
          title="Customize invitation details & styles"
        >
          {isCustomizerOpen ? <X size={22} /> : <Settings size={22} />}
        </button>
      )}

      {/* Template Customizer Panel Drawer */}
      <TemplateCustomizer />
    </div>
  );
}

export default App;
