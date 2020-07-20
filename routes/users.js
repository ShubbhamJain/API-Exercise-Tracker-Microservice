let express = require("express");
let shortid = require('shortid');

let newUserExercise = require('../models/userExerciseSchema');

let router = express.Router();

router.get("/favicon.ico", (req, res) => res.status(200));

router.post("/new-user", async (req, res) => {
    let username = req.body.username;

    let sameUserName = await newUserExercise.findOne({ username: username });

    try {
        if (!sameUserName) {
            const newUser = new newUserExercise({
                username,
                userId: shortid.generate()
            });

            await newUser.save((err) => {
                console.error(err);
                res.status(500).json()
            });

            res.json({
                username: newUser.username,
                userId: newUser.userId
            });
        }
        else {
            res.send("username already taken")
        }
    } catch (err) {
        console.error(err);
        res.status(502).json();
    }
});

router.get("/users", async (req, res) => {
    let allUsers = await newUserExercise.find({});

    res.json(allUsers);
});

module.exports = router;