//Express
const express = require("express");
const router = express();

//routes

const index = require("./routes/index");
const userRoute = require("./routes/userRoute");

//! Setting

router.use(express.static(__dirname + "/public"));
router.set("view engine", "hbs");
router.use(express.urlencoded({ extended: false }));

router.use(
  express.urlencoded({
    extended: false,
  })
);

// multer Settings

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

//session
const session = require("express-session");

//connection mongo
const connectDb = require("./Config/db");
connectDb();
const PORT = process.env.PORT;

router.use(
  session({
    secret: "im NicoSpy",
    cookie: {
      maxAge: 100 * 60 * 10,
    },
  })
);

//modals

const UserLogin = require("./Models/logIn");

// multer adding photos

router.get("/profile", (req, res) => {
  const userId = req.session.user._id;
  UserLogin.findById(userId, (err, user) => {
    res.render("perfil", { all_pics: user.gallery });
  });
});
router.post("/profile", upload.array("pictures"), (req, res) => {
  console.log(req.files);
  const all_pics = req.files; // array of picture objects
  const userId = req.session.user._id;
  /**
   * 1. check if user has something in gallery
   * 2. add old data + new data (e.g push())
   * 3. update the gallery with new array
   */
  UserLogin.findByIdAndUpdate(
    userId,
    { $push: { gallery: all_pics } },
    (err, user) => {
      res.redirect("/profile");
    }
  );
});

// app Listen

router.use("/", index);
router.use("/", userRoute);

router.listen(PORT, () => {
  console.log("server is running on " + PORT);
});

// router.get("*", (req, res) => {
//   res.render("error");
// });
