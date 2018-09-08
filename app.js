const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/database');

mongoose.connect(config.database);
let db = mongoose.connection;

db.once('open', () => {
    console.log('Connected to MongoDB')
})

db.on('error', (err) => {
    console.log(err);
})

const app = express();

let Article = require('./models/articles');
let Athlete = require('./models/athletes');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));

app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

app.get('*', (req, res, next) => {
    res.locals.user = req.user || null;
    next();
})

app.get('/', (req, res) => {
    Article.find({}, (err, articles) => {
        Athlete.find({}, (err, athlete) => {
            if (err) {
                console.log(err);
            } else {
                res.render('index', {
                    articles_title: "Articles",
                    articles: articles,
                    athletes_title: "Athletes",
                    athletes: athlete
                });
            }
        });
    });
});

let articles = require('./routes/articles');
let athletes = require('./routes/athletes');
let users = require('./routes/users');
app.use('/articles', articles);
app.use('/athletes', athletes);
app.use('/users', users);

app.listen(3000, () => {
    console.log('Server started on port 3000 ...');
});