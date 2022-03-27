const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
const partials = require('express-partials');
var expressLayouts = require('express-ejs-layouts');
const passport = require("passport");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const connectDB = require("./config/db");
//Express instance
const app = express();

//Config Path
dotenv.config({
    path: './config/config.env'
});

//Passport config
require('./config/passport')(passport);

app.use(express.static("public"));

// app.use(partials());
// app.set('partials','./views/partials');

//EJS template engine config
app.set('view engine', 'ejs')
//layout config
app.use(expressLayouts)
app.set('layout', './layouts/main')



//Data format
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

//Logging
if (process.env.NODE_ENV === "development") {
    app.use(morgan('dev'));
}

//Sessions
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl:process.env.MONGO_URI
    })
}))

//Passport middlewares
app.use(passport.initialize());
app.use(passport.session());

//Database connection
connectDB();

//Router
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/stories", require("./routes/stories"));


const PORT = process.env.PORT || 5000;

//Server started
app.listen(PORT, err => {
    if (err) {
        console.error(err);
    } else {
        console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    }
})