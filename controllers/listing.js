const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find();
  res.render("listings/index", { allListings });
};

module.exports.newForm = (req, res) => {
  res.render("listings/new");
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  return res.redirect("/listing/" + id + "/");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  res.render("listings/show", { listing });
};

module.exports.createNewListing = async (req, res) => {
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  await newListing.save();
  res.redirect("/listing");
};

module.exports.editForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  return res.render("listings/edit", { listing });
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listing");
};
