const mongoose = require("mongoose")

const notesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    destinationNotes: {
        type: String,
        required: true,
    },
    city: {
        type: String,
    },
    image: {
        type: String,
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    favoritedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
});

const destinationSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    image: {
        type: String
    },
    country: {
        type: String,
        enum: ["Indonesia", "Thailand", "Portugal", "Singapore", "Norway"],
    },
    notes: [notesSchema],
});

const Destination = mongoose.model("Destination", destinationSchema);

module.exports = Destination;