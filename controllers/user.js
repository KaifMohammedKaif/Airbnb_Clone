const User = require("../models/user");

module.exports.signupForm = (req, res) => {
  res.render("users/signup");
};

module.exports.signup = async (req, res) => {
  let { username, email, password } = req.body;
  const newUser = new User({ email, username });
  const registeredUser = await User.register(newUser, password);
  req.login(registeredUser, (err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/listing");
  });
};

module.exports.loginForm = (req, res) => {
  res.render("users/login");
};

module.exports.login = async (req, res) => {
  let redirectUrl = res.locals.redirectUrl || "/listing";
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/listing");
  });
};
