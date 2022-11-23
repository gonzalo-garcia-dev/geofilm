const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const isLoggedIn = require("../middleware/isLoggedIn");
const Movie = require("../models/Movie.model");
const imdbApi = require("../services/imdb-api.service")
const api = new imdbApi()

//Movies list RENDER
router.get("/listado", isLoggedIn, (req, res, next) => {

    Movie
        .find()
        // .select({title: 1})
        .then(movie => {
            res.render('movies/list', { movie })
        })
        .catch(err => console.log(err))
})



//Create movie HANDLER
router.post("/crear-pelicula", isLoggedIn, (req, res, next) => {

    let { _id: user } = req.session.currentUser
    const { title, director, year, image, latitude, longitude } = req.body

    const location = {
        type: 'Point',
        coordinates: [latitude, longitude]
    }

    Movie
        .create({ title, director, year, image, location, user })
        .then(() => {
            res.redirect(`/peliculas/listado`)
        })
        .catch(err => console.log(err))
});

//Movies details RENDER

router.get("/detalles/:movie_id", (req, res, next) => {

    const { movie_id: id } = req.params

    Movie
        .findById(id)
        .populate('user')
        .then(movie => {
            res.render('movies/details', {
                movie,
                isADMIN: req.session.currentUser.role === 'ADMIN'
            })
        })
        .catch(err => console.log(err))
})

//Edit movie form render

router.get("/editar-pelicula/:movie_id", isLoggedIn, (req, res, next) => {

    const { movie_id: id } = req.params
    Movie
        .findById(id)
        .then(movie => {
            const { _id, title, director, year, image } = movie
            const latitude = movie.location.coordinates[0]
            const longitude = movie.location.coordinates[1]
            movie = {
                _id,
                title,
                director,
                year,
                image,
                latitude,
                longitude
            }

            res.render('movies/edit', movie)
        })
        .catch(err => console.log(err))
});


//Edit movie form post

router.post("/editar-pelicula/:movie_id", isLoggedIn, (req, res, next) => {

    const { movie_id: id } = req.params
    const { title, director, year, image, latitude, longitude } = req.body
    const location = {
        type: 'Point',
        coordinates: [latitude, longitude]
    }

    Movie
        .findByIdAndUpdate(id, { title, director, year, image, location })
        .then(() => res.redirect(`/peliculas/detalles/${id}`))
        .catch(err => console.log(err))
})

//Search movie from api

router.get("/buscar", isLoggedIn, (req, res, next) => {
    const { title } = req.query

    api
        .findAllMovies(title)
        .then((response) => {
            res.render('movies/search-movies', { movies: response.data.results })
        })
        .catch(err => console.log(err))
})

//Select movie from api

router.get("/crear-localizacion/:movieId", isLoggedIn, (req, res, next) => {
    const { movieId: id } = req.params

    api
        .getOneMovie(id)
        .then(movie => {
            res.render('movies/create', { movie: movie.data })
        })
        .catch(err => console.log(err))
})




module.exports = router;