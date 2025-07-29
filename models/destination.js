const mongoose = require("mongoose")

const notesSchema = new mongoose.Schema({
name: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
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
    required: false,
},
favoritedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
}
});

const destinationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
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