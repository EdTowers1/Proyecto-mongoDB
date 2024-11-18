// src/components/Home.js
import React, { useEffect, useState } from 'react';
import api from '../api';
import styled from '@emotion/styled';
import { Search, Music4, Star, ChevronDown } from 'lucide-react';
import MusicFormModal from './MusicFormModal';

const Header = styled.header`
  border-bottom: 1px solid #e5e5e5;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid #e5e5e5;
  border-radius: 0.25rem;
  background-color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem 1rem 0.5rem 2.5rem;
  border: 1px solid #e5e5e5;
  border-radius: 0.25rem;
`;

const Card = styled.div`
  border: 1px solid #e5e5e5;
  border-radius: 0.25rem;
  overflow: hidden;
`;

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};



const Home = ({ token }) => {
  const [songs, setSongs] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);
  const [opinion, setOpinion] = useState('');
  const [rating, setRating] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedArtist, setSelectedArtist] = useState('');


  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await api.get('/music');
        setSongs(response.data);
        setFilteredSongs(response.data); // Inicializa las canciones filtradas con todas
      } catch (error) {
        console.error(error);
      }
    };
    fetchSongs();
  }, []);

  useEffect(() => {
    // Filtra las canciones basándote en el término de búsqueda
    const filtered = songs.filter(song =>
      song.title.toLowerCase().includes(searchTerm.toLowerCase()) || song.genre.toLowerCase().includes(searchTerm.toLowerCase())  // Cambia "title" si tus datos tienen otro nombre para la canción
    );
    setFilteredSongs(filtered);
  }, [searchTerm, songs]);

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
      setSelectedSong(null);
    } catch (error) {
      console.error(error);
      alert('Error al agregar reseña');
    }
  };

  // Filtrar canciones basadas en el género y el artista
  useEffect(() => {
    let filtered = songs;

    if (selectedGenre) {
      filtered = filtered.filter((song) =>
        song.genre.toLowerCase().includes(selectedGenre.toLowerCase()) // Filtra por género
      );
    }

    if (selectedArtist) {
      filtered = filtered.filter((song) =>
        song.artist.toLowerCase().includes(selectedArtist.toLowerCase()) // Filtra por artista
      );
    }

    setFilteredSongs(filtered);
  }, [selectedGenre, selectedArtist, songs]);


  // Extrae géneros únicos de la lista de música
  const uniqueGeneros = Array.from(new Set(songs.map(song => song.genre)));

  // Filtrar canciones basadas en el artista seleccionado
  useEffect(() => {
    if (selectedArtist) {
      const filtered = songs.filter((song) =>
        song.artist.toLowerCase().includes(selectedArtist.toLowerCase()) // Filtra por artista
      );
      setFilteredSongs(filtered);
    } else {
      setFilteredSongs(songs); // Muestra todas las canciones si no hay artista seleccionado
    }
  }, [selectedArtist, songs]);

  // Obtener lista única de artistas
  const uniqueArtists = [...new Set(songs.map((song) => song.artist))];



  return (
    <div className="min-h-screen bg-background">
      <Header>
        <Container>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Music4 size={32} color="#000" />
                <span className="sr-only">Sony Music</span>
              </a>
              <nav style={{ display: 'none', alignItems: 'center', gap: '1.5rem' }}>
                <a href="#" style={{ fontSize: '0.875rem', fontWeight: '500' }}>Home</a>
                <a href="#" style={{ fontSize: '0.875rem', fontWeight: '500' }}>Musics</a>
                <a href="#" style={{ fontSize: '0.875rem', fontWeight: '500' }}>Premium</a>
                <a href="#" style={{ fontSize: '0.875rem', fontWeight: '500' }}>Contact</a>
              </nav>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '0.875rem' }}>Premium Member ⭐</span>
              <div style={{ width: '2rem', height: '2rem', borderRadius: '50%', backgroundColor: '#e5e5e5' }}></div>
            </div>
          </div>
        </Container>
      </Header>

      <main style={{ padding: '1.5rem 1rem' }}>
        <Container>

          <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
            <Search style={{ position: 'absolute', left: '0.75rem', top: '0.75rem', width: '1rem', height: '1rem', color: '#6b7280' }} />
            <Input
              placeholder="Search here..."
              style={{ paddingLeft: '2.5rem' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
            <select
              id="artist-select"
              value={selectedArtist}
              onChange={(e) => setSelectedArtist(e.target.value)}
              style={{
                width: '40%',
                padding: '0.5rem',
                borderRadius: '0.25rem',
                border: '1px solid #ddd',
              }}
            >
              <option value="">All Artists</option>
              {uniqueArtists.map((artist, index) => (
                <option key={index} onClick={() => setSelectedArtist(artist)} value={artist}>
                  {artist}
                </option>
              ))}
            </select>
            {/* <Button onClick={() => setSelectedGenre('Pop')}>Pop</Button> */}
            {uniqueGeneros.map((genre, index) => (
              <Button key={index} onClick={() => setSelectedGenre(genre)}>{genre}</Button>
            ))}
            {/* modal agregar cancion */}
            <MusicFormModal />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
            {filteredSongs.map((song) => (
              <Card key={song._id}>
                <img src={song.cover || 'https://via.placeholder.com/400'} alt={song.title} style={{ width: '100%', aspectRatio: '1 / 1', objectFit: 'cover' }} />
                <div style={{ padding: '1rem' }}>
                  <h3 style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{song.title}</h3>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.75rem' }}>{song.artist}</p>
                  <Button onClick={() => setSelectedSong(song)}>
                    Agregar Reseña
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {selectedSong && (
            <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 0 10px rgba(0,0,0,0.1)', maxWidth: '400px', width: '100%' }}>
              <h3 style={{ marginBottom: '1rem' }}>Agregar Reseña para {selectedSong.title}</h3>
              <textarea
                placeholder="Tu opinión"
                value={opinion}
                onChange={(e) => setOpinion(e.target.value)}
                style={{ width: '100%', marginBottom: '1rem', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #e5e5e5' }}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Star size={16} />
                <input
                  type="number"
                  value={rating}
                  min="1"
                  max="5"
                  onChange={(e) => setRating(e.target.value)}
                  style={{ width: '3rem', padding: '0.25rem', borderRadius: '0.25rem', border: '1px solid #e5e5e5' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button onClick={() => setSelectedSong(null)}>Cancelar</Button>
                <Button onClick={() => handleReviewSubmit(selectedSong._id)}>Enviar Reseña</Button>
              </div>
            </div>
          )}
        </Container>
      </main>
    </div>
  );
};

export default Home;
