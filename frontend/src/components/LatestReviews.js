import React, { useState, useEffect } from 'react';
import api from '../api';
import { ThumbsUp, ThumbsDown, Heart, Play } from 'lucide-react';

const MusicWithReviews = () => {
  const [songs, setSongs] = useState([]);
  const [latestReviews, setLatestReviews] = useState([]);

  useEffect(() => {
    fetchSongsAndReviews();
  }, []);

  const fetchSongsAndReviews = async () => {
    try {
      const response = await api.get('/music');
      setSongs(response.data);

      const allReviews = response.data.reduce((acc, song) => {
        const reviewsWithSongInfo = song.reviews.map(review => ({
          ...review,
          songTitle: song.title,
          songId: song._id,
          songArtist: song.artist
        }));
        return [...acc, ...reviewsWithSongInfo];
      }, []);

      const sortedReviews = allReviews
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 4); // Limit to 4 reviews to match the CSS

      setLatestReviews(sortedReviews);
    } catch (error) {
      console.error('Error fetching songs and reviews:', error);
    }
  };

  const handleReactionClick = async (songId, reviewId, action) => {
    try {
      await api.patch(`/music/${songId}/review/${reviewId}`, { action });
      fetchSongsAndReviews();
    } catch (error) {
      console.error('Error updating review reaction:', error);
    }
  };

  return (
    <div className="music-with-reviews-container p-4 bg-white text-black min-h-screen">
      <div className="songs-list mb-8">
      </div>
      <div className="latest-reviews">
        <h2 className="text-xl font-bold mb-4">Últimas Reseñas</h2>
        <div className="reviews-list flex flex-row flex-wrap gap-12 justify-center items-baseline content-end">
          {latestReviews.map((review, index) => (
            <div 
              key={review._id} 
              className="review-card bg-gray-400 p-4 rounded-lg relative w-[2
              150px] h-[130px] flex-grow"
            >

              <div className="flex flex-col h-full justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-black truncate">{review.songTitle}</h3>
                  <p className="text-xs text-black mt-1 truncate">{review.songArtist}</p>
                  <p className="text-base text-black mt-1 line-clamp-2">{review.opinion}</p>
                </div>
                <div className="mt-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button onClick={() => handleReactionClick(review.songId, review._id, 'like')} className="flex items-center space-x-1 text-white">
                        <Heart className="text-blue-500 w-3 h-3" />
                        <span className="text-xs">{review.likes}</span>
                      </button>
                      <button onClick={() => handleReactionClick(review.songId, review._id, 'dislike')} className="flex items-center space-x-1 text-white">
                        <ThumbsDown className="text-red-500 w-3 h-3" />
                        <span className="text-xs">{review.dislikes}</span>
                      </button>
                    </div>
                    <small className="text-xs text-gray-400">{new Date(review.date).toLocaleDateString()}</small>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MusicWithReviews;

