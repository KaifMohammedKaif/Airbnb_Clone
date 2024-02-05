const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const userControl = require("../controllers/user.js");

router
  .route("/signup")
  .get(userControl.signupForm)
  .post(wrapAsync(userControl.signup));

router
  .route("/login")
  .get(userControl.loginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      // failureFlash: true,
    }),
    userControl.login
  );

router.get("/logout", userControl.logout);

module.exports = router;
