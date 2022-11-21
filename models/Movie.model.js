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
<<<<<<< HEAD
    }

=======
    },
    user: [{
      type: mongoose.Types.ObjectId,
      ref: 'User'
    }]
>>>>>>> dd246e9013ed1ba383bf94ff8b829dd7c1022ebb
  },

  {
    timestamps: true
  }

);


movieSchema.index({ location: '2dsphere' })
const Movie = mongoose.model('Movie', movieSchema)
module.exports = Movie;
