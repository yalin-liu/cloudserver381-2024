var express             = require('express'),
    app                 = express(),
    session             = require('express-session'),
    passport            = require('passport');

app.set('view engine', 'ejs');

var user = {};  
passport.serializeUser(function (user, done) {done(null, user);});
passport.deserializeUser(function (id, done) {done(null, user);});
app.use(session({
    secret: "tHiSiSasEcRetStr",
    resave: true,
    saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
}

app.get("/", isLoggedIn, function (req, res) {
    res.send('Hello, ' + req.user.name + '!');
});

app.get("/login", function (req, res) {
    res.send("<a href='/auth/facebook'>login through facebook</a>");
});

app.get("/auth/facebook", 
	passport.authenticate("facebook", { 
		scope : "email" })
);

app.get("/auth/facebook/callback",
    	passport.authenticate("facebook", {
		    successRedirect : "/content",
		    failureRedirect : "/"})
);

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
