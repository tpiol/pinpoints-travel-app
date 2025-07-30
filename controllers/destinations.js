const express = require("express");
const router = express.Router();

const Destination = require("../models/destination");

//                          ROUTES

// GET /destinations
router.get("/", async (req, res) => {
try {
    const allDestinations = await Destination.find({}).populate("country");
    res.render("destinations/index.ejs", {
        allDestinations: allDestinations,
    })
} catch (error) {
    console.log(error);
    res.redirect("/")
}
});

// GET /destinations/:destinationId
router.get("/", async (req, res) => {
    try {
        const currentDestination = await Destination.findById(req.session.destination._id);
        const destination = currentDestination.notes.id(req.params.DestinationId);
        res.render("destinations/show.ejs", {
            notes: destination,
        });
    } catch (error) {
        console.log(error);
        res.redirect("/");
    }
});

//GET /destinations/:destinationId/notes


// GET /destinations/:destinationId/notes/new


module.exports = router;