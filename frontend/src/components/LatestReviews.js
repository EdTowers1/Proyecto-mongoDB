import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import api from '../api';
import { ThumbsUp, ThumbsDown, Heart } from 'lucide-react';
import { motion } from 'framer-motion'; // Importar Framer Motion
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
const MusicWithReviews = forwardRef((props, ref) => {
  const [songs, setSongs] = useState([]);
  const [latestReviews, setLatestReviews] = useState([]);

  useEffect(() => {
    fetchSongsAndReviews();
  }, []);

  useImperativeHandle(ref, () => ({
    someChildMethod() {
      fetchSongsAndReviews();
    },
  }));

  const fetchSongsAndReviews = async () => {
    try {
      const response = await api.get('/music');
      setSongs(response.data);

      const allReviews = response.data.reduce((acc, song) => {
        const reviewsWithSongInfo = song.reviews.map((review) => ({
          ...review,
          songTitle: song.title,
          songId: song._id,
          songArtist: song.artist,
          songRating: song.rating,
        }));
        return [...acc, ...reviewsWithSongInfo];
      }, []);

      const sortedReviews = allReviews
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        // .slice(0, 4); // Limit to 4 reviews to match the CSS

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
 

<div className="relative min-h-screen">
  {/* Fondo encapsulado */}
  <div className="absolute top-0 -z-10 h-full w-full bg-white">
    <div className="absolute bottom-auto left-auto right-0 top-0 h-[500px] w-[500px] -translate-x-[30%] translate-y-[20%] rounded-full bg-[rgba(173,109,244,0.5)] opacity-50 blur-[80px]"></div>
  </div>

  {/* Contenedor principal de las reseñas con el fondo */}
  <div className="music-with-reviews-container p-4 bg-white text-black min-h-screen">
    <div className="latest-reviews">
      <h2 className="text-xl font-bold mb-4">Últimas Reseñas</h2>
      {/* Se añade padding vertical y horizontal al carrusel */}
      <div className="reviews-carousel overflow-x-auto flex flex-row gap-4 snap-x snap-mandatory scrollbar-hide px-6 py-4">
        {latestReviews.map((review) => {
          const maxStars = 5; // Número máximo de estrellas
          const fullStars = Math.floor(review.rating); // Estrellas completas
          const hasHalfStar = review.rating % 1 >= 0.5; // Media estrella
          const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0); // Estrellas vacías

          return (
            <div
              key={review._id}
              className="review-card bg-sky-200 p-4 rounded-lg min-w-[200px] max-w-[300px] max-h-[400px] flex-shrink-0 snap-center flex flex-col justify-between overflow-hidden shadow-md"
            >
              {/* Título y Artista */}
              <div>
                <h3 className="text-sm font-semibold text-black truncate">
                  {review.songTitle}
                </h3>
                <p className="text-xs text-black mt-1 truncate">
                  {review.songArtist}
                </p>
              </div>

              {/* Estrellas para el rating */}
              <div className="flex items-center mt-1">
                {/* Estrellas completas */}
                {Array(fullStars)
                  .fill(0)
                  .map((_, index) => (
                    <FaStar key={`full-${index}`} className="text-yellow-500" />
                  ))}
                {/* Media estrella */}
                {hasHalfStar && <FaStarHalfAlt className="text-yellow-500" />}
                {/* Estrellas vacías */}
                {Array(emptyStars)
                  .fill(0)
                  .map((_, index) => (
                    <FaRegStar key={`empty-${index}`} className="text-gray-400" />
                  ))}
              </div>

              {/* Opinión */}
              <p className="text-sm text-black mt-2 line-clamp-3">
                {review.opinion}
              </p>

              {/* Reacciones y Fecha */}
              <div className="flex items-center justify-between mt-4 flex-wrap">
                <div className="flex items-center space-x-2">
                  <motion.button
                    onClick={() =>
                      handleReactionClick(review.songId, review._id, 'like')
                    }
                    className="flex items-center space-x-1 text-black"
                    whileTap={{ scale: 1.2 }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <Heart className="text-blue-500 w-4 h-4" />
                    <span className="text-xs">{review.likes}</span>
                  </motion.button>
                  <motion.button
                    onClick={() =>
                      handleReactionClick(review.songId, review._id, 'dislike')
                    }
                    className="flex items-center space-x-1 text-black"
                    whileTap={{ scale: 1.2 }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <ThumbsDown className="text-red-500 w-4 h-4" />
                    <span className="text-xs">{review.dislikes}</span>
                  </motion.button>
                </div>
                <small className="text-xs text-black">
                  {new Date(review.date).toLocaleDateString()}
                </small>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
</div>





  
  
  )
  });


export default MusicWithReviews;