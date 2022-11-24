const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const isLoggedIn = require("../middleware/isLoggedIn")
const Movie = require("../models/Movie.model")


router.get('/mapa', isLoggedIn, (req, res, next) => {

    Movie
        .find()
        // .select({title: 1})
        .then(movie => {
            res.render('map/movie-location', { movie })
        })
        .catch(error => { next(error) })

})



module.exports = router