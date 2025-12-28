const mongoose = require("mongoose");

const ownerSchema = mongoose.Schema({
    fullname: {
        type: String,
        minLength : 3,
        trim: true, 
    },
    email: String,
    password: String,
    picture: String ,
    products:{
        type: Array,
        default:[],
    },
    gstin:String,
});

module.exports=mongoose.model("owner",ownerSchema);