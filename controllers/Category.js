const Category = require("../models/Category");

exports.addCategory = async(req, res, next) =>{
    try{
        const name = req.body.name;
        const checkexist = await Category.findOne({name: name});

        if(checkexist){
            return res.status(404).json({
                message: "this category already exist"
            })
        }
        const category = new Category({
            name: name,
            userId: req.userId
        });
        const saveCategory = await category.save();

        res.status(200).json({
            message: " category added successfully",
            category: saveCategory
        })
    }catch(err){
        err.statusCode = 500;
        throw err;
        console.log(err)
    }
}
exports.editCategory = async(req, res, next) =>{
    try{
        const categoryId = req.params.categoryId;
        const name = req.body.name;

        const category = await Category.findById(categoryId);

        if(!category){
            return res.status(404).json({
                message: "category not found"
            })
        }

        category.name = name ;
        const saveCategory = await category.save();
        res.status(404).json({
            message: "updated successfully",
            category: saveCategory
        })

    }catch(err){
        err.statusCode = 500;
        throw err;
        console.log(err)
    }
}
exports.deleteCategory = async(req, res, next) =>{
    try{
        const categoryId = req.params.categoryId;

        const category = await Category.findById(categoryId);

        if(!category){
            return res.status(404).json({
                message: "category not found"
            })
        }
        const categoryDelete = await Category.findByIdAndRemove(categoryId);
        return res.status(200).json({
            message: "deleted successfully"
        })
    }catch(err){
        err.statusCode = 500;
        throw err;
        console.log(err)
    }
}