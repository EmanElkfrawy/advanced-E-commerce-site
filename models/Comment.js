const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const commentSchema = new Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    productId:{
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    content:{
        type: String,
        required: true,
    }
},{
    timestamps: true
});
module.exports = mongoose.model('Comment', commentSchema);