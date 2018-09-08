let mongoose = require('mongoose');

let athleteSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    trophy: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

let Athlete = module.exports = mongoose.model('Athlete', athleteSchema);