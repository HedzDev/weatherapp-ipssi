var express = require("express");
var router = express.Router();
const { auth, checkRole } = require("../middleware/auth");

const {
  getCitiesWeather,
  getCityWeatherByName,
  getAndSaveCity,
  deleteCityByName,
  changeCityName,
} = require("../controllers/weatherController");

router.get("/", auth, getCitiesWeather);
router.get("/:cityName", auth, getCityWeatherByName);
router.post("/", auth, getAndSaveCity);
router.patch("/:cityName", auth, changeCityName);
router.delete("/:cityName", auth, deleteCityByName);

module.exports = router;
