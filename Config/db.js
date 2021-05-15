require("dotenv").config();
const mongoose = require("mongoose");

const dataName = process.env.DataName;
const dataLink = process.env.DataLink + dataName;

const connectDB = async () => {
  try {
    await mongoose.connect(dataLink, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connection SUCCESS");
  } catch (error) {
    console.error("MongoDB connection FAIL");
    process.exit(1);
  }
};

module.exports = connectDB;
