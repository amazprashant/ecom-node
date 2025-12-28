const express = require("express");
const router = express.Router();
const productModel = require("../models/product-model.js");

const allProduct = async (req, res) => {
    console.log("Fetching all products");
  try {
    const products = await productModel.find();

    const formattedProducts = products.map(product => ({
      _id: product._id,
      name: product.name,
      price: product.price,
      discount: product.discount,
      bgcolor: product.bgcolor,
      panelcolor: product.panelcolor,
      textcolor: product.textcolor,
      image: product.image.data.toString("base64"),
      contentType: product.image.contentType,
    }));

    return res.status(200).json({
      message: "Products fetched successfully",
      products: formattedProducts,
    });
  } catch (err) {
    return res.status(409).json({
      message: err.message,
    });
  }
};


const addProduct = async function (req, res) {
    try {

        if (!req.file) {
            return res.status(400).json({
                message: "No image uploaded",
            });
        }

        const {
            name,
            price,
            discount,
            bgcolor,
            panelcolor,
            textcolor
        } = req.body;

        const savedProduct = await productModel.create({
            image: {
                data: req.file.buffer,
                contentType: req.file.mimetype,
            },
            name,
            price,
            discount,
            bgcolor,
            panelcolor,
            textcolor,
        });

        return res.status(201).json({
            message: "Product created successfully",
            data: savedProduct,
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const editProduct = async function(req,res){
    try{
        const productid = req.params.productid;
    
        const fetchProduct  = await productModel.findById(productid);

        return res.status(200).json({
            message:"Fetching Product successfully",
            data:fetchProduct
        })
    }catch(err){
        return res.status(500).json({
            message: "Internal server error",
            error: err.message,
        });
    }
}

const updateProduct = async (req, res) => {
    try {
        const { productid } = req.params;
        
        const {
            name,
            price,
            discount,
            bgcolor,
            panelcolor,
            textcolor,
        } = req.body;

        // Build update object dynamically (avoid undefined overwrite)
        const updatedData = {};

        if (name !== undefined) updatedData.name = name;
        if (price !== undefined) updatedData.price = price;
        if (discount !== undefined) updatedData.discount = discount;
        if (bgcolor !== undefined) updatedData.bgcolor = bgcolor;
        if (panelcolor !== undefined) updatedData.panelcolor = panelcolor;
        if (textcolor !== undefined) updatedData.textcolor = textcolor;

        console.log(req.file);
        if (req.file) {
            updatedData.image = {
                data: req.file.buffer,
                contentType: req.file.mimetype,
            };
        }

        const updatedProduct = await productModel.findByIdAndUpdate(
            productid,
            { $set: updatedData },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        return res.status(200).json({
            message: "Product updated successfully",
            product: updatedProduct,
        });

    } catch (err) {
        console.error("Update Product Error:", err);

        return res.status(500).json({
            message: "Internal server error",
            error: err.message,
        });
    }
};

const deleteProduct = async (req,res)=>{
    const productid = req.params.productid;

    const getProduct = await productModel.findById(productid);

    if(!getProduct){
        return res.status(404).json({
            message:"Product not found"
        })
    }else{
        const deleteProduct = await productModel.findByIdAndDelete(productid);
        return res.status(200).json({
            message:"Product deleted successfully",
            data:deleteProduct
        });
    }
}


module.exports = {allProduct,addProduct, editProduct, updateProduct, deleteProduct}