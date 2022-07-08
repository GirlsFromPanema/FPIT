const { Schema, Types, model } = require("mongoose");

const userSchema = new Schema({
    userID:
    {
        type: String
    },
    tag: 
    {
        type: String
    },
    case:
    {
        type: String,
    },
}, { timestamps: true });

const User = model("reports", userSchema);

module.exports = User;