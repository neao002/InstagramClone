exports.checklogin = (req, res, next) => {
  if (!req.session.user) return next(); // login page
  // already a logged in user is there
  res.redirect("/profile"); // if already user login
};

exports.permission = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  res.redirect("/");
};
