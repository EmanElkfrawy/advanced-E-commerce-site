const PeopleType = require("../models/PeopleType");

exports.addType = async(req, res, next) =>{
    try{
        const type = req.body.type;
        const checkexist = await PeopleType.findOne({type: type});

        if(checkexist){
            return res.status(404).json({
                message: "this type already exist"
            })
        }
        const newtype = new PeopleType({
            type: type,
            userId: req.userId
        });
        const savetype = await newtype.save();

        res.status(200).json({
            message: " type added successfully",
            type: savetype
        })
    }catch(err){
        err.statusCode = 500;
        throw err;
        console.log(err)
    }
}
exports.editType = async(req, res, next) =>{
    try{
        const typeId = req.params.typeId;
        const newtype = req.body.newtype;

        const type = await PeopleType.findById(typeId);

        if(!type){
            return res.status(404).json({
                message: "type not found"
            })
        }

        type.type = newtype ;
        const savetype = await type.save();
        res.status(404).json({
            message: "updated successfully",
            type: savetype
        })

    }catch(err){
        err.statusCode = 500;
        throw err;
        console.log(err)
    }
}
exports.deleteType = async(req, res, next) =>{
    try{
        const typeId = req.params.typeId;

        const type = await PeopleType.findById(typeId);

        if(!type){
            return res.status(404).json({
                message: "type not found"
            })
        }
        const typedelete = await PeopleType.findByIdAndRemove(typeId);
        return res.status(200).json({
            message: "deleted successfully"
        })
    }catch(err){
        err.statusCode = 500;
        throw err;
        console.log(err)
    }
}