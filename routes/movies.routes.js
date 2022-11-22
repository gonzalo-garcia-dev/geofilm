const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
// const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

const Movie = require("../models/Movie.model");

//Movies list RENDER
router.get("/listado", isLoggedIn, (req, res, next) => {
    console.log("user logueado", req.session.currentUser)


    Movie
        .find()
        .then(movie => {
            res.render('movies/list', { movie })
        })
        .catch(err => console.log(err))
})


//Create movie RENDER
router.get("/crear-pelicula", isLoggedIn, (req, res, next) => {

    res.render("movies/create");
});

//Create movie HANDLER
router.post("/crear-pelicula", isLoggedIn, (req, res, next) => {
    let user = req.session.currentUser._id
    // console.log(user)
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

router.get("/detalles/:pelicula_id", isLoggedIn, (req, res, next) => {


    const { pelicula_id } = req.params
    // console.log({ isPm: req.session.currentUser.role })

    Movie
        .findById(pelicula_id)
        .populate(location)
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
            const { title, director, year, image } = movie
            const latitude = movie.location.coordinates[0]
            const longitude = movie.location.coordinates[1]
            movie = {
                title,
                director,
                year,
                image,
                latitude,
                longitude
            }
            // console.log('esta bien mi peliiii?', movie)
            res.render('movies/edit', movie)
        })
        .catch(err => console.log(err))
});


//Edit movie form post

router.post("/editar-pelicula/:pelicula_id", isLoggedIn, (req, res, next) => {

    const { pelicula_id } = req.params
    const { title, director, year, image, latitude, longitude } = req.body
    const location = {
        type: 'Point',
        coordinates: [latitude, longitude]
    }

    Movie
        .findByIdAndUpdate(pelicula_id, { title, director, year, image, location })
        .then(() => res.redirect("/editar-pelicula"))
        .catch(err => console.log(err))
})









module.exports = router;