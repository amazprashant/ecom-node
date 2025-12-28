const express = require("express");
const ownerModel = require("../models/owner-model");
const router = express.Router();


if(process.env.NODE_ENV ==='development'){
    router.get("/",function(req,res){
        res.send("it working");
    });
    router.get("/create",
        async function(req,res){
            let owners= await ownerModel.find();
            console.log(owners);
            if(owners.length >0){
                return res.status(503).send("Already have a owner");
            }
            let {fullname, email, password} = req.body;
            await ownerModel.create({
                fullname,
                email,
                password
            });
            res.status(201).send("Owner create successfully");
        });
}

router.get("/admin", function (req,res){
   let success = req.flash("success");
    res.render("createProducts",{success});
})


module.exports = router;