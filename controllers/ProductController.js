const Product = require('../models/Product');
const Comment = require('../models/Comment');
const User = require('../models/User');

exports.addPorduct = async (req, res, next)=>{
    try{
        const {name, description, price, typeId, categoryId} = req.body;

        const product = new Product({
            name,
            description,
            price,
            typeId,
            categoryId
        });
        const saveProduct = await product.save();

        res.status(200).json({
            message: "product added successfully"
        })
    }catch(err){
         err.statusCode = 500;
        throw err;
        console.log(err)
    }
}

exports.editPorduct = async (req, res, next)=>{
    try{
        const productId = req.params.productId;
        const product = await Product.findById(productId)
            .populate("categoryId")
            .populate("typeId")
            console.log(product);
        if(!product){
            return res.status(404).json({
                message: "product not exist"
            })
        }

        const {name, description, price, typeId, categoryId} = req.body;
        
        product.name = name;
        product.description = description;
        product.price = price;
        product.typeId = typeId;
        product.categoryId = categoryId;

        const saveProduct = await product.save();

        res.status(200).json({
            message: "product updated successfully",
            product : product
        })
    }catch(err){
         err.statusCode = 500;
        throw err;
        console.log(err)
    }
}

exports.deletePorduct = async (req, res, next)=>{
    try{
        const productId = req.params.productId;
        const product = await Product.findById(productId)
            
        if(!product){
            return res.status(404).json({
                message: "product not exist"
            })
        }
        const result = await Product.findByIdAndRemove(productId);
        const comments = await Comment.find({productId: productId});
        if(!comments){
            return res.status(404).json({
                message: "comments not exist"
            })
        }
        await Comment.deleteMany({productId: productId});

       const user = await User.find()
        .populate("wishlist.items.productId");

        user.map(async element=>{
            let x = element.wishlist.items.filter(p=>{
                return p.productId._id.toString() !== productId.toString()
            })
            
            element.wishlist.items = x;
            await element.save();
        })

        res.status(200).json({
            message: "product deleted successfully",
        })

    }catch(err){
         err.statusCode = 500;
        throw err;
        console.log(err)
    }
}

exports.rateProduct = async (req, res, next)=>{
    try{
        const productId = req.params.productId;
        const product = await Product.findById(productId)
        const userId = req.userId;
        const rate = req.body.rate;  
        if(!product){
            return res.status(404).json({
                message: "product not exist"
            })
        }
        var indexx;
        let flag = product.rate.items.filter((element, index, array)=>{
            indexx = index;
            return element.ratePerson == userId.toString();
        })

        if(flag.length >0){
            product.rate.items[indexx].ratenumber = rate
        }else{
            product.rate.items.push({
                ratePerson: userId,
                ratenumber: rate
            });
        }

        //total rate
        var average = 0; 
        product.rate.items.map(e=>{
            average += e.ratenumber;
        })
        product.totalrate = average / product.rate.items.length;

        const resu = await product.save();
        res.status(200).json({
            message: "rated success",
            product: resu
        })
    }catch(err){
         err.statusCode = 500;
        throw err;
        console.log(err)
    }
}

exports.getallproduct = async(req, res, next)=>{
    try{
        const products = await Product.find()
            .populate("typeId")
            .populate("categoryId")
            .sort({ "createdAt": -1 })
        if(!products){
            return res.status(404).json({
                message: "empty"
            })
        }
        res.status(404).json({
            message: "all products",
            products: products
        })
    }catch(err){
         err.statusCode = 500;
        throw err;
        console.log(err)
    }
}

exports.getproduct = async(req, res, next)=>{
    try{
        const productId = req.params.productId;
        const product = await Product.findById(productId)
            .populate("typeId")
            .populate("categoryId")

        if(!product){
            return res.status(404).json({
                message: "product not exist"
            })
        }
        res.status(200).json({
            message: "product data",
            product: product
        })
    }catch(err){
         err.statusCode = 500;
        throw err;
        console.log(err)
    }
}

exports.relatedProduct = async(req, res, next)=>{
    try {
        const productId = req.params.productId;
        const product = await Product.findById(productId)
            .populate("typeId")
            .populate("categoryId")
            .sort({ "createdAt": -1 })
        if(!product){
            return res.status(404).json({
                message: "product not exist"
            })
        }
        let relatedproduct = await Product.find(
            {
                typeId: product.typeId,
                '_id': {$ne: productId}
            }
        )
        res.status(200).json({
            message: "related product with the same type",
            products: relatedproduct
        })

    } catch (err) {
        err.statusCode = 500;
        throw err;
        console.log(err)
    }
}

//by category and type both
exports.filterProduct = async(req, res, next)=>{
    try{
        const categoryname = req.body.categoryname;
        const peopletype = req.body.peopletype;

        const products = await Product.find()
            .populate("typeId")
            .populate("categoryId")
            .sort({ "createdAt": -1 })

        if(categoryname && peopletype){
            const result = products.filter(p=>{
                return p.categoryId.categoryname == categoryname && p.typeId.peopletype == peopletype;
            })
            res.status(200).json({
                products: result
            })

        }else if(categoryname){
            const result = products.filter(p=>{
                return p.categoryId.categoryname == categoryname;
            })
            res.status(200).json({
                products: result
            })
            
        }else{
            const result = products.filter(p=>{
                return  p.typeId.peopletype == peopletype;
            })
            res.status(200).json({
                products: result
            })
        }

    }catch(err){
        err.statusCode = 500;
        throw err;
        console.log(err)
    }
}

//search all
exports.searchh = async(req, res, next)=>{
    try{
        const search = req.query;
        const products = await Product.find({
            $or:[
                {description: {$regex: search.search, $options: "i"}},
                {name: {$regex: search.search, $options: "i"}}
            ]
        }).populate("categoryId")
        .populate("typeId")

        return res.status(200).json({
           search: products
        })
    }catch(err){

        err.statusCode = 500;
        throw err;
        console.log(err)
    }
}