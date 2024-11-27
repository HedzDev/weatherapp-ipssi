const mongoose = require("mongoose");

const citySchema = mongoose.Schema({
  cityName: String,
  description: String,
  main: String,
  tempMin: Number,
  tempMax: Number,
  imageId: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
});

const City = mongoose.model("cities", citySchema);

module.exports = City;
