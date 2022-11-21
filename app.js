require("dotenv").config();

require("./db");

const express = require("express");

const hbs = require("hbs");

const app = express();

require("./config")(app);

const capitalize = require("./utils/capitalize");
const projectName = "Geogilm";

app.locals.appTitle = `${capitalize(projectName)} created with IronLauncher`;

const indexRoutes = require("./routes/index.routes");
app.use("/", indexRoutes);

const authRoutes = require("./routes/auth.routes");
app.use("/", authRoutes);

const movieRoutes = require("./routes/movies.routes");
app.use("/", movieRoutes);

const mapRoutes = require("./routes/map.routes");
app.use("/", mapRoutes);

const apiRoutes = require("./routes/api.routes");
app.use("/api", apiRoutes);


require("./error-handling")(app);

module.exports = app;
