const express = require("express");
const router = express.Router();
const Destination = require("../models/destination");

//              Routes

// GET 
router.get("/profile", async (req, res) => {
    try {
        const userId = req.session.user._id;
        const myNotes = await Destination.find({ "notes.authorId": userId });
       

        let noteCount = 0;
       

        myNotes.forEach(destination => {
            destination.notes.forEach(note => {
                if (note.authorId.toString() === userId.toString()) {
                    noteCount++;
                }
            });
        });


        res.render("users/show.ejs", {
            noteCount
        });

    } catch (error) {
        console.log(error);
        res.redirect("/");
    }
});



module.exports = router;