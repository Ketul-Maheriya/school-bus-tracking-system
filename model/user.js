const mongoose = require('mongoose');

const user = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: Number,
        unique: true,
        sparse: true

    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["admin", "driver", "parents"],
        default: "parents"
    },
    licenseNumber: {
        type: String
    },
    assignedBus: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "bus"
    },
    isActive: {
        type: Boolean,
        default: true
    }

}, { timestamps: true })

module.exports = mongoose.model("user", user);