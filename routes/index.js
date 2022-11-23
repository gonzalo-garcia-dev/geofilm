module.exports = app => {

    const indexRoutes = require("./index.routes");
    app.use("/", indexRoutes);

    const authRoutes = require("./auth.routes");
    app.use("/", authRoutes);

    const movieRoutes = require("./movies.routes");
    app.use("/", movieRoutes);

    const mapRoutes = require("./map.routes");
    app.use("/", mapRoutes);

    const apiRoutes = require("./api.routes");
    app.use("/api", apiRoutes);
}