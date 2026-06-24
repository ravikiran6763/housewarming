import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { setLightboxImageIndex } from '../store/uiSlice';

// Import local assets
import img2 from '../assets/interior/Mrs. Ramya - Design Presentation_page-0002.jpg';
import img3 from '../assets/interior/Mrs. Ramya - Design Presentation_page-0003.jpg';
import img4 from '../assets/interior/Mrs. Ramya - Design Presentation_page-0004.jpg';
import img5 from '../assets/interior/Mrs. Ramya - Design Presentation_page-0005.jpg';
import img6 from '../assets/interior/Mrs. Ramya - Design Presentation_page-0006.jpg';
import img7 from '../assets/interior/Mrs. Ramya - Design Presentation_page-0007.jpg';
import img8 from '../assets/interior/Mrs. Ramya - Design Presentation_page-0008.jpg';
import img9 from '../assets/interior/Mrs. Ramya - Design Presentation_page-0009.jpg';
import img10 from '../assets/interior/Mrs. Ramya - Design Presentation_page-0010.jpg';
import img11 from '../assets/interior/Mrs. Ramya - Design Presentation_page-0011.jpg';
import img12 from '../assets/interior/Mrs. Ramya - Design Presentation_page-0012.jpg';
import img13 from '../assets/interior/Mrs. Ramya - Design Presentation_page-0013.jpg';
import img14 from '../assets/interior/Mrs. Ramya - Design Presentation_page-0014.jpg';

export const SLIDES = [
  { url: img2, title: 'Modern Living Space', desc: 'An elegant layout with warm lighting, plush furnishings, and a cozy ambience.' },
  { url: img3, title: 'Foyer Entryway', desc: 'A welcoming entrance design with a sleek console table, mirror, and soft accents.' },
  { url: img4, title: 'Dining Area', desc: 'A cozy dining setup perfect for family dinners, gatherings, and celebrations.' },
  { url: img5, title: 'Gourmet Kitchen', desc: 'A modular kitchen with smart storage, modern built-in appliances, and high-end finishes.' },
  { url: img6, title: 'Master Bedroom Concept', desc: 'A luxurious and tranquil sanctuary designed specifically for deep rest and relaxation.' },
  { url: img7, title: 'Master Bedroom Wardrobes', desc: 'Sleek, handle-less built-in wardrobes with modular shelving and dresser units.' },
  { url: img8, title: 'Guest Bedroom Setup', desc: 'A warm and inviting space designed to make guests feel comfortable and at home.' },
  { url: img9, title: 'Kids / Study Bedroom', desc: 'A creative, vibrant space designed for work, study, and play.' },
  { url: img10, title: 'TV & Entertainment Console', desc: 'A minimalist entertainment hub with floating shelves and built-in ambient lighting.' },
  { url: img11, title: 'Foyer Accent Wall', desc: 'A striking feature wall that sets a premium, artistic tone for the entire home.' },
  { url: img12, title: 'Cozy Leisure Balcony', desc: 'A small outdoor escape featuring artificial turf, planters, and relaxing seating.' },
  { url: img13, title: 'Premium Bathroom Vanity', desc: 'A modern utility space featuring smart back-lit mirrors and high-quality quartz tops.' },
  { url: img14, title: 'Overall Interior Plan', desc: 'A detailed floor layout highlighting the conceptual flow of our beautiful new residence.' }
];

export function GallerySection() {
  const dispatch = useDispatch();
  const eventConfig = useSelector((state) => state.event.eventConfig);
  const activeSlides = eventConfig.slides && eventConfig.slides.length > 0 ? eventConfig.slides : SLIDES;
  const [currentSlide, setCurrentSlide] = useState(0);

  // Slider Autoplay
  useEffect(() => {
    if (activeSlides.length === 0) return;
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev === activeSlides.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(slideInterval);
  }, [activeSlides.length]);

  // Slider Navigation
  const prevSlide = () => {
    if (activeSlides.length === 0) return;
    setCurrentSlide((prev) => (prev === 0 ? activeSlides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    if (activeSlides.length === 0) return;
    setCurrentSlide((prev) => (prev === activeSlides.length - 1 ? 0 : prev + 1));
  };

  if (!eventConfig.showGallery) return null;

  return (
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
          {activeSlides.map((slide, index) => (
            <div 
              key={index} 
              className={`gallery-slide ${index === currentSlide ? 'active' : ''}`}
              onClick={() => dispatch(setLightboxImageIndex(index))}
            >
              <img src={slide.url} alt={slide.title} />
              <div className="gallery-slide-overlay">
                <h3 className="gallery-slide-title">{slide.title}</h3>
                <p className="gallery-slide-desc">{slide.desc}</p>
              </div>
            </div>
          ))}
          
          <button 
            type="button"
            className="gallery-arrow prev" 
            onClick={prevSlide}
            aria-label="Previous image"
          >
            <ChevronLeft size={24} />
          </button>
          
          <button 
            type="button"
            className="gallery-arrow next" 
            onClick={nextSlide}
            aria-label="Next image"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        <div className="gallery-indicators">
          {activeSlides.map((_, index) => (
            <span 
              key={index} 
              className={`gallery-dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            ></span>
          ))}
        </div>
      </div>
    </section>
  );
}

export default GallerySection;
