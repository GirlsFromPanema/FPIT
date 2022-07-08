const { Schema, Types, model } = require("mongoose");

const blacklistSchema = new Schema({
    userID:
    {
        type: String,
    },
    blacklisted: { 
        type: Boolean, 
        default: false 
    },
}, { timestamps: true });

const BUser = model("User", blacklistSchema);

module.exports = BUser;