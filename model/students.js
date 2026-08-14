const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        standard: {
            type: String,
            required: true
        },

        parent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true
        },

        bus: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "bus"
        },

        route: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "route"
        },

        pickupStop: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("student", studentSchema);