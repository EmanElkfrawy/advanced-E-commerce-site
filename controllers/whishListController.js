const Product = require("../models/Product");
const User = require("../models/User");

exports.addtoCart = async(req, res, next)=>{
    try {
        const productId = req.params.productId;

        const product = await Product.findById(productId);
        
        if(!product){
            return res.status(404).json({
                message: "product not found"
            })
        }
        const user = await User.findById(req.userId);

        const useritemsarray = user.wishlist.items;
        let flag = useritemsarray.filter(item=>{
            return item.productId.toString() == productId.toString(); 
        })
        if(flag.length > 0){
            return res.status(401).json({
                message: "item already exist on wishlist cart"
            })
        }else{
            useritemsarray.push({
                productId: productId
            });
            let result = await user.save();
            return res.status(200).json({
                message: "product added to cart"
            })
        }

    } catch (error) {
        error.statusCode = 500;
        throw error;
        next();

    }
}
exports.deleteFromCart = async(req, res, next)=>{
    try {
        const productId = req.params.productId;
        const product = await Product.findById(productId);
        
        if(!product){
            return res.status(404).json({
                message: "product not found"
            })
        }
        const user = await User.findById(req.userId);
        const useritemsarray = user.wishlist.items;
        
        let flag = useritemsarray.filter(item=>{
            return item.productId.toString() !== productId.toString(); 
        })
        user.wishlist.items = flag;
        await user.save();
        return res.status(200).json({
            message: "item removed from cart"
        })   
        
    } catch (error) {
        error.statusCode = 500;
        throw error;
        next();
    }
}
exports.viewCartWithAllProduct = async(req, res, next)=>{
    try {
          const user = await User.findById(req.userId)
            .populate({path: "wishlist.items.productId", populate:{path: "categoryId"}, populate:{path: "typeId"}})
            .sort({ "createdAt": -1 })

        return res.status(200).json({
            message: "all data",
            cart: user.wishlist.items
        })
    } catch (error) {
        error.statusCode = 500;
        throw error;
        next();
    }
}
exports.clearCart = async(req, res, next)=>{
    try {
        const user = await User.findById(req.userId);

        user.wishlist.items = [];
        await user.save();

        res.status(200).json({
            message: "your cart is empty",
            cart: user.wishlist.items
        })
    } catch (error) {
        error.statusCode = 500;
        throw error;
        next();
    }
}