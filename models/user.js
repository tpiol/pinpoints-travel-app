const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  visitedDestinations: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Destination"
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
