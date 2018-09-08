const express = require('express');
const router = express.Router();

let Athlete = require('../models/athletes');
let User = require('../models/user');

router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('add_athlete', {
        title: 'Add Athlete'
    });
});

router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Athlete.findById(req.params.id, (err, athlete) => {
        res.render('edit_athlete', {
            title: 'Edit Athlete',
            athlete: athlete
        });
    });
});

router.post('/add', (req, res) => {
    req.checkBody('name', 'Athlete name is required').notEmpty();
    req.checkBody('trophy', 'Trophy is required').notEmpty();
    req.checkBody('description', 'Description is required').notEmpty();

    let errors = req.validationErrors();

    if (errors) {
        res.render('add_athlete', {
            title: 'Add Athlete',
            errors: errors
        });
    } else {
        let athlete = new Athlete();
        athlete.name = req.body.name;
        athlete.trophy = req.body.trophy;
        athlete.description = req.body.description;

        athlete.save((err) => {
            if (err) {
                console.log(err);
                return;
            } else {
                req.flash('success', 'Athlete Added');
                res.redirect('/');
            }
        });
    }
});

router.post('/edit/:id', (req, res) => {
    let athlete = {};
    athlete.name = req.body.name;
    athlete.trophy = req.body.trophy;
    athlete.description = req.body.description;

    let query = {
        _id: req.params.id
    }

    Athlete.update(query, athlete, (err) => {
        if (err) {
            console.log(err);
            return;
        } else {
            req.flash('success', 'Athlete Update');
            res.redirect('/');
        }
    });
});

router.delete('/:id', (req, res) => {
    if (!req.user._id) {
        res.status(500).send();
    }
    let query = {
        _id: req.params.id
    }
    Athlete.findById(req.params.id, (err, athlete) => {
        Athlete.remove(query, (err) => {
            if (err) {
                console.log(err);
            } else {
                res.send('Success');
            }
        });
    })

});

router.get('/:id', (req, res) => {
    Athlete.findById(req.params.id, (err, athlete) => {
        if(err) {
            console.log(err);
        }
        else {
            res.render('athlete', {
                athlete: athlete
            })
        }
    });
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('danger', 'Please login');
        res.redirect('/users/login');
    }
};

module.exports = router;