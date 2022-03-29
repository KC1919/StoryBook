const express = require("express");
const {
    ensureAuth,
    ensureGuest
} = require('../middlewares/auth');
const router = express.Router();
const Story = require('../models/Story');
const {formatDate}=require("../helpers/ejs");

router.get("/", ensureGuest, (req, res) => {
    res.render("login", {
        layout: './layouts/login'
    });
});

router.get("/dashboard", ensureAuth, async (req, res) => {

    try {
        const stories = await Story.find({
            user: req.user.id
        }).lean();

        console.log(stories);
        res.render("dashboard", {
            "name": req.user.firstName,
            "stories":stories,
            'formatDate':formatDate
        });
    } catch (error) {
        if (error) {
            res.render("error/500");
        }
    }

})

module.exports = router;