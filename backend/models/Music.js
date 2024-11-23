const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  opinion: String,
  rating: { type: Number, min: 1, max: 5 },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  date: { type: Date, default: Date.now }
});

const musicSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  genre: { type: String, required: true },
  releaseYear: { type: Number, required: true },
  image: String,
  audio: { type: String, required: true },
  reviews: [reviewSchema],
  views: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 }
});

module.exports = mongoose.model('Music', musicSchema);