const jwt = require('jsonwebtoken');

module.exports = (req, res, next) =>{
    const authHeader = req.get('Authorization');

    if(!authHeader){
        const error = new Error("not authorized");
        error.statusCode = 401;
        throw error;
    }
    const token = authHeader.split(' ')[1];
    let decodedtoken;
    try{
        decodedtoken = jwt.verify(token, 'secretcode');        
    }catch(err){
        err.statusCode = 500;
        throw err;
    }
    if(!decodedtoken){
        const error = new Error("not authonticated");
        error.statusCode = 401;
        throw error;
    }
    req.userId = decodedtoken.userId;
    req.role = decodedtoken.role;
    next();
}