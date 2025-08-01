const express = require("express");
const router = express.Router();
const Destination = require("../models/destination");

//              Routes

// GET 
router.get("/profile", async (req, res) => {
    try {
        const myNotes = await Destination.find({ "notes.authorId": req.session.user._id }).populate("notes.authorId")
        const myFavoriteNotes = await Destination.find({ "notes.favoritedBy": req.session.user._id }).populate("notes.authorId")
        let noteCount = 0;
        let allMyNotes = [];
        myNotes.forEach(destination => {
            destination.notes.forEach(note => {
                if (note.authorId.toString() === req.session.user._id.toString()) {
                    noteCount++
                    allMyNotes.push(note)
                }
            });
        });

        res.render("users/show.ejs", {
            myNotes,
            myFavoriteNotes,
            noteCount,
            allMyNotes,
        });
    } catch (error) {
        console.log(error);
        res.redirect("/");
    };
});

module.exports = router;