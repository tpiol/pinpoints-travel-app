const express = require("express");
const router = express.Router();

const Destination = require("../models/destination");

//                          ROUTES

// GET /destinations
router.get("/", async (req, res) => {
try {
    const allDestinations = await Destination.find({}).populate("country");
    res.render("destinations/index.ejs")
} catch (error) {
    console.log(error);
    res.redirect("/")
}
});

module.exports = router;