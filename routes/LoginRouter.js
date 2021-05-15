const express = require("express");
const router = express.Router();
const UserLogIn = require("../Models/login");
const auth = require("../Config/auth");
const bcrypt = require("bcrypt");

router.get("/user/profile", auth.permission, (req, res) => {
  const userId = req.session.user._id;
  User.findById(userId, (err, user) => {
    res.render("Profile", {
      user,
    });
  });
});

router.get("/", (req, res) => {
  let msg = "";
  if (req.query.msg) {
    msg = req.query.msg;
  }
  res.render("MainLogin", { msg });
});

router.post("/", (req, res) => {
  UserLogIn.findOne({ email: req.body.email }, (err, data) => {
    //null or user{}

    if (data == null) {
      res.render("login", {
        msg: "Email not found! Please try correct one or signup!",
      });
    } else {
      bcrypt.compare(req.body.password, data.password, (err, result) => {
        if (result) {
          req.session.user = data;
          res.redirect("/profile");
        } else {
          res.render("MainLogin", {
            msg: "Password doesnot match! Please try again!",
          });
        }
      });
    }
  });
});
