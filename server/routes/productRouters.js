const express = require("express");
const productModel = require("../models/product-model");
const upload = require("../config/multer-config");
const { allProduct,addProduct, editProduct, updateProduct,deleteProduct } = require("../controllers/productController");
const router = express.Router();
const isLoggedIn = require("../middlewares/isLoggedIn");



router.get("/",function(req,res){
    res.send("it working");
})

router.post("/create", upload.single("image"), addProduct);

router.get("/all-product",isLoggedIn, allProduct);

router.get("/edit/:productid",editProduct);

router.put("/update/:productid",upload.single("image"),updateProduct);

router.delete("/delete/:productid", deleteProduct);

module.exports = router;