const { capitalize } = require("../modules/utils");
const City = require("../models/cities");

const API_KEY = process.env.API_KEY;

exports.getAndSaveCity = async (req, res) => {
  // on utilise la méthode findOne de mongoose et une expression régulière pour trouver la ville en ignorant la casse
  const isCityExists = await City.findOne({
    cityName: { $regex: `^${req.body.cityName}$`, $options: "i" },
    userId: req.user.id,
  });

  // si la ville n'existe pas, on la crée et on l'ajoute à la base de données
  if (!isCityExists) {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${req.body.cityName}&units=metric&appid=${API_KEY}`
    );
    const data = await response.json();

    const newCity = new City({
      cityName: capitalize(req.body.cityName),
      description: data.weather[0].description,
      main: data.weather[0].main,
      tempMin: data.main.temp_min,
      tempMax: data.main.temp_max,
      imageId: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
      userId: req.user.id,
    });

    await newCity.save();
    res.json({ result: true, weather: newCity });
  } else {
    // sinon on renvoie une erreur
    res.json({ result: false, error: "City already saved" });
  }
};

exports.getCitiesWeather = async (req, res) => {
  const cities = await City.find({ userId: req.user.id });
  res.json({ weather: cities });
};

exports.getCityWeatherByName = async (req, res) => {
  const city = await City.findOne({
    cityName: { $regex: `^${req.params.cityName}$`, $options: "i" },
  });
  // on vérifie si la ville existe, si oui on renvoie les données de la ville, sinon on renvoie une erreur
  if (city) {
    res.json({ result: true, weather: city });
  } else {
    res.json({ result: false, error: "City not found" });
  }
};

exports.deleteCityByName = async (req, res) => {
  const city = await City.findOne({
    cityName: { $regex: `^${req.params.cityName}$`, $options: "i" },
  });

  if (city.userId.toString() !== req.user.id) {
    return res.json({
      result: false,
      error: "You are not allowed to delete this city",
    });
  }

  // on vérifie si la ville existe, si oui on la supprime, sinon on renvoie une erreur
  if (city) {
    await City.deleteOne({
      cityName: { $regex: `^${req.params.cityName}$`, $options: "i" },
    });
    res.json({ result: true, message: "City deleted" });
  } else {
    res.json({ result: false, error: "City not found" });
  }
};

/////// TEST DE LA Méthode PATCH ///////
exports.changeCityName = async (req, res) => {
  const city = await City.findOne({
    cityName: { $regex: `^${req.params.cityName}$`, $options: "i" },
  });

  if (city) {
    city.cityName = req.params.cityName.toUpperCase();
    res.json({ result: true, newName: city.cityName });
  } else {
    res.json({ result: false, error: "City not found" });
  }
};
