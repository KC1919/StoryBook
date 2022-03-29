const express = require("express");
const {
    ensureAuth
} = require('../middlewares/auth');

const router = express.Router();
const Story = require('../models/Story');

const {
    stripTags,
    trim
} = require("../helpers/ejs");

router.get("/add", ensureAuth, (req, res) => {
    res.render("stories/add");
});

router.post("/", ensureAuth, async (req, res) => {
    try {
        req.body.user = req.user.id;
        await Story.create(req.body);
        res.redirect("/dashboard");
    } catch (error) {
        if (error) {
            console.error(error);
            res.render('error/505');
        }
    }
});

router.get('/', ensureAuth, async (req, res) => {
    try {
        const stories = await Story.find({
                status: 'public'
            })
            .populate('user')
            .sort({
                createdAt: 'desc'
            })
            .lean();

        res.render('stories/index', {
            'stories': stories,
            'stripTags': stripTags,
            'trim': trim
        });
    } catch (error) {
        console.error(error);
        res.render("error/500");
    }
});

router.get('/:id', ensureAuth, async (req, res) => {
    try {
        const story = await Story.findById(req.params.id).populate('user').lean();

        if (!story) return res.render('error/404');

        return res.render('stories/show', {
            'story': story,
            'stripTags': stripTags,
        });
    } catch (error) {

    }
})


module.exports = router;