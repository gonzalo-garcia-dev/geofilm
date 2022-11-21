const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
// const isLoggedOut = require("../middleware/isLoggedOut");
// const isLoggedIn = require("../middleware/isLoggedIn");

const Movie = require("../models/Movie.model");

//Movies list
router.get("/listado", (req, res, next) => {


    Movie
        .find()
        .then(movie => {
            res.render('movies/list', { movie })
        })
        .catch(err => console.log(err))
})


//Create movie render
router.get("/crear-pelicula", (req, res, next) => {

    res.render("movies/create");
});

//Create movie handler
router.post("/crear-pelicula", (req, res, next) => {
    const { title, director, year, image, latitude, longitude } = req.body

    const location = {
        type: 'Point',
        coordinates: [latitude, longitude]
    }

    Movie
        .create({ title, director, year, image, location })
        .then(movie => {
            res.redirect(`/movie/detalle/${movie._id}`)
        })
        .catch(err => console.log(err))
});

//Movies details






module.exports = router;