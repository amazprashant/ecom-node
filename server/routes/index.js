const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middlewares/isLoggedIn");
const userModel = require("../models/user-model");

// router.get("/", function(req,res){
//     let error = req.flash("error");
//     res.render("index",{error, loggedin:false});
// });

router.get("/me", isLoggedIn, (req, res) => {
    console.log("User Info:",req.user.email); // DEBUG
  res.json({
    success: true,
    user: req.user
  });
});

router.get("/shop", isLoggedIn, async function(req,res){
    let products = await productModel.find();
    return json(products);
    // let success = req.flash("success");
    // res.render("shop",{products, success});
});

router.get("/addtocart/:productid",isLoggedIn, async function(req,res){
    let user = await userModel.findOne({email:req.user.email});
    user.cart.push(req.params.productid);
    await user.save();
    req.flash("success","Added to cart");
    res.redirect("/shop");
})
router.get("/cart",isLoggedIn, async function(req, res){
    let user = await userModel.findOne({email:req.user.email}).populate("cart");
    const bill = Number(user.cart[0].price + 20 - Number(user.cart[0].discount));
    res.router("cart",{user,bill});
});

router.get("/logout",isLoggedIn,function(req, res){
    res.router("shop");
});

module.exports = router;