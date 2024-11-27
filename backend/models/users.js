const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
    enum: ["user", "admin", "moderator"], // Les rôles possibles
    default: "user", // Par défaut, un nouvel utilisateur est 'user'
  },
});

const User = mongoose.model("users", userSchema);

module.exports = User;
