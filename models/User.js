const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email:{
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "user"
    },
    username: {
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    verifypass: {
        type: String
    },
    verified:{
        type: String,
        default: false
    },
    wishlist : {
        items:[
           { productId :{type:Schema.Types.ObjectId, ref:'Product', required: true}}
        ]
    },
    totalorderprice:{
        type: Number,
        default: 0
    }
},{
    timeStamps: true 
});

module.exports = mongoose.model('User', userSchema);