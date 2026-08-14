const jwt = require("jsonwebtoken")

const protected = async (req,res,next) => {

    const authHeader = req.headers.authorization;
    // console.log(authHeader)

    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({message:"Unauthorized"});
    }

    const token = authHeader.split(" ")[1];

    try{
        const decoded = await jwt.verify(token,process.env.jwt)
        req.user = decoded;
        
        next();
    }catch(e){
        return res.status(400).json(e)
    }
}



module.exports = {protected}