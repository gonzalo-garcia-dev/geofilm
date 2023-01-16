require("dotenv").config()

require("./db")

const express = require("express")
const app = express()

require("./config")(app)

const capitalize = require("./utils/capitalize")
const projectName = "Geogilm"

app.locals.appTitle = `${capitalize(projectName)} created with IronLauncher`
app.use((req, res, next) => {
    console.log('soy el usuario???!', req.session.currentUser)

    if (req.session.currentUser) {
        app.locals.currentUserId = req.session.currentUser._id
        app.locals.username = req.session.currentUser.username
    } else {
        app.locals.currentUserId = null
        app.locals.username = null
    }
    next()
})
require('./routes')(app)
require("./error-handling")(app)

module.exports = app