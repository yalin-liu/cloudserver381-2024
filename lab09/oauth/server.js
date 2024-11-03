var express             = require('express'),
    app                 = express(),
    session             = require('express-session'),
    passport            = require('passport'),
    OauthStrategy       = require('passport-oauth').Strategy;//a fake strategy.

app.set('view engine', 'ejs');

var user = {};  
passport.serializeUser(function (user, done) {done(null, user);});
passport.deserializeUser(function (id, done) {done(null, user);});

app.use(session({
    secret: "your-secret-key",
    resave: true,
    saveUninitialized: true }));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new OauthStrategy(...)); // define your OauthStrategy.

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
}

app.get("/", isLoggedIn, function (req, res) {
    res.send('Hello, ' + req.user.name + '!');
});

app.get("/login", function (req, res) {
    res.send("<a href='/auth/oauth'>login through oauth strategy</a>");// define the oauth login path.
});

app.get("/auth/oauth", passport.authenticate(...));// design the oauth login functions ~ authentications.
app.get("/auth/oauth/callback", passport.authenticate(...));// design the oauth return functions ~ after authentications.

app.get("/content", isLoggedIn, function (req, res) {
    res.render('frontpage', {user: req.user});
});

app.get("/logout", function(req, res) {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

app.listen(process.env.PORT || 8099);

console.log("App running at localhost:8099");
