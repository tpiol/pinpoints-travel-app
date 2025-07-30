const express = require("express");
const router = express.Router();

const Destination = require("../models/destination");

//                          ROUTES

// GET /destinations
router.get("/", async (req, res) => {
    try {
        const allDestinations = await Destination.find({})
        res.render("destinations/index.ejs", {
            allDestinations: allDestinations,
        });
    } catch (error) {
        console.log(error);
        res.redirect("/")
    }
});

// GET /destinations/:destinationId
router.get("/:destinationId/notes", async (req, res) => {
    try {
        const currentDestination = await Destination.findById(req.params.destinationId).populate("country");
        console.log(currentDestination);
        res.render("destinations/show.ejs", {
            destination: currentDestination,
        });
    } catch (error) {
        console.log(error);
        res.redirect("/");
    }
});


// GET /destinations/new
router.get("/new", (req, res) => {
    try {
    
        res.render("destinations/new.ejs")
    
    } catch (error) {
        console.log(error);
        res.redirect("/");
    }
});

// GET /:destinationId/notes/new
router.get("/:destinationId/notes/new", async (req, res) => {
    res.render("destinations/notes/new.ejs")
});

// POST /destinations/
router.post("/", async (req, res) => {
try {
req.body.owner = req.session.user._id;
await Destination.create(req.body);
res.redirect("/destinations")
} catch (error) {
    console.log(error);
    res.redirect("/")
}
})



module.exports = router;