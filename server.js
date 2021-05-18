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
      maxAge: 900 * 60 * 10,
    },
  })
);

// app Listen

router.use("/", index);
router.use("/", userRoute);

router.get("*", (req, res) => {
  res.render("error");
});

router.listen(PORT, () => {
  console.log("server is running on " + PORT);
});
