require("dotenv").config();
const express = require("express");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const expressError = require("./utils/expressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const path = require("path");
const app = express();

const reviewRouter = require("./routes/review.js");
const listingRouter = require("./routes/listing.js");
const userRouter = require("./routes/user.js");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.engine("ejs", ejsMate);

const mongodbUrl = process.env.MONGO_URL;
// mongodbUrl = "mongodb://127.0.0.1:27017/travelWorld";

//MONGODB CONNECTION
main()
  .then(() => {
    console.log("Database Connected");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(mongodbUrl);
}

const store = MongoStore.create({
  mongoUrl: mongodbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", () => {
  console.log("Error on mongoStore", err);
});

const sessionOption = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOption));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currUser = req.user;
  next();
});

app.use("/listing", listingRouter);
app.use("/listing/:id/reviews", reviewRouter);
app.use("/", userRouter);

//OTHER ROUTE
app.all("*", (req, res, next) => {
  throw new expressError(404, "Page Not Found");
});

//ERROR HANDLING MIDDLEWARE
app.use("/", (err, req, res, next) => {
  let { status = 500, message = "somthing went wrong" } = err;
  res.status(status).render("error", { message });
});

app.listen(3000, () => {
  console.log("Server Started");
});
