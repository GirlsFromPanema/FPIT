const { Schema, Types, model } = require("mongoose");

const guildSchema = new Schema({
    id:
    {
        type: String,
    },
    blacklisted: { 
        type: Boolean, 
        default: false 
    },
}, { timestamps: true });

const guild = model("guild", guildSchema);

module.exports = guild;