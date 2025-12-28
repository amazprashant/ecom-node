require("dotenv").config();

const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const path = require("path");
const expressSession = require("express-session");
const flash = require("connect-flash");
const cors = require("cors");

const db = require("./config/mongoose-connection");
const ownerRouter = require("./routes/ownerRouters.js");
const usersRouter = require("./routes/usersRouters.js");
const productRouter = require("./routes/productRouters.js");
const indexRouter = require("./routes/index");

/* =======================
   🔥 CORS MUST BE FIRST
======================= */
app.use(
  cors({
    origin: "http://localhost:5173", // 👈 specific frontend origin
    credentials: true,               // 👈 allow cookies
    methods: ["GET", "POST", "PUT", "PATCH","DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// handle preflight
// app.options("*", cors());

/* =======================
   Other middleware
======================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
    expressSession({
        secret: process.env.EXPRESS_SESSION_SECRET || "dev_secret",
        resave: false,
        saveUninitialized: false,
    })
);

app.use(flash());

app.use(express.static(path.join(__dirname, "public")));
// app.set("view engine", "ejs");

/* =======================
   Routes (AFTER CORS)
======================= */
app.use("/", indexRouter);
app.use("/owners", ownerRouter);
app.use("/users", usersRouter);
app.use("/products", productRouter);

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
