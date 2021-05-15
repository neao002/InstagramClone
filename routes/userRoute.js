const express = require("express");
const router = express.Router();
const url = require("url");
const bcrypt = require("bcrypt");
const auth = require("../Config/auth");
const UserLogin = require("../Models/logIn");

// login
router.get("/profile", auth.permission, (req, res) => {
  const userId = req.session.user._id;
  UserLogin.findById(userId, (err, user) => {
    res.render("perfil", {
      user,
    });
  });
});

router.get("/logout", (req, res) => {
  delete req.session.user;
  res.redirect("/user/login");
});

router.get("/", auth.checklogin, (req, res) => {
  const msg = req.query;
  const messages = req.query;

  res.render("/", { msg, messages });
});

router.post("/", (req, res) => {
  UserLogin.findOne({ email: req.body.email }, (err, data) => {
    if (data == null) {
      res.render("MainLogin", {
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

// signup form

router.get("/user/signup", (req, res) => {
  const message = req.query;
  res.render("formSingup", { message });
});

router.get("/user/signup", (req, res) => {
  const messages = req.query;
  res.render("MainLogin", { messages });
});

router.post("/user/signup", (req, res) => {
  const newUserData = req.body;

  const saltRounds = 5;
  bcrypt.hash(newUserData.password, saltRounds, (err, hashedPassword) => {
    newUserData.password = hashedPassword;
  });
  UserLogin.findOne({ email: req.body.email }, (err, user) => {
    if (user === null) {
      const newUser = new UserLogin(newUserData);
      console.log("New user created:", newUser);
      newUser.save(() => {
        res.redirect(
          url.format({
            pathname: "/",
            query: {
              accountcreated: "Your account has been created, please log in",
              accountdone: true,
            },
          })
        );
      });
    } else {
      res.redirect(
        url.format({
          pathname: "/user/signup",
          query: {
            emailtaked: "This E-mail is taken, please choose another one!",
            emailisgone: true,
          },
        })
      );
    }
  });
});

module.exports = router;
