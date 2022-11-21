const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
// const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

const Movie = require("../models/Movie.model");


router.get('/mapa', isLoggedIn, (req, res, next) => {
    res.render('map/movie-location')

})






module.exports = router;