const jwt = require("jsonwebtoken");
const userModel = require("../models/user-model");

const isLoggedIn = async function(req,res,next){
    if (!req.cookies.token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try{
        console.log("Verifying token:", req.cookies.token); // DEBUG
        let decoded = jwt.verify(req.cookies.token,process.env.JWT_KEY);
        let user = await userModel.findOne({email:decoded.email}).select("-password");
        req.user =user;
        next();
    }catch(err){
        return res.status(401).json({ message: "Unauthorized" });

    }
}

module.exports = isLoggedIn