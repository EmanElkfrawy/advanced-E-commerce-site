const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Category = new Schema({
    categoryname:{
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

module.exports = mongoose.model("Category", Category);