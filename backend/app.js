require("dotenv").config();
require("./models/connection");

var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var weatherRouter = require("./routes/weatherRoute");
const usersRouter = require("./routes/usersRoute");

var app = express();

const cors = require("cors");
app.use(
  cors({
    origin: [
      "http://localhost:8080",
      "http://127.0.0.1:8080",
      "http://127.0.0.1:60317",
    ], // URL de votre frontend
    credentials: true,
    exposedHeaders: ["set-cookie"],
  })
);

app.use(cookieParser());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/weather", weatherRouter);
app.use("/users", usersRouter);

module.exports = app;
