const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Product = new Schema({
    name:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },

    rate: {
        items: [
            {
             ratePerson:{type:Schema.Types.ObjectId, ref:'User', required: true},
             ratenumber: {type:Number, required: true}
            }
        ] //array of documentsss
    },
    totalrate:{
        type: Number,
        default: 0
    },
    // picture:{

    // },
    typeId:{
        type: Schema.Types.ObjectId,
        ref: "PeopleType",
        required: true
    },
    categoryId:{
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    comments:[{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }]
},{
    timeStamps: true
});

module.exports = mongoose.model("Product", Product);