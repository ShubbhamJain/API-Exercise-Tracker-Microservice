let express = require("express");
let moment = require('moment');

let newUserExercise = require('../models/userExerciseSchema');

let router = express.Router();

router.get("/favicon.ico", (req, res) => res.status(200));

router.post("/exercise/add", async (req, res) => {
    let { userId, type, duration, date } = req.body;

    date = date === "" ? moment(new Date()).format('YYYY-MM-DD') : moment(date).format('YYYY-MM-DD');

    let exercise = { userId, type, duration, date };

    try {
        let newExerciseLog = { $push: { exerciseLog: { "type": type, "duration": duration, "date": date } } };

        let newCountVal = { $inc: { count: 1 } };

        newUserExercise.updateOne({ userId }, newExerciseLog, (err, res) => {
            if (err) {
                console.error(err);
            }
        });

        newUserExercise.updateOne({ userId }, newCountVal, (err, res) => {
            if (err) {
                console.error(err);
            }
        });
    } catch (err) {
        console.error(err);
        res.status(503).json();
    }

    try {
        if (exercise) {
            res.json(exercise);
        }
        else {
            res.send("No user with such Id");
        }
    } catch (err) {
        console.error(err);
        res.status(500).json();
    }
});

router.get("/exercise/log", async (req, res) => {
    const idPassed = req.query.userId;

    const { from, to, limit } = req.query;

    user = await newUserExercise.findOne({ userId: idPassed });

    let log = user.exerciseLog;
    let newLog = []

    if (from && to) {
        const fromDate = moment(new Date(from)).format("YYYY-MM-DD");
        const toDate = moment(new Date(to)).format("YYYY-MM-DD");

        for (let i = 0; i < log.length; i++) {
            if (moment(log[i].date).isBetween(fromDate, toDate)) {
                newLog.push(log[i]);
            }
        }
    }
    if (limit) {
        newLog = newLog.slice(0, +limit);
    }

    res.json({
        userId: idPassed,
        username: user.username,
        count: newLog.length === 0 ? log.length : newLog.length,
        exerciseLog: newLog.length === 0 ? log : newLog
    });
});

module.exports = router;