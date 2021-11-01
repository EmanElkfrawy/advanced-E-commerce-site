module.exports = (req, res, next)=>{
    try{
        if(req.role == "admin"){
            next();
        }else{
            return res.status(500).json({
                message: "you are not admin"
            })
        }
    }catch(err){
        const erroe = new Error("you can't perform this operation");
        err.statusCode = 401;
        throw err;
    }
}