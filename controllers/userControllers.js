const User = require("../models/User");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken')

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: ' ',
        pass: ' '
    }
});

exports.signUp = async(req, res, next) =>{
    try{

        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;
        const verifypass = Math.floor(Math.random()*90000) + 10000 ; //five digit 
        console.log(verifypass);

        const checkfirst = await User.findOne({
            $or:[
                {username: username},
                {email: email}
            ]
        });

        if(checkfirst){
            if(checkfirst.email == email){
                return res.status(422).json({
                    message: "email alreasy exist"
                })
            }else {
                return res.status(422).json({
                    message: "username alreasy exist. please write another name"
                })
            }
        }

        const hashpass = await bcrypt.hash(password, 12);
        const user = new User({
            username: username,
            password: hashpass,
            email: email,
            verifypass: verifypass
        });
        const resultUser = await user.save();

        //mail
        var mailOption = {
            from: 'emanelkafrawy2018@gmail.com',
            to: user.email,
            subject: 'verify account',
            html: `sign up successfully please continue by verify your email before log in 
                    \n your verify code is: ${verifypass}
                    \n put your code here <a href='http://localhost:4000/auth/verify'>verify here</a>
            `
        }

        transporter.sendMail(mailOption, (error, info)=>{
            if(error){
                console.log(error);
            }else{
                console.log(`mail sent: ${info}` );
            }
        })

        res.status(200).json({
            message: "new user added successfully",
            user: resultUser
        })

    }catch(err){
        console.log(err)
        return res.status(500).json({
            message: 'error'
        })
    }
}

exports.verifyMail = async (req, res, next)=>{
    try{
        const user = await User.findOne({verifypass: req.body.verify});
        if(!user){
            return res.status(404).json({
                message: "code not valid",
            })
        }else if (user.verified == "true" && user){
             return res.status(401).json({
                message: "account already verified",
            })
        }else{
            user.verified = true;
            const userresult = await user.save(); 

            res.status(200).json({
                    message: "congratulation. finally you can use the account and log in",
            })
        }

    }catch(err){
        err.statusCode = 500;
        throw err;
        console.log(err);
    }
} 

exports.logIn = async (req, res, next) =>{
    try{
        const email = req.body.email;
        const password = req.body.password;
        const user = await User.findOne({email: email});

        if(!user){
            return res.status(404).json({
                message: "user not found"
            })
        }else if(!user.verifypass || user.verified == false){
            return res.status(401).json({
                message: "please verify your account first",
            })
        }
        const isEqual = await bcrypt.compare(password, user.password);
        if(!isEqual){
            const error = new Error('wrong password');
            error.status = 401;
            throw error;
        }
        const token = jwt.sign(
            {
                email: user.email,
                userId: user._id.toString(),
                role: user.role
            },
            'secretcode',
            {expiresIn: '24h'}
        )
        res.status(200).json({
            message: "you are logged in",
            userId: user._id.toString(),
            token: token
        })

    }catch(err){
        err.statusCode = 500;
        throw err;
        console.log(err);
    }
}

exports.viewProfile = async(req, res, next) =>{
    try{
        const userId = req.params.userId;
        if(userId.toString() == req.userId){
            const user = await User.findById(req.userId);
            res.status(200).json({
                message: "this is my account",
                user: user,
                edit: true
            })
        }else{
            const user = await User.findById(userId);
            res.status(404).json({
                message: "user account",
                user: user,
                edit: false
            })
        }
    }catch(err){
        err.statusCode = 500;
        throw err;
        console.log(err);
    }
}

