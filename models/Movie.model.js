const mongoose = require('mongoose')
const Schema = mongoose.Schema

const movieSchema = new Schema(
  {
    title: String,

    director: String,

    year: Number,

    image: String,

    location: {
      type: {
        type: String
      },
      coordinates: [Number]
    }
  },

  {
    timestamps: true
  }

);


movieSchema.index({ location: '2dsphere' })
const Movie = mongoose.model('Movie', movieSchema)
module.exports = Movie;
