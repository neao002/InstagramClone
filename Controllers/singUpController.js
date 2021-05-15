// Delete user
exports.deleteUser = (req, res) => {
  res.send("User removed...");
};

// add a picture to user
exports.addPicture = (req, res) => {
  res.send("User add a new picture...");
};

// test route
exports.testRoute = (req, res) => {
  res.send("Test /user/data/anyid/test");
};

// Get User Details by Id
exports.getUserById = (req, res) => {
  res.send("User Detail");
};
