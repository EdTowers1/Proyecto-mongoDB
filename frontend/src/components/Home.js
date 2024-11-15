// src/components/Home.js
import React, { useEffect, useState } from "react";
import api from "../api";
import { Search, Music4, Star, ChevronDown } from "lucide-react";

const Home = ({ token }) => {
  const [songs, setSongs] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);
  const [opinion, setOpinion] = useState("");
  const [rating, setRating] = useState(1);
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda
  const [reviews, setReviews] = useState([]); // Estado para las reseñas

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await api.get("/music");
        setSongs(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchSongs();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredSongs = songs.filter((song) =>
    song.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleReviewSubmit = async (songId) => {
    try {
      await api.post(
        `/music/${songId}/review`,
        { opinion, rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Reseña agregada');
      setReviews([...reviews, { songId, opinion, rating }]); // Añade la nueva reseña al estado
      setOpinion('');
      setRating(1);
      setSelectedSong(null);
    } catch (error) {
      console.error(error);
      alert('Error al agregar reseña');
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-gray-300">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-6">
              <a href="/" className="flex items-center gap-2">
                <Music4 size={32} color="#000" />
                <span className="sr-only">Sony Music</span>
              </a>
              <nav className="hidden items-center gap-6">
                <a href="#" className="text-sm font-medium">
                  Home
                </a>
                <a href="#" className="text-sm font-medium">
                  Musics
                </a>
                <a href="#" className="text-sm font-medium">
                  Premium
                </a>
                <a href="#" className="text-sm font-medium">
                  Contact
                </a>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm">Premium Member ⭐</span>
              <div className="w-8 h-8 rounded-full bg-gray-300"></div>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
            <input
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded"
              placeholder="Search here..."
              value={searchTerm}
              onChange={handleSearchChange}
              aria-label="Search songs"
            />
            {searchTerm && (
              <button
                className="absolute right-3 top-3 text-gray-500"
                onClick={() => setSearchTerm("")}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-4 mb-6 overflow-x-auto pb-2">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded bg-white">
              Artist
              <ChevronDown size={16} />
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded bg-white">
              Jasp
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded bg-white">
              Rock
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded bg-white">
              Melody
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded bg-white">
              Karoke
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded bg-white">
              Albums
              <ChevronDown size={16} />
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded bg-white">
              Language
              <ChevronDown size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredSongs.map((song) => (
  <div key={song._id} className="border border-gray-300 rounded overflow-hidden">
    <img
      src={song.cover || 'https://via.placeholder.com/400'}
      alt={song.title}
      className="w-full aspect-square object-cover"
    />
    <div className="p-4">
      <h3 className="font-semibold mb-1">{song.title}</h3>
      <p className="text-sm text-gray-500 mb-3">{song.artist}</p>
      <button
        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded bg-white"
        onClick={() => setSelectedSong(song)}
      >
        Agregar Reseña
      </button>
      <div className="mt-4">
        <h4 className="font-semibold">Reseñas:</h4>
        {reviews.filter(review => review.songId === song._id).map((review, index) => (
          <div key={index} className="mt-2">
            <p className="text-sm">{review.opinion}</p>
            <p className="text-sm text-gray-500">Rating: {review.rating}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
))}


          {selectedSong && (
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded shadow-lg max-w-md w-full">
              <h3 className="mb-4">Agregar Reseña para {selectedSong.title}</h3>
              <textarea
                placeholder="Tu opinión"
                value={opinion}
                onChange={(e) => setOpinion(e.target.value)}
                className="w-full mb-4 p-2 border border-gray-300 rounded"
              />
              <div className="flex items-center gap-2 mb-4">
                <Star size={16} />
                <input
                  type="number"
                  value={rating}
                  min="1"
                  max="5"
                  onChange={(e) => setRating(e.target.value)}
                  className="w-12 p-1 border border-gray-300 rounded"
                />
              </div>
              <div className="flex justify-between">
                <button
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded bg-white"
                  onClick={() => setSelectedSong(null)}
                >
                  Cancelar
                </button>
                <button
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded bg-white"
                  onClick={() => handleReviewSubmit(selectedSong._id)}
                >
                  Enviar Reseña
                </button>
              </div>
            </div>
          )}
        </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
