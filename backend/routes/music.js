const express = require('express');
const router = express.Router();
const Music = require('../models/Music');
const authMiddleware = require('../middleware/auth');

// Ruta para CREAR una nueva canción
router.post('/', async (req, res) => {
  const { title, artist, genre, releaseYear, image, audio } = req.body;
  const newMusic = new Music({ title, artist, genre, releaseYear, image, audio });

  try {
    const savedMusic = await newMusic.save();
    res.status(201).json(savedMusic);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Ruta para LEER todas las canciones
router.get('/', async (req, res) => {
  try {
    const songs = await Music.find();
    res.json(songs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Ruta para LEER una canción específica por ID
router.get('/:id', async (req, res) => {
  try {
    const song = await Music.findById(req.params.id);
    if (!song) return res.status(404).json({ message: "Canción no encontrada" });
    res.json(song);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Ruta para ACTUALIZAR una canción por ID
router.put('/:id', async (req, res) => {
  const { title, artist, genre, releaseYear, image } = req.body;

  try {
    const updatedSong = await Music.findByIdAndUpdate(
      req.params.id,
      { title, artist, genre, releaseYear, image },
      { new: true, runValidators: true }
    );
    if (!updatedSong) return res.status(404).json({ message: "Canción no encontrada" });
    res.json(updatedSong);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Ruta para ELIMINAR una canción por ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedSong = await Music.findByIdAndDelete(req.params.id);
    if (!deletedSong) return res.status(404).json({ message: "Canción no encontrada" });
    res.json({ message: "Canción eliminada correctamente" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Obtener todas las canciones o álbumes con filtro por género
router.get('/', async (req, res) => {
  const { genre } = req.query;
  let filter = {};
  if (genre) filter.genre = genre;

  try {
    const musicList = await Music.find(filter);
    res.json(musicList);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Ruta para agregar una reseña a una canción (requiere autenticación)
router.post('/resena/:_id/review', async (req, res) => {
  const { opinion, rating } = req.body;

  try {
    const song = await Music.findById(req.params._id);
    if (!song) return res.status(404).json({ message: "Canción no encontrada" });

    const review = { user: req.userId, opinion, rating };
    song.reviews.push(review);

    // Calcular el promedio de calificación
    const totalRatings = song.reviews.reduce((acc, r) => acc + r.rating, 0);
    song.averageRating = totalRatings / song.reviews.length;

    await song.save();
    res.status(201).json(song);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Ruta para Obtener Todas las Reseñas de una Canción
router.get('/:id/reviews', async (req, res) => {
  try {
    // Encuentra la canción por ID
    const song = await Music.findById(req.params.id);
    if (!song) return res.status(404).json({ message: "Canción no encontrada" });

    // Devuelve solo las reseñas de la canción
    res.json(song.reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Ruta para Actualizar Likes y Dislikes de una Reseña Específica
router.patch('/:songId/review/:reviewId', async (req, res) => {
  const { action } = req.body; // Acción esperada: 'like' o 'dislike'

  try {
    // Encuentra la canción por ID
    const song = await Music.findById(req.params.songId);
    if (!song) return res.status(404).json({ message: "Canción no encontrada" });

    // Encuentra la reseña específica dentro del array de reseñas
    const review = song.reviews.id(req.params.reviewId);
    if (!review) return res.status(404).json({ message: "Reseña no encontrada" });

    // Actualizar 'likes' o 'dislikes' según la acción
    if (action === 'like') {
      review.likes += 1;
    } else if (action === 'dislike') {
      review.dislikes += 1;
    } else {
      return res.status(400).json({ message: "Acción no válida" });
    }

    // Guardar cambios en la canción
    await song.save();
    res.json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Incrementar contador de visitas de una canción o álbum
router.patch('/:_id/view', async (req, res) => {
  try {
    const music = await Music.findById(req.params._id);
    if (!music) return res.status(404).json({ message: "Canción no encontrada" });

    music.views += 1;
    await music.save();
    res.json(music);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
