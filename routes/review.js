const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, validateReview } = require("../middleware.js");
const { addReview, destroyReview } = require("../controllers/review.js");

//REVIEW ADD ROUTE
router.post("/", isLoggedIn, validateReview, wrapAsync(addReview));

//REVIEW DELETE ROUTE
router.delete("/:reviewId", wrapAsync(destroyReview));

module.exports = router;
