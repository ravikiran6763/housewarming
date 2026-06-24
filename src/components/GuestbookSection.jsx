import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Heart } from 'lucide-react';
import { likeWishThunk } from '../store/dbSlice';

const filterWishesByEvent = (list, eventId) => {
  if (!list) return [];
  const targetPrefix = `[${eventId}]`;
  return list.filter(item => {
    const w = item.wish || '';
    if (eventId === 'laxmi-kote-default') {
      return w.startsWith(targetPrefix) || !w.trim().startsWith('[');
    }
    return w.startsWith(targetPrefix);
  }).map(item => {
    const w = item.wish || '';
    let cleanWish = w;
    if (w.startsWith(targetPrefix)) {
      cleanWish = w.slice(targetPrefix.length).trim();
    }
    return { ...item, wish: cleanWish };
  });
};

export function GuestbookSection() {
  const dispatch = useDispatch();
  const eventConfig = useSelector((state) => state.event.eventConfig);
  const { wishes, likedWishIds } = useSelector((state) => state.db);

  const filteredWishes = filterWishesByEvent(wishes, eventConfig.eventId);

  const handleLike = (wishId) => {
    dispatch(likeWishThunk(wishId));
  };

  if (!eventConfig.showGuestbook) return null;

  return (
    <section id="guestbook">
      <div className="section-title-container">
        <span className="section-subtitle">Warm Wishes</span>
        <h2 className="section-title">Home Guestbook</h2>
        <div className="section-divider">
          <div className="line"></div>
          <div className="diamond"></div>
          <div className="line"></div>
        </div>
      </div>

      <div className="guestbook-section">
        {/* Wishes Wall */}
        <div className="guestbook-wall">
          {filteredWishes.length > 0 ? (
            filteredWishes.map((item) => {
              const isLiked = likedWishIds.includes(item.id);
              const likesCount = item.likes || 0;
              return (
                <div key={item.id} className="guestbook-note">
                  <p className="note-message">"{item.wish}"</p>
                  <div className="note-footer">
                    <span className="note-author">{item.name}</span>
                    <span className="note-date">{item.date}</span>
                  </div>
                  <div className="wish-action-container">
                    <button 
                      className={`wish-like-btn ${isLiked ? 'liked' : ''}`}
                      onClick={() => handleLike(item.id)}
                      aria-label={isLiked ? "Unlike wish" : "Like wish"}
                    >
                      <Heart size={14} fill={isLiked ? "currentColor" : "none"} />
                      <span>{likesCount}</span>
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="guestbook-empty">
              No wishes posted yet. Be the first to leave a warm message!
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default GuestbookSection;
