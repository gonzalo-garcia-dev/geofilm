const mongoose = require('mongoose')
const Schema = mongoose.Schema

const reviewSchema = new Schema(
  {
    rating: Number,
    comment: String
  },

  {
    timestamps: true
  }

);


reviewSchema.index({ location: '2dsphere' })
const Review = mongoose.model('Review', reviewSchema)
module.exports = Review;
