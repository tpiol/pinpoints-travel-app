const express = require("express");
const router = express.Router();

const Destination = require("../models/destination");
const { default: mongoose } = require("mongoose");

//                          ROUTES

// GET /destinations // INDEX
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

// GET /destinations/:destinationId // SHOW     
router.get("/:destinationId/notes", async (req, res) => {
    try {
        const currentDestination = await Destination.findById(req.params.destinationId)
        const userId = req.session.user._id;
        currentDestination.notes.forEach(note => {
            note.userHasFavorited = note.favoritedBy.some(favoriteUserId => favoriteUserId.equals(userId));
        });

        res.render("destinations/show.ejs", {
            destination: currentDestination,

        });
    } catch (error) {
        console.log(error);
        res.redirect("/");
    }
});


// GET /destinations/new // NEW
router.get("/new", (req, res) => {
    try {

        res.render("destinations/new.ejs")

    } catch (error) {
        console.log(error);
        res.redirect("/");
    }
});

// GET /:destinationId/notes/new // NEW 
router.get("/:destinationId/notes/new", async (req, res) => {
    const currentDestination = await Destination.findById(req.params.destinationId)
    res.render("destinations/notes/new.ejs", {
        destination: currentDestination,
    })
});

// GET /:destinationId/notes/edit // EDIT
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


// POST /destinations/ // CREATE
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

// POST //:destinationId/notes/ // CREATE 
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

// POST /destinations/:destinationId/notes/:notesId/favorited-by/:userId // CREATE
router.post("/:destinationId/notes/:noteId/favorited-by/:userId", async (req, res) => {
    try {
        const currentDestination = await Destination.findById(req.params.destinationId);
        const currentNote = currentDestination.notes.id(req.params.noteId);
        let alreadyFavorited = false;

        for (let i = 0; i < currentNote.favoritedBy.length; i++) {
            if (currentNote.favoritedBy[i].toString() === req.params.userId) {
                alreadyFavorited = true;
                break;
            }
        }
        if (!alreadyFavorited) {
            currentNote.favoritedBy.push(req.params.userId);
        };

        await currentDestination.save();
        res.redirect(`/destinations/${currentDestination._id}/notes`);

    } catch (error) {
        console.log(error);
        res.redirect("/");
    }
})

// PUT //destinationId/notes // UPDATE
router.put("/:destinationId/notes/:noteId", async (req, res) => {
    try {
        const currentDestination = await Destination.findById(req.params.destinationId);
        const note = currentDestination.notes.id(req.params.noteId);
        if (note && note.authorId == req.session.user._id) {
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

// DELETE /destinations/:destinationId/notes/:notesId // DELETE
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

// DELETE /destinations/:destinationId/notes/:notesId/favorited-by/:userId // DELETE
router.delete("/:destinationId/notes/:noteId/favorited-by/:userId", async (req, res) => {
    try {
        const currentDestination = await Destination.findById(req.params.destinationId);
        const currentNote = currentDestination.notes.id(req.params.noteId);
        console.log(currentNote)
        const index = currentNote.favoritedBy.indexOf(req.session.user._id)
        currentNote.favoritedBy.splice(index, 1);
        await currentDestination.save();
        res.redirect(`/destinations/${currentDestination._id}/notes`)
    } catch (error) {
        console.log(error);
        res.redirect("/");
    }
})

module.exports = router;