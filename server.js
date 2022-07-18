require('dotenv').config();

const express = require('express');
var session = require('express-session')
const passport = require('passport');
const twitchStrategy = require("passport-twitch").Strategy;

const http = require('http');
const https = require('https');
const fs = require('fs');
const Strategy = require('passport-twitch/lib/passport-twitch/oauth2');

//local
const users = require('./users.js');

//express app
const app = express();

var port = 3000;

var options = {
    key: fs.readFileSync(`${__dirname}/ssl/privatekey.pem`),
    cert: fs.readFileSync(`${__dirname}/ssl/certificate.pem`),
};

var server = http.createServer(options, app).listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

////PLACEHOLDER RN
let signedIn = false; 
//emotes
const emote404 = [
    ["https://cdn.7tv.app/emote/60ae65b29627f9aff4fd8bef/4x", "NOOOO"],
    ["https://cdn.7tv.app/emote/60abf171870d317bef23d399/4x", "modCheck"],
    ["https://cdn.7tv.app/emote/603cac391cd55c0014d989be/4x", "Sadge"],
    ["https://cdn.7tv.app/emote/60a9cfe96daf811370b0b640/4x", "donowall"],
    ["https://cdn.7tv.app/emote/60ae6a7b117ec68ca434404e/4x", "SadgeCry"],
    ["https://cdn.7tv.app/emote/60af0382b38361ea91337096/4x", "peepoRiot"],
    ["https://cdn.7tv.app/emote/60a304efac2bcb20ef20fa89/4x", "pepeMeltdown"],
    ["https://cdn.7tv.app/emote/60ae9173f39a7552b68f9730/4x", "FeelsLagMan"],
    ["https://cdn.7tv.app/emote/60aea2d9ac03cad607f5207f/4x", "peepoFine"],
    ["https://cdn.7tv.app/emote/60ae89ea4b1ea4526d928ee5/4x", "widepeepoSad"],
    ["https://cdn.7tv.app/emote/60420e5a77137b000de9e676/4x", "PepeHands"],
    ["https://cdn.7tv.app/emote/60bd742760b022372c872ef1/4x", "SCAMMED"]
];

let user = {};
let userData = { signedIn: false };

/*app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});*/

//register view engine
app.set('view engine', 'ejs');

//middleware
app.use(passport.initialize());
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        //30 days
        maxAge: 30 * 24 * 60 * 60 * 1000
    }
}));

//Passport Setups
passport.use(new twitchStrategy({
        clientID: process.env.TWITCH_CLIENT_ID,
        clientSecret: process.env.TWITCH_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/twitch/callback",
        scope: "user_read"
    },
    async function(accessToken, refreshToken, profile, done) {
        res = await users.findOrCreateUser(profile.userName, profile.displayName, profile.profileImageUrl, profile.id, accessToken, refreshToken, profile.viewCount);
        user = {
            id: res.ref.id,
            name: profile.displayName,
            img: profile.profileImageUrl
        };
        return done(null, user);
    }
));

passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});

//static files
app.use(express.static('assets'));

app.use((req, res, next)=> {
    if(req.session.passport != undefined) {
        userData.signedIn = true,
        userData.pfp = req.session.passport.user.img
    }
    next();
})

app.get('/', (req, res) => {

    res.render('index', {
        title: 'Home',
        userData: userData,
        stream: 'nan_dre'
    });
});

app.get('/emotes', (req, res) => {
    res.render('emotes', {
        title: 'emotes',
        userData: userData
    });
});

//passport urls
app.get("/auth/twitch", passport.authenticate("twitch"));
app.get("/auth/twitch/callback", passport.authenticate("twitch", { failureRedirect: "/" }), function(req, res) {
    // Successful authentication, redirect home.
    console.log(user);
    res.redirect("/");
});

//404
app.use((req, res) => {
    let r = Math.floor(Math.random() * emote404.length);

    res.status(404).render('404', {
        title: '404',
        userData: userData,
        emoteLink: emote404[r][0], emoteAlt: emote404[r][1]
    });
});