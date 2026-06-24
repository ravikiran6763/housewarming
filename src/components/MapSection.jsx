import React from 'react';
import { useSelector } from 'react-redux';
import { MapPin } from 'lucide-react';

export function MapSection() {
  const eventConfig = useSelector((state) => state.event.eventConfig);
  const { latitude, longitude, venueLine1, venueLine2, landmark } = eventConfig;

  return (
    <section id="map">
      <div className="section-title-container">
        <span className="section-subtitle">Find Your Way</span>
        <h2 className="section-title">Route Map</h2>
        <div className="section-divider">
          <div className="line"></div>
          <div className="diamond"></div>
          <div className="line"></div>
        </div>
      </div>

      <div className="glass-card map-section-card">
        <div className="map-wrapper">
          <iframe 
            title="Venue Location Map"
            src={`https://maps.google.com/maps?q=${latitude},${longitude}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        <div className="map-details-container">
          <div className="map-address-box">
            <h3>New Residence</h3>
            <p>
              {venueLine1}, {venueLine2}<br />
              {landmark && (
                <>
                  <strong>Landmark:</strong> {landmark}
                </>
              )}
            </p>
          </div>
          <div>
            <a 
              href={`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-primary"
              id="btn-get-directions"
            >
              <MapPin size={18} />
              Get Directions
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MapSection;
