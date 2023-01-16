const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")
const mongoose = require("mongoose")
const saltRounds = 10
const User = require("../models/User.model")
const isLoggedOut = require("../middleware/isLoggedOut")
const isLoggedIn = require("../middleware/isLoggedIn")
const Movie = require('../models/Movie.model')


//Registrar Usuaria
router.get("/registro", isLoggedOut, (req, res) => {
  res.render("auth/signup")
})

router.post("/registro", isLoggedOut, (req, res) => {
  const { username, email, simplepassword } = req.body




  bcrypt
    .genSalt(saltRounds)
    .then(salt => {
      return bcrypt.hash(simplepassword, salt)
    })
    .then(hashedPassword => {
      return User.create({ username, email, password: hashedPassword })
    })
    .then(() => res.redirect('/inicio-sesion'))
    .catch(err => console.log('LOS CATCH ESTAN PARA ALGO, YA HABLAREMOS', err))


})

// GET //inicio-sesion
router.get("/inicio-sesion", isLoggedOut, (req, res) => {
  res.render("auth/login")
})

// POST //inicio-sesion
router.post("/inicio-sesion", isLoggedOut, (req, res, next) => {
  const { email, password } = req.body

  User
    .findOne({ email })
    .then((user) => {
      if (!user) {
        res.render("auth/login", { errorMessage: "Email incorrecto" })
        return
      }

      if (bcrypt.compareSync(password, user.password) === false) {
        res.render('auth/login', { errorMessage: 'Contraseña incorrecta' })
        return
      }
      req.session.currentUser = user      // login
      res.redirect('/mi-perfil')
    })
    .catch((err) => next(err))
})

// GET //logout
router.get("/logout", isLoggedIn, (req, res) => {

  req.session.destroy((err) => {
    if (err) {
      res.status(500).render("auth/logout", { errorMessage: err.message })
      return
    }

    res.redirect("/")
  })
})

router.get("/mi-perfil", isLoggedIn, (req, res, next) => {

  const currentUser = req.session.currentUser.username
  const currentUserId = req.session.currentUser._id
  let findUser
  User
    .findOne({ username: currentUser })
    .then(user => {
      findUser = user
      console.log('soy el usuario encontrado!', user)
      return Movie.find({ user: currentUserId })
    })
    .then((movies) => {
      res.render("user/profile", { findUser, movies })
    })
    .catch(error => { next(error) })
})



module.exports = router
