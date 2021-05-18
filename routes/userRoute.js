const express = require("express");
const router = express.Router();
const url = require("url");
const bcrypt = require("bcrypt");
const auth = require("../Config/auth");
const UserLogin = require("../Models/logIn");

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "public/upload");
  },

  filename: function (req, file, callback) {
    callback(null, Date.now() + "_" + file.originalname);
  },
});
const upload = multer({ storage });

// login

router.get("/profile", (req, res) => {
  const userId = req.session.user._id;
  UserLogin.findById(userId, (err, user) => {
    console.log(user);
    res.render("perfil", { all_pics: user.gallery, user });
  }).sort({ size: 1 });
});

router.get("/logout", (req, res) => {
  delete req.session.user;
  res.redirect("/");
});

// multer Settings

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
          res.redirect(
            url.format({
              pathname: "/profile",
            })
          );
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

// multer adding photos array

router.post("/profile", upload.array("pictures"), (req, res) => {
  console.log(req.files);
  const all_pics = req.files;
  all_pics.reverse();
  console.log(all_pics);
  const userId = req.session.user._id;

  UserLogin.findByIdAndUpdate(
    userId,
    { $push: { gallery: all_pics } },
    (err, user) => {
      res.redirect("/profile");
    }
  );
});

// change single picture

router.get("/profile/upload", (req, res) => {
  res.render("UploadPic");
});

router.post("/profile/upload", upload.single("profile_pic"), (req, res) => {
  console.log("data from form: ", req.file);
  if (req.file.mimetype == ("image/jpeg" || "image/png" || "image/jpg")) {
    console.log(req.session.user._id);
    const userId = req.session.user._id;
    UserLogin.findByIdAndUpdate(
      userId,
      {
        my_picture: req.file.filename,
        country: "Germany",
      },
      (err, doc) => {
        console.log(doc);
        res.redirect("/profile");
      }
    );
  } else {
    res.send("This is not a Picture! Try a Picture");
  }
});

module.exports = router;
