import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Calendar, Clock, MapPin, Users, Check, Heart, Sparkles } from 'lucide-react';
import { updateRsvpForm, submitRsvpThunk, resetRsvpSubmission } from '../store/dbSlice';
import { safeParseDate } from '../store/eventSlice';

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

export function DetailsSection() {
  const dispatch = useDispatch();
  const eventConfig = useSelector((state) => state.event.eventConfig);
  const { rsvpList, rsvpSubmitted, rsvpForm } = useSelector((state) => state.db);

  const filteredRsvpList = filterRsvpsByEvent(rsvpList, eventConfig.eventId);

  const totalAttendingGuests = filteredRsvpList.reduce((acc, curr) => {
    if (curr.attending === 'yes') {
      const val = parseInt(curr.guests, 10);
      return acc + (isNaN(val) ? 1 : val);
    }
    return acc;
  }, 0);

  const handleRsvpChange = (e) => {
    const { name, value } = e.target;
    dispatch(updateRsvpForm({ [name]: value }));
  };

  const handleRsvpSubmit = (e) => {
    e.preventDefault();
    if (!rsvpForm.name.trim()) return;
    dispatch(submitRsvpThunk({ rsvpForm, eventConfig }));
  };

  const getGoogleCalendarLink = () => {
    const title = encodeURIComponent(`${eventConfig.hostNames}'s ${eventConfig.eventType === 'GRIHA PRAVESHA' ? 'Griha Pravesha' : 'Housewarming'} Celebration`);
    const details = encodeURIComponent(eventConfig.invitationMessage);
    const location = encodeURIComponent(`${eventConfig.venueLine1}, ${eventConfig.venueLine2}`);
    
    const startDate = safeParseDate(eventConfig.targetDate);
    const endDate = new Date(startDate.getTime() + 5 * 60 * 60 * 1000); // 5 hours duration
    
    const formatGCalDate = (d) => {
      try {
        return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      } catch (e) {
        return "20260705T043000Z/20260705T093000Z";
      }
    };
    
    const dates = `${formatGCalDate(startDate)}/${formatGCalDate(endDate)}`;
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}`;
  };

  if (!eventConfig.showRsvp) {
    return (
      <section id="details">
        <div className="details-rsvp-grid" style={{ gridTemplateColumns: '1fr', maxWidth: '600px', margin: '0 auto' }}>
          {/* Event Details Card */}
          <div className="glass-card event-details-card">
            <h2 className="rsvp-title">Celebration Details</h2>
            
            <div className="details-row">
              <div className="details-icon-wrapper">
                <Calendar size={22} />
              </div>
              <div className="details-text-group">
                <span className="details-label">Date</span>
                <span className="details-value-main">{eventConfig.displayDate}</span>
                <span className="details-value-sub">Mark your calendars!</span>
              </div>
            </div>

            <div className="details-row">
              <div className="details-icon-wrapper">
                <Clock size={22} />
              </div>
              <div className="details-text-group">
                <span className="details-label">Time</span>
                <span className="details-value-main">{eventConfig.displayTime}</span>
                <span className="details-value-sub">{eventConfig.scheduleDetails}</span>
              </div>
            </div>

            <div className="details-row">
              <div className="details-icon-wrapper">
                <MapPin size={22} />
              </div>
              <div className="details-text-group">
                <span className="details-label">Venue</span>
                <span className="details-value-main">{eventConfig.venueLine1}</span>
                <span className="details-value-sub">{eventConfig.venueLine2}</span>
              </div>
            </div>

            <div className="action-btn-container">
              <a 
                href={getGoogleCalendarLink()} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-primary"
                id="btn-add-calendar"
              >
                <Sparkles size={18} />
                Add to Calendar
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="details">
      <div className="details-rsvp-grid">
        {/* Event Details Card */}
        <div className="glass-card event-details-card">
          <h2 className="rsvp-title">Celebration Details</h2>
          
          <div className="details-row">
            <div className="details-icon-wrapper">
              <Calendar size={22} />
            </div>
            <div className="details-text-group">
              <span className="details-label">Date</span>
              <span className="details-value-main">{eventConfig.displayDate}</span>
              <span className="details-value-sub">Mark your calendars!</span>
            </div>
          </div>

          <div className="details-row">
            <div className="details-icon-wrapper">
              <Clock size={22} />
            </div>
            <div className="details-text-group">
              <span className="details-label">Time</span>
              <span className="details-value-main">{eventConfig.displayTime}</span>
              <span className="details-value-sub">{eventConfig.scheduleDetails}</span>
            </div>
          </div>

          <div className="details-row">
            <div className="details-icon-wrapper">
              <MapPin size={22} />
            </div>
            <div className="details-text-group">
              <span className="details-label">Venue</span>
              <span className="details-value-main">{eventConfig.venueLine1}</span>
              <span className="details-value-sub">{eventConfig.venueLine2}</span>
            </div>
          </div>

          <div className="action-btn-container">
            <a 
              href={getGoogleCalendarLink()} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-primary"
              id="btn-add-calendar"
            >
              <Sparkles size={18} />
              Add to Calendar
            </a>
          </div>
        </div>

        {/* RSVP Form Card */}
        <div className="glass-card rsvp-form-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h2 className="rsvp-title" style={{ marginBottom: '10px', textAlign: 'center' }}>Kindly RSVP</h2>
          
          <div className="rsvp-attending-count-badge">
            <Users size={16} />
            <span>{totalAttendingGuests} guests attending</span>
          </div>

          {!rsvpSubmitted ? (
            <form onSubmit={handleRsvpSubmit} style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              
              <div className="form-group">
                <label className="form-label" htmlFor="rsvp-name">Your Full Name</label>
                <input 
                  type="text" 
                  id="rsvp-name" 
                  name="name" 
                  value={rsvpForm.name} 
                  onChange={handleRsvpChange} 
                  className="form-input" 
                  placeholder="Enter your name" 
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Will you attend?</label>
                <div className="radio-group">
                  <label className={`radio-label ${rsvpForm.attending === 'yes' ? 'selected' : ''}`}>
                    <input 
                      type="radio" 
                      name="attending" 
                      value="yes" 
                      checked={rsvpForm.attending === 'yes'} 
                      onChange={handleRsvpChange} 
                    />
                    <Check size={16} /> Yes, I will come
                  </label>
                  <label className={`radio-label ${rsvpForm.attending === 'no' ? 'selected' : ''}`}>
                    <input 
                      type="radio" 
                      name="attending" 
                      value="no" 
                      checked={rsvpForm.attending === 'no'} 
                      onChange={handleRsvpChange} 
                    />
                    Regretfully No
                  </label>
                </div>
              </div>

              {rsvpForm.attending === 'yes' && (
                <div className="form-group">
                  <label className="form-label" htmlFor="rsvp-guests">Number of Guests (including yourself)</label>
                  <select 
                    id="rsvp-guests" 
                    name="guests" 
                    value={rsvpForm.guests} 
                    onChange={handleRsvpChange} 
                    className="form-input"
                  >
                    <option value="1">1 Guest</option>
                    <option value="2">2 Guests</option>
                    <option value="3">3 Guests</option>
                    <option value="4">4 Guests</option>
                    <option value="5">5+ Guests</option>
                  </select>
                </div>
              )}

              <div className="form-group">
                <label className="form-label" htmlFor="rsvp-phone">Phone Number (Optional - for updates)</label>
                <input 
                  type="tel" 
                  id="rsvp-phone" 
                  name="phone" 
                  value={rsvpForm.phone} 
                  onChange={handleRsvpChange} 
                  className="form-input" 
                  placeholder="Enter phone number" 
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="rsvp-message">
                  {rsvpForm.attending === 'no' ? 'Warm Wishes / Blessings' : 'Message / Warm Wishes (Optional)'}
                </label>
                <textarea 
                  id="rsvp-message" 
                  name="message" 
                  value={rsvpForm.message} 
                  onChange={handleRsvpChange} 
                  className="form-input" 
                  placeholder={rsvpForm.attending === 'no' ? "Share your blessings since you cannot make it..." : "Leave a message for our new home"} 
                  rows="3"
                  required={rsvpForm.attending === 'no'}
                  onInvalid={(e) => {
                    if (rsvpForm.attending === 'no') {
                      e.target.setCustomValidity("Please share your warm wishes or blessings! It would mean the world to us. ❤️");
                    } else {
                      e.target.setCustomValidity("");
                    }
                  }}
                  onInput={(e) => e.target.setCustomValidity("")}
                ></textarea>
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%' }} id="btn-submit-rsvp">
                {rsvpForm.attending === 'yes' ? 'Confirm Attendance' : 'Send Wishes & Submit'}
              </button>
            </form>
          ) : (
            <div className="rsvp-success-state" style={{ width: '100%' }}>
              <div className="success-icon-wrapper" style={{ margin: '0 auto 10px' }}>
                <Heart size={36} fill="currentColor" />
              </div>
              <h3 className="rsvp-title" style={{ marginBottom: '5px', textAlign: 'center' }}>Thank You!</h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '15px', lineHeight: '1.6', marginBottom: '20px', textAlign: 'center' }}>
                {rsvpForm.attending === 'yes' 
                  ? "Your response has been saved. We are thrilled to celebrate this special day with you!"
                  : "Your response has been saved. We will miss you! We would love it if you could leave a message of blessing in our Guestbook."
                }
              </p>

              <button 
                onClick={() => dispatch(resetRsvpSubmission())} 
                className="btn-secondary"
                id="btn-edit-rsvp"
                style={{ display: 'block', margin: '0 auto', width: '100%' }}
              >
                Change RSVP Response
              </button>
            </div>
          )}
          
          {/* Joined Guest Names Preview */}
          {filteredRsvpList.filter(r => r.attending === 'yes').length > 0 && (
            <div className="rsvp-attending-names-preview" style={{ width: '100%', marginTop: '15px' }}>
              <strong>Joined by:</strong> {filteredRsvpList.filter(r => r.attending === 'yes').map(r => r.name).join(', ')}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}

export default DetailsSection;
