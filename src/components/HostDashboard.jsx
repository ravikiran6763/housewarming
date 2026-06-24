import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Users, Check, Trash2, Heart, Search, Download, ArrowLeft, Copy } from 'lucide-react';
import { setCurrentView, setEnvelopeOpened, setEnvelopeStep, setIntroComplete } from '../store/uiSlice';
import { likeWishThunk } from '../store/dbSlice';
import { safeParseDate } from '../store/eventSlice';

export function HostDashboard({ onBackToSite }) {
  const dispatch = useDispatch();
  const { rsvpList, wishes, likedWishIds } = useSelector((state) => state.db);
  const eventConfig = useSelector((state) => state.event.eventConfig);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('attending'); // 'attending', 'declined', 'all'
  const [copiedId, setCopiedId] = useState(null);

  // Copy to Clipboard helper
  const handleCopyPhone = (phone, id) => {
    if (!phone) return;
    navigator.clipboard.writeText(phone);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Export to CSV helper
  const handleExportCSV = () => {
    const headers = ['Name', 'Phone', 'Attending', 'Guests', 'Message', 'Date'];
    const rows = rsvpList.map(rsvp => [
      rsvp.name || '',
      rsvp.phone || '',
      rsvp.attending || '',
      rsvp.attending === 'yes' ? (rsvp.guests || '1') : '0',
      rsvp.message || '',
      rsvp.created_at ? safeParseDate(rsvp.created_at).toLocaleDateString() : ''
    ]);
    
    const csvRows = [
      headers.join(','), 
      ...rows.map(row => row.map(val => `"${val.replace(/"/g, '""')}"`).join(','))
    ];
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${eventConfig.houseName.toLowerCase().replace(/\s+/g, '_')}_rsvp_list_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBack = () => {
    if (window.location.search || window.location.hash) {
      window.history.pushState({}, '', window.location.pathname);
    }
    dispatch(setEnvelopeOpened(false));
    dispatch(setIntroComplete(false));
    dispatch(setEnvelopeStep(0));
    dispatch(setCurrentView('invitation'));
    if (onBackToSite) {
      onBackToSite();
    }
  };

  // Calculate Statistics
  const totalRsvps = rsvpList.length;
  const yesRsvps = rsvpList.filter(r => r.attending === 'yes');
  const noRsvps = rsvpList.filter(r => r.attending === 'no');
  
  const totalAttendingGuests = yesRsvps.reduce((acc, curr) => {
    const val = parseInt(curr.guests, 10);
    return acc + (isNaN(val) ? 1 : val);
  }, 0);

  // Filter RSVP lists
  const filteredRsvps = rsvpList.filter(rsvp => {
    const matchesSearch = 
      (rsvp.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (rsvp.phone || '').includes(searchTerm);
    
    if (!matchesSearch) return false;
    
    if (activeTab === 'attending') return rsvp.attending === 'yes';
    if (activeTab === 'declined') return rsvp.attending === 'no';
    return true;
  });

  // Filter Wishes matching search
  const filteredWishes = wishes.filter(wish => {
    return (wish.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
           (wish.wish || '').toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="host-dashboard animate-fade-in">
      <header className="dashboard-header glass-card">
        <div className="dashboard-header-left">
          <span className="section-subtitle">Host Control Panel</span>
          <h1 className="dashboard-title">{eventConfig.houseName} Guests & Wishes</h1>
        </div>
        <div className="dashboard-header-actions">
          <button 
            onClick={handleExportCSV} 
            className="btn-primary btn-dashboard"
            title="Download CSV of all responses"
          >
            <Download size={18} />
            Export CSV
          </button>
          <button 
            onClick={handleBack} 
            className="btn-secondary btn-dashboard"
          >
            <ArrowLeft size={18} />
            Back to Site
          </button>
        </div>
      </header>

      {/* Stats Cards Section */}
      <div className="stats-grid">
        <div className="stat-card glass-card">
          <div className="stat-icon-wrapper gold">
            <Users size={24} />
          </div>
          <div className="stat-details">
            <span className="stat-value">{totalAttendingGuests}</span>
            <span className="stat-label">Total Attending Guests</span>
          </div>
        </div>

        <div className="stat-card glass-card">
          <div className="stat-icon-wrapper green">
            <Check size={24} />
          </div>
          <div className="stat-details">
            <span className="stat-value">{yesRsvps.length}</span>
            <span className="stat-label">Yes Responses ({totalRsvps ? Math.round((yesRsvps.length/totalRsvps)*100) : 0}%)</span>
          </div>
        </div>

        <div className="stat-card glass-card">
          <div className="stat-icon-wrapper red">
            <Trash2 size={24} />
          </div>
          <div className="stat-details">
            <span className="stat-value">{noRsvps.length}</span>
            <span className="stat-label">Declined Responses</span>
          </div>
        </div>

        <div className="stat-card glass-card">
          <div className="stat-icon-wrapper rose">
            <Heart size={24} fill="currentColor" />
          </div>
          <div className="stat-details">
            <span className="stat-value">{wishes.length}</span>
            <span className="stat-label">Total Blessings & Wishes</span>
          </div>
        </div>
      </div>

      {/* Main Panel Search & Layout */}
      <div className="dashboard-controls glass-card">
        <div className="search-bar-container">
          <Search className="search-icon" size={20} />
          <input 
            type="text" 
            placeholder="Search guests by name or phone number..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="tab-container">
          <button 
            className={`tab-btn ${activeTab === 'attending' ? 'active' : ''}`}
            onClick={() => setActiveTab('attending')}
          >
            Attending ({yesRsvps.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'declined' ? 'active' : ''}`}
            onClick={() => setActiveTab('declined')}
          >
            Declined ({noRsvps.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Responses ({totalRsvps})
          </button>
        </div>
      </div>

      {/* Split Dual-Pane View */}
      <div className="dashboard-split-layout">
        {/* Left Pane - Guest Responses Table */}
        <div className="dashboard-pane guest-directory-pane glass-card">
          <div className="pane-header">
            <h3>RSVP Response Directory</h3>
            <span className="pane-count">Showing {filteredRsvps.length} entries</span>
          </div>

          <div className="table-responsive">
            <table className="guest-table">
              <thead>
                <tr>
                  <th>Guest Name</th>
                  <th>Contact Info</th>
                  <th>Attendance</th>
                  <th>Party Size</th>
                  <th>RSVP Blessing / Note</th>
                </tr>
              </thead>
              <tbody>
                {filteredRsvps.length > 0 ? (
                  filteredRsvps.map((guest, idx) => (
                    <tr key={guest.id || idx} className="guest-row">
                      <td className="guest-cell-name">{guest.name}</td>
                      <td className="guest-cell-phone">
                        {guest.phone ? (
                          <div className="phone-badge">
                            <span>{guest.phone}</span>
                            <button 
                              onClick={() => handleCopyPhone(guest.phone, guest.id || idx)}
                              className="copy-btn"
                              title="Copy Phone Number"
                            >
                              <Copy size={13} />
                              {copiedId === (guest.id || idx) && <span className="copied-tooltip">Copied!</span>}
                            </button>
                          </div>
                        ) : (
                          <span className="no-phone">None provided</span>
                        )}
                      </td>
                      <td>
                        <span className={`status-badge ${guest.attending === 'yes' ? 'attending' : 'declined'}`}>
                          {guest.attending === 'yes' ? 'Attending' : 'Declined'}
                        </span>
                      </td>
                      <td className="guest-cell-size">
                        {guest.attending === 'yes' ? `${guest.guests || 1} guest(s)` : '-'}
                      </td>
                      <td className="guest-cell-message">
                        {guest.message ? (
                          <span className="guest-note-text">"{guest.message}"</span>
                        ) : (
                          <span className="no-message">-</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="table-empty">
                      No guests match your search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Pane - Posts / Wishes Wall */}
        <div className="dashboard-pane wishes-wall-pane glass-card">
          <div className="pane-header">
            <h3>Blessings & Wishes Feed</h3>
            <span className="pane-count">{filteredWishes.length} wishes</span>
          </div>

          <div className="wishes-scroll-wall">
            {filteredWishes.length > 0 ? (
              filteredWishes.map((item, idx) => {
                const isLiked = likedWishIds.includes(item.id);
                const likesCount = item.likes || 0;
                return (
                  <div key={item.id || idx} className="dashboard-wish-card">
                    <p className="wish-card-text">"{item.wish}"</p>
                    <div className="wish-card-footer">
                      <span className="wish-card-author">{item.name}</span>
                      <span className="wish-card-date">{item.date}</span>
                    </div>
                    <div className="wish-card-actions">
                      <button 
                        className={`wish-like-btn ${isLiked ? 'liked' : ''}`}
                        onClick={() => dispatch(likeWishThunk(item.id))}
                        aria-label={isLiked ? "Unlike wish" : "Like wish"}
                      >
                        <Heart size={12} fill={isLiked ? "currentColor" : "none"} />
                        <span>{likesCount}</span>
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="wishes-empty">
                No wishes found matching your search.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HostDashboard;
