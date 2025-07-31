const express = require("express");
const router = express.Router();
const Destination = require("../models/destination");

//              Routes

// GET 
router.get("/profile", (req, res) => {
    try {
        res.send("Profile Page")
    } catch (error) {
        console.log(error);
        res.redirect("/");
    }
})

module.exports = router;