const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const morgan = require("morgan");
const partials = require('express-partials');
var expressLayouts = require('express-ejs-layouts');
const passport = require("passport");
const session = require('express-session');
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

//EJS template engine config
app.set('view engine', 'ejs')
//layout config
app.use(expressLayouts)
app.set('layout', './layouts/main')



//Data format
app.use(express.json());
app.use(express.urlencoded({
    extended: true
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
}))

//Passport middlewares
app.use(passport.initialize());
app.use(passport.session());

//Database connection
connectDB();

//Router
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));


const PORT = process.env.PORT || 5000;

//Server started
app.listen(PORT, err => {
    if (err) {
        console.error(err);
    } else {
        console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    }
})