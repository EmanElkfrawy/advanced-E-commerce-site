const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const peopletype = new Schema({
    peopletype:{
        type: String,
       required: true
    },
    userId:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
},{
    timeStamps: true
});

module.exports = mongoose.model("PeopleType", peopletype);