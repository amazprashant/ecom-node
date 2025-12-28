const express = require("express");
const router = express.Router();
const {registerUser, loginUser,logoutUser} = require("../controllers/usersController")

// if (process.env.NODE_ENV === 'development') {
    router.get("/", function (req, res) {
        res.send("it working");
    })

    router.post("/create", registerUser);
    router.post("/login", loginUser);
    router.post("/logout",logoutUser);
// }
module.exports = router;