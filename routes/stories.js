const express = require("express");
const {
    ensureAuth
} = require('../middlewares/auth');

const router = express.Router();
const Story = require('../models/Story');

router.get("/add", ensureAuth, (req, res) => {
    res.render("stories/add");
});

router.post("/",ensureAuth,async (req,res)=>{
    try {
        req.body.user=req.user.id;
        await Story.create(req.body);
        res.redirect("/dashboard");
    } catch (error) {
        if(error){
            console.error(error);
            res.render('error/505');
        }
    }
})


module.exports = router;