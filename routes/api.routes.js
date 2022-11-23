const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const isLoggedIn = require("../middleware/isLoggedIn");
const Movie = require("../models/Movie.model");

router.get("/listado", (req, res, next) => {

    Movie
        .find()
        .then(movie => res.json(movie))
        .catch(err => console.log(err))
})

module.exports = router