const { Schema, Types, model } = require("mongoose");

const setupSchema = new Schema({
    id:
    {
        type: String
    },
    channel: 
    {
        type: String
    },
    webhookid:
    {
        type: String,
        required: true 
    },
    webhooktoken:
    {
        type: String,
        required: true 
    },
}, { timestamps: true });

const Setup = model("setup", setupSchema);

module.exports = Setup;