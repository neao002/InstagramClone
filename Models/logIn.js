const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const logInSchema = new Schema({
  name: String,
  email: String,
  password: String,
  my_picture: String,
  gallery: [{}],
});

const UserLogIn = mongoose.model("UserLogin", logInSchema);

module.exports = UserLogIn;
