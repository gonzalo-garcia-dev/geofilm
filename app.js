require("dotenv").config()

require("./db")

const express = require("express")
const app = express()

require("./config")(app)

const capitalize = require("./utils/capitalize")
const projectName = "Geogilm"

app.locals.appTitle = `${capitalize(projectName)} created with IronLauncher`
app.use((req, res, next) => {
    if (req.session.currentUser) {
        app.locals.nameUser = req.session.currentUser.username
    } else {
        app.locals.nameUser = null
    }
    next()
})
require('./routes')(app)
require("./error-handling")(app)

module.exports = app