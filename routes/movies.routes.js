const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
// const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

const Movie = require("../models/Movie.model");

//Movies list
router.get("/listado", isLoggedIn, (req, res, next) => {
    console.log("user logueado", req.session.currentUser)


    Movie
        .find()
        .then(movie => {
            res.render('movies/list', { movie })
        })
        .catch(err => console.log(err))
})


//Create movie render
router.get("/crear-pelicula", isLoggedIn, (req, res, next) => {

    res.render("movies/create");
});

//Create movie handler
router.post("/crear-pelicula", isLoggedIn, (req, res, next) => {
    let user = req.session.currentUser._id
    console.log(user)
    const { title, director, year, image, latitude, longitude } = req.body

    const location = {
        type: 'Point',
        coordinates: [latitude, longitude]
    }

    Movie
        .create({ title, director, year, image, location, user })
        .then(movie => {
            res.redirect(`/listado`)
        })
        .catch(err => console.log(err))
});




//Movies details

router.get("/detalles/:pelicula_id", isLoggedIn, (req, res, next) => {


    const { pelicula_id } = req.params
    // console.log({ isPm: req.session.currentUser.role })

    Movie
        .findById(pelicula_id)
        .then(movieId => {
            res.render('movies/details', {
                movieId,
                isADMIN: req.session.currentUser.role === 'ADMIN'
            })
        })
        .catch(err => console.log(err))

})









module.exports = router;