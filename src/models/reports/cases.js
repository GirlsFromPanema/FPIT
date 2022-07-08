const { Schema, Types, model } = require("mongoose");

const cases = new Schema({
    pin: 
    {
        type: String
    },
   status: 
   {
       type: String
   }
}, { timestamps: true });

const Case = model("cases", cases);

module.exports = Case;