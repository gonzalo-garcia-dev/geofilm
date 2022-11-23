const mongoose = require('mongoose')
const Schema = mongoose.Schema

const reviewSchema = new Schema(
  {
    rating: Number,
    comment: String,

    author: {
      type: mongoose.Types.ObjectId,
      ref: 'User'
    },

    movieId: {
      type: mongoose.Types.ObjectId,
      ref: 'Movie'
    },


  },



  {
    timestamps: true
  }


);


reviewSchema.index({ location: '2dsphere' })
const Review = mongoose.model('Review', reviewSchema)
module.exports = Review;
