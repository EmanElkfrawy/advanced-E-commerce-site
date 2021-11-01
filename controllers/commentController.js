const Comment = require("../models/Comment");
const Product = require("../models/Product");

exports.createComment = async( req, res, next)=>{
    try{
        // console.log(req.baseUrl);  //to get the id of product

        const content = req.body.content;
        const userId = req.userId;
        const productId = req.baseUrl.split('/')[2];

        const product = await Product.findById(productId);
        if(!product){
            return res.status(404).json({
                message: "product not found"
            })
        }
        const comment = new Comment({
            content: content,
            userId: userId,
            productId: productId
        });
        await comment.save();
        
        product.comments.push(comment._id);
        await product.save()

        res.status(200).json({
            message: 'comment created successfully'
        })
    }catch(err){
        err.statusCode = 500;
        throw err;
        console.log(err);
    }
}

exports.updateComment = async( req, res, next)=>{
    try{
        const content = req.body.content;
        const productId = req.baseUrl.split('/')[2];
        const commentId = req.originalUrl.split('/')[4];
        const product = await Product.findById(productId);
        if(!product){
            return res.status(404).json({
                message: "product not found"
            })
        }
        const comment = await Comment.findById(commentId)
            .populate('userId');
    
        if(!comment && !product.comments.id(commentId)){
            return res.status(404).json({
                message: "comment not found"
            })
        }
        // console.log(comment.userId._id, req.userId);
        if(comment.userId._id.toString() === req.userId.toString()){
            comment.content = content;
            await comment.save();

            res.status(200).json({
                message: 'comment updated successfully',
                comment: comment
            })
        }else{
            res.status(401).json({
                message: 'you are not authorized'
            })
        }

    }catch(err){
        err.statusCode = 500;
        throw err;
        console.log(err);
    }
}

exports.getAllComments = async(req, res, next)=>{
    try{
        const productId = req.baseUrl.split('/')[2];
        const product = await Product.findById(productId);
        if(!product){
            return res.status(404).json({
                message: "product not found"
            })
        }
        const comments = await Comment.find()
            .populate("userId")
            
        if(comments.length > 0){
            return res.status(200).json({
                comments: comments
            })
        }

    }catch(err){
        err.statusCode = 500;
        throw err;
        console.log(err);
    }
}


exports.deleteComment = async(req, res, next)=>{
    try{
        const productId = req.baseUrl.split('/')[2];
        const commentId = req.originalUrl.split('/')[4];
        const product = await Product.findById(productId);
        if(!product){
            return res.status(404).json({
                message: "product not found"
            })
        }
        const comment = await Comment.findById(commentId)
            .populate('userId');
    
        if(!comment && !product.comments.id(commentId)){
            return res.status(404).json({
                message: "comment not found"
            })
        }
        if(comment.userId._id.toString() === req.userId.toString()){
             const result = await Comment.findByIdAndRemove(commentId);
             product.comments.pull(commentId);
             await product.save();

            res.status(200).json({
                message: 'comment deleted successfully',
            })
        }else{
            res.status(401).json({
                message: 'you are not authorized'
            })
        }
       


    }catch(err){
        err.statusCode = 500;
        throw err;
        console.log(err);
    }
}

