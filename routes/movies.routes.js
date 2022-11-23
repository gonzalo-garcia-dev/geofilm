const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const isLoggedIn = require("../middleware/isLoggedIn")
const Movie = require("../models/Movie.model")
const Review = require("../models/Review.model")
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
        .catch(error => { next(error) })
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
        .catch(error => { next(error) })
})

//Movies details RENDER

router.get("/detalles/:movie_id", (req, res, next) => {

    const { movie_id: id } = req.params

    Movie
        .findById(id)
        .populate('user')
        .populate({ path: 'review', populate: { path: 'author' } })
        .then(movie => {
            console.log('estoy populada?', movie)
            res.render('movies/details', {
                movie,
                isADMIN: req.session.currentUser.role === 'ADMIN'
            })
        })
        .catch(error => { next(error) })
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
        .catch(error => { next(error) })
})


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
        .catch(error => { next(error) })
})

//Search movie from api

router.get("/buscar", isLoggedIn, (req, res, next) => {
    const { title } = req.query

    api
        .findAllMovies(title)
        .then((response) => {
            res.render('movies/search-movies', { movies: response.data.results })
        })
        .catch(error => { next(error) })
})

//Select movie from api

router.get("/crear-localizacion/:movieId", isLoggedIn, (req, res, next) => {
    const { movieId: id } = req.params

    api
        .getOneMovie(id)
        .then(movie => {
            res.render('movies/create', { movie: movie.data })
        })
        .catch(error => { next(error) })
})

router.post("/detalles/:movieId/valoracion", (req, res, next) => {

    const { movieId } = req.params
    const { _id: user } = req.session.currentUser

    const { comment, rating, } = req.body

    Review
        .create({ author: user, movieId, comment, rating })
        .then((review) => {
            const idReview = review._id.toString()
            // console.log('soy la review creada', review._id.toString())
            // res.redirect("/peliculas/listado")
            return Movie.findByIdAndUpdate(movieId, { $addToSet: { review: idReview } })
        })
        .then(updatedMovie => {
            console.log(updatedMovie)
            res.redirect(`/peliculas/detalles/${updatedMovie._id}`)
        })
        .catch(error => { next(error) })
})




module.exports = router