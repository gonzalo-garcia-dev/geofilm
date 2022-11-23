const express = require('express')
const router = express.Router()
const isLoggedIn = require("../middleware/isLoggedIn")
const User = require("../models/User.model")


/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index")
})

router.get("/mi-perfil/:id", isLoggedIn, (req, res, next) => {

  const { id: profile_id } = req.params

  User
    .findById(profile_id)
    .then(perfilId => {
      res.render('movies/details', {
        perfilId,
      })
    })
    .catch(err => console.log(err))
})

module.exports = router
