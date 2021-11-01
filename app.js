const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors")
const bodyparser = require("body-parser");

const port = 4000;
const app = express();

//routes
const userRoutes = require("./routes/userRoutes");
const typeRoutes = require("./routes/typeRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const commentRoutes = require("./routes/commentRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const orderRoutes = require("./routes/orderRoutes");

//secure 
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
app.use(cors())

//api routes
app.use('/auth', userRoutes);
app.use('/type', typeRoutes);
app.use('/category', categoryRoutes);
app.use('/product', productRoutes);
app.use('/product/:productId/comment', commentRoutes);
app.use('/product/cart', wishlistRoutes);
app.use('/order', orderRoutes);


//db connection
mongoose.connect('mongodb://127.0.0.1:27017/Commerce')
    .then(()=>{
        app.listen(port,'localhost',() =>{
            console.log(`server run successfully at port ${port}`);
        })
    }).catch(err =>{
        console.log(err);
    })

