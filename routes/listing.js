const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const listControl = require("../controllers/listing.js");
const {
  isLoggedIn,
  isOwner,
  validateListing,
  saveRedirectUrl,
} = require("../middleware.js");

router.get("/new", isLoggedIn, listControl.newForm);

router
  .route("/")
  .get(wrapAsync(listControl.index))
  .post(isLoggedIn, validateListing, wrapAsync(listControl.createNewListing));

router
  .route("/:id")
  .get(wrapAsync(listControl.showListing))
  .delete(isLoggedIn, isOwner, wrapAsync(listControl.destroyListing))
  .put(
    saveRedirectUrl,
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(listControl.updateListing)
  );

router.get(
  "/:id/edit",
  saveRedirectUrl,
  isLoggedIn,
  isOwner,
  wrapAsync(listControl.editForm)
);

module.exports = router;
