require("dotenv").config();
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

//const mongoUrl = process.env.MONGO_URL;

main()
  .then(() => {
    console.log("Database Connected");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(mongoUrl);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "65c0eb5f6ed8be01780349b2",
  }));
  await Listing.insertMany(initData.data);
  console.log("Data was initiated");
};
initDB();
