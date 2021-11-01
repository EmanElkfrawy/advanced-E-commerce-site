const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'emanelkafrawy2018@gmail.com',
        pass: 'e01154748832'
    }
});

const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

exports.addToOrder = async(req, res, next)=>{
    try {
        const productId = req.params.productId;

        const product = await Product.findById(productId);

        if(!product){
             return res.status(404).json({
                message: "product not found"
            })
        }
        const order = await Order.findOne({userId: req.userId});

        if(!order){
            const neworder = new Order({
                userId: req.userId
            });
            neworder.products.push({
                productId: productId,
                quantity: 1
            });
            await neworder.save();
        }else{
            let c = order.products.filter(p=>{
                return p.productId.toString() == productId.toString(); 
            })
            if(c.length == 0){
                order.products.push({
                    productId: productId,
                    quantity: 1
                });
                await order.save();
            }else{
                return res.status(401).json({
                    message: "product already exist on order list"
                })        
            }
        }
        res.status(200).json({
            message: "product added to order list"
        })

    } catch (error) {
        error.statusCode = 500;
        throw error;
        next();
    }
} 
exports.selectQuantity = async(req, res, next)=>{
    try {
      const quantity = req.body.quantity;
      const productId = req.params.productId;

      const product = await Product.findById(productId);
      const order = await Order.findOne({userId: req.userId})
        .populate("products.productId")

        if(!product){
             return res.status(404).json({
                message: "product not found"
            })
        }
        if(!order){
             return res.status(404).json({
                message: "order list empty"
            })
        }
        let indexx;
        let flag = order.products.filter((p, index, array)=>{
            indexx = index;
            return p.productId._id.toString() === productId.toString();
        })
            // console.log(flag);
        if(flag.length >0){
            order.products[indexx].quantity = quantity;
            const result = await order.save();

            return res.status(200).json({
                message: "quantity updated successfully",
                order: result
            })
        }else{
            console.log('err');
        }

    } catch (error) {
        error.statusCode = 500;
        throw error;
        next();  
    }
} 
exports.removedFromOrder = async(req, res, next)=>{
    try {
        const productId = req.params.productId;

        const product = await Product.findById(productId);
        const order = await Order.findOne({userId: req.userId})

        if(!product){
             return res.status(404).json({
                message: "product not found"
            })
        }
        if(!order){
             return res.status(404).json({
                message: "order list empty"
            })
        }

        let flag = order.products.filter(p=>{
            return p.productId.toString() !== productId.toString();
        })

        order.products = flag;
        const x= await order.save();

        return res.status(404).json({
            message: "product deleted from order",
            order: x
        })        

    } catch (error) {
        error.statusCode = 500;
        throw error;
        next();  
    }
} 

exports.getallproductsOrder = async(req, res, next)=>{
    try{
        const order = await Order.findOne({userId: req.userId})
            // .populate("products.productId")
            .populate({path: "products.productId", populate:{path: "categoryId"}, populate:{path: "typeId"}})
            .sort({ "createdAt": -1 })

        let totalprice = 0;
        let price = order.products.map(product=>{
            totalprice += product.productId.price * product.quantity;
        })
        order.totalprice = totalprice;
        await order.save();

        return res.status(200).json({
            message: "all data",
            order: order
        })
    }catch (error) {
        error.statusCode = 500;
        throw error;
        next();  
    }
}


exports.sendadminorders = async(req,res,next)=>{
    try{
        const clientNumer = req.body.number;

        const order = await Order.findOne({userId: req.userId})
            .populate({path: "products.productId",model: 'Product',select: 'name description _id price totalrante quantity'})
            .sort({ "createdAt": -1 })

        const user = await User.findById(req.userId)    

        let obj={}

        obj = order.products.map( p =>{
            return{
                product_code: p.productId._id,
                name: p.productId.name,
                description: p.productId.description,
                price: p.productId.price + "$",
                quantity: p.productId.quantity
            }
        })
        user.totalorderprice += order.totalprice;
        let x = order.totalprice;

        order.products=[];
        order.totalprice = 0;

        await user.save();
        await order.save();

        res.status(200).json({
            message: "done",
            username: user.username,
            email: user.email,
            phone: clientNumer,
            totalprice: x + " $",
            orders: obj
        })

       
    }catch (error) {
        error.statusCode = 500;
        throw error;
        next();  
    }
}

exports.productbycode = async(req, res, next)=>{
    try{
        const productId = req.body.productId;
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
