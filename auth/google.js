const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const logger = require('../utils/logger');

const setupGoogleAuth = (app) => {
    const authUser = (request, accessToken, refreshToken, profile, done) => {
        return done(null, profile);
    };

    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:6969/auth/google/callback",
        passReqToCallback: true
    }, authUser));

    passport.serializeUser((user, done) => {
        logger.info(`Serialized user: ${user.displayName}`);
        done(null, user);
    });

    passport.deserializeUser((user, done) => {
        logger.info(`Deserialized user: ${user.displayName}`);
        console.log("User: ", user);
        done(null, user);
    });

    // Middleware to check if user is authenticated
    const checkAuthenticated = (req, res, next) => {
        if (req.isAuthenticated()) return next();
        res.redirect("/helloWorld");
    };

    // Setup passport and session usage
    app.use(passport.initialize());
    app.use(passport.session());

    // Google SSO Routes
    app.get('/auth/google', passport.authenticate('google', {
        scope: ['email', 'profile'],
    }));

    app.get("/helloWorld", (req, res) => {
        res.send(`<h1>Hello World!!!</h1>`);
    });

    app.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect: '/inside',
            failureRedirect: '/helloWorld',
        })
    );

    // Protected Route
    app.get('/inside', checkAuthenticated, (req, res) => {
        const userName = req.user.displayName;
        res.send(`<h1>Successfully logged in!!! ${userName}</h1>`);
    });
};

module.exports = setupGoogleAuth;