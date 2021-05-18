const express = require("express");
const router = express.Router();
const indexControl = require("../Controllers/IndexControl");

router.get("/", indexControl.Home);

module.exports = router;
