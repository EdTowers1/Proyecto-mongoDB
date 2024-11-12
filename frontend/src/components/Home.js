// src/components/Home.js
import React, { useEffect, useState } from 'react';
import api from '../api';

const Home = ({ token }) => {
  const [songs, setSongs] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);
  const [opinion, setOpinion] = useState('');
  const [rating, setRating] = useState(1);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await api.get('/music');
        setSongs(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchSongs();
  }, []);

  const handleReviewSubmit = async (songId) => {
    try {
      await api.post(
        `/music/${songId}/review`,
        { opinion, rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Reseña agregada');
      setOpinion('');
      setRating(1);
    } catch (error) {
      console.error(error);
      alert('Error al agregar reseña');
    }
  };

  return (
    <div>
      <h2>Canciones</h2>
      <ul>
        {songs.map((song) => (
          <li key={song._id}>
            <h3>{song.title}</h3>
            <p>{song.artist}</p>
            <button onClick={() => setSelectedSong(song)}>Agregar Reseña</button>
          </li>
        ))}
      </ul>

      {selectedSong && (
        <div>
          <h3>Agregar Reseña para {selectedSong.title}</h3>
          <textarea
            placeholder="Tu opinión"
            value={opinion}
            onChange={(e) => setOpinion(e.target.value)}
          />
          <input
            type="number"
            value={rating}
            min="1"
            max="5"
            onChange={(e) => setRating(e.target.value)}
          />
          <button onClick={() => handleReviewSubmit(selectedSong._id)}>Enviar Reseña</button>
        </div>
      )}
    </div>
  );
};

export default Home;
