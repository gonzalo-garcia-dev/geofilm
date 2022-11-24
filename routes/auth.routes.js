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
  const { username, email, password } = req.body

  if (username === "" || email === "" || password === "") {
    res.status(400).render("auth-signup", {
      errorMessage:
        "Todos los campos son obligatorios. Por favor, introduzca su nombre de usuario y contraseña.",
    })

    return
  }

  if (password.length < 6) {
    res.status(400).render("auth/signup", {
      errorMessage: "Su contraseña debe tener al menos 6 caracteres.",
    })

    return
  }



  bcrypt
    .genSalt(saltRounds)
    .then((salt) => bcrypt.hash(password, salt))
    .then((hashedPassword) => {
      return User.create({ username, email, password: hashedPassword })
    })
    .then((user) => {
      res.redirect("/inicio-sesion")
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {

        res.status(500).render("auth-signup", { errorMessage: error.message })
      } else if (error.code === 11000) {
        res.status(500).render("auth-signup", {
          errorMessage:
            "Este email ya está registrado, por favor, introduzca un email válido",
        })
      } else {
        next(error)
      }
    })
})

// GET //inicio-sesion
router.get("/inicio-sesion", isLoggedOut, (req, res) => {
  res.render("auth/login")
})

// POST //inicio-sesion
router.post("/inicio-sesion", isLoggedOut, (req, res, next) => {
  const { username, email, password } = req.body

  if (username === "" || email === "" || password === "") {
    res.status(400).render("auth/login", {
      errorMessage:
        "Todos los campos son obligatorios. Por favor, introduzca su nombre de usuario y contraseña.",
    })

    return
  }

  if (password.length < 6) {
    return res.status(400).render("auth-login", {
      errorMessage: "Su contraseña debe tener al menos 6 caracteres.",
    })
  }

  User
    .findOne({ email })
    .then((user) => {
      if (!user) {
        res
          .status(400)
          .render("auth/login", { errorMessage: "Email incorrecto" })
        return
      }

      bcrypt
        .compare(password, user.password)
        .then((isSamePassword) => {
          if (!isSamePassword) {
            res
              .status(400)
              .render("auth/login", { errorMessage: "Contraseña incorrecta." })
            return
          }

          req.session.currentUser = user.toObject()
          delete req.session.currentUser.password

          res.redirect("/mi-perfil")
        })
        .catch((err) => next(err))
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
