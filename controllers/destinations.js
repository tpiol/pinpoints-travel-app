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
        const currentDestination = await Destination.findById(req.params.destinationId).populate({
            path: "notes.name",
            model: "User",
        }).exec();
        // const notes = currentDestination.notes.populate({path: "name"})
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
    const currentDestination = await Destination.findById(req.params.destinationId)
    res.render("destinations/notes/new.ejs", {
        destination: currentDestination,
    })
});

// GET /:destinationId/notes/edit
router.get("/:destinationId/notes/:noteId/edit", async (req, res) => {
    try {
        const currentDestination = await Destination.findById(req.params.destinationId)
        const note = currentDestination.notes.id(req.params.noteId);
        res.render("destinations/notes/edit.ejs", {
            note: note,
          destination: currentDestination,
        });
    } catch (error) {
        console.log(error);
        res.redirect("/");
    }
});


// POST /destinations/
router.post("/", async (req, res) => {
    try {
        req.body.owner = req.session.user._id;
        await Destination.create(req.body);
        res.redirect("destinations")
    } catch (error) {
        console.log(error);
        res.redirect("/")
    }
});

// POST //:destinationId/notes/
router.post("/:destinationId/notes", async (req, res) => {
    try {
        const currentDestination = await Destination.findById(req.params.destinationId);
        currentDestination.notes.push(req.body);
        await currentDestination.save();
        res.redirect(`/destinations/${currentDestination._id}/notes`);
    } catch (error) {
        console.log(error);
        res.redirect("/")
    }
});

// PUT //destinationId/notes
router.put("/:destinationId/notes/:noteId", async (req, res) => {
     try {
    const currentDestination = await Destination.findById(req.params.destinationId);
    const note = currentDestination.notes.id(req.params.noteId);
    if (note && note.name.equals(req.session.user._id)) {
        note.city = req.body.city;
        note.image = req.body.image;
        note.destinationNotes = req.body.destinationNotes;        
        await currentDestination.save();
        res.redirect(`/destinations/${currentDestination._id}/notes`)
    } else {
        res.send("You don't have permission to edit this note.")
    }
     } catch (error) {
       console.log(error);
       res.redirect("/")
     }
});

// DELETE /destinations/:destinationId/notes/:notesId
router.delete("/:destinationId/notes/:noteId", async (req, res) => {
    try {
    const currentDestination = await Destination.findById(req.params.destinationId);
        currentDestination.notes.id(req.params.noteId).deleteOne();
        await currentDestination.save();
        res.redirect(`/destinations/${currentDestination._id}/notes`)
    } catch (error) {
        console.log(error);
        res.redirect("/")
    }
});

module.exports = router;