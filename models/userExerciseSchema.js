const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userExerciseSchema = new Schema({
    username: {
        type: String
    },
    userId: {
        type: String,
        unique: true,
        required: true
    },
    count: {
        type: Number
    },
    exerciseLog: {
        type: Array
    }
});

const userExercise = mongoose.model('userExercise', userExerciseSchema);

module.exports = userExercise;