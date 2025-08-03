const express = require("express");
const router = express.Router();
const Destination = require("../models/destination");

//              Routes

// GET 
router.get("/profile", async (req, res) => {
    try {
        const userId = req.session.user._id;

        const myNotes = await Destination.find({ "notes.authorId": userId });
        const myFavoriteNotes = await Destination.find({ "notes.favoritedBy": { $in: [userId] } });

        let noteCount = 0;
        let favoriteNoteCount = 0;

        myNotes.forEach(destination => {
            destination.notes.forEach(note => {
                if (note.authorId.toString() === userId.toString()) {
                    noteCount++;
                }
            });
        });

        myFavoriteNotes.forEach(destination => {
            destination.notes.forEach(note => {
                if (note.favoritedBy.map(id => id.toString()).includes(userId.toString())) {
                    favoriteNoteCount++;
                }
            });
        });

        res.render("users/show.ejs", {
            noteCount,
            favoriteNoteCount
        });

    } catch (error) {
        console.log(error);
        res.redirect("/");
    }
});



module.exports = router;