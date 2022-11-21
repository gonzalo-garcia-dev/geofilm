const mongoose = require("mongoose");


const MONGO_URI =
  process.env.MONGODB_URI || "mongodb+srv://TeresaChMz:geofilm2022@cluster0.0od1gxw.mongodb.net/geofilm";

mongoose
  .connect(MONGO_URI)
  .then((x) => {
    const databaseName = x.connections[0].name;
    console.log(`Connected to Mongo! Database name: "${databaseName}"`);
  })
  .catch((err) => {
    console.error("Error connecting to mongo: ", err);
  });
