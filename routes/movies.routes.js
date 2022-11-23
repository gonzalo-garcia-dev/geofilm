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
        .then(movie => {
            res.render('movies/list', { movie })
        })
        .catch(err => console.log(err))
})



//Create movie HANDLER
router.post("/crear-pelicula", isLoggedIn, (req, res, next) => {

    let user = req.session.currentUser._id
    const { title, director, year, image, latitude, longitude } = req.body

    const location = {
        type: 'Point',
        coordinates: [latitude, longitude]
    }

    Movie
        .create({ title, director, year, image, location, user })
        .then(() => {
            res.redirect(`/listado`)
        })
        .catch(err => console.log(err))
});

//Movies details RENDER

router.get("/detalles/:pelicula_id", (req, res, next) => {

    const { pelicula_id } = req.params

    Movie
        .findById(pelicula_id)
        .populate('user')
        .then(movieId => {
            res.render('movies/details', {
                movieId,
                isADMIN: req.session.currentUser.role === 'ADMIN'
            })
        })
        .catch(err => console.log(err))
})

//Edit movie form render

router.get("/editar-pelicula/:pelicula_id", isLoggedIn, (req, res, next) => {

    const { pelicula_id } = req.params
    Movie
        .findById(pelicula_id)
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

router.post("/editar-pelicula/:pelicula_id", isLoggedIn, (req, res, next) => {
    console.log('entro aquí')

    const { pelicula_id } = req.params
    const { title, director, year, image, latitude, longitude } = req.body
    const location = {
        type: 'Point',
        coordinates: [latitude, longitude]
    }

    Movie
        .findByIdAndUpdate(pelicula_id, { title, director, year, image, location })
        .then(() => res.redirect(`/detalles/${pelicula_id}`))
        .catch(err => console.log(err))
})

router.get("/buscar", isLoggedIn, (req, res, next) => {
    const { title } = req.query

    api
        .findAllMovies(title)
        .then((response) => {
            console.log(response.data)
            res.render('movies/search-movies', { movies: response.data.results })
        })
        .catch(err => console.log(err))
})

router.get("/pelicula/crear-localizacion/:movieId", isLoggedIn, (req, res, next) => {
    const { movieId } = req.params

    api
        .getOneMovie(movieId)
        .then(movieId => {
            res.render('movies/create', { movie: movieId.data })
        })
        .catch(err => console.log(err))
})




module.exports = router;