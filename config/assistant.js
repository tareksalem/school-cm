const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
var Assistant = require("../models/controllers/assistant");
passport.serializeUser(function (user, done) {
    done(null, user.id);
});
passport.deserializeUser(function (id, done) {
    Assistant.findById(id, function (err, user) {
        done(err, user);
    });
});
passport.use("local.login", new LocalStrategy({
    usernameField: "username",
    passwordField: "password",
    passReqToCallback: true
}, function (req, username, password, done) {
    Assistant.findOne({"username": username}, function (err, user) {
        if (err) {
            console.log(err);
        }
        if (!user || !user.validPassword(password)) {
            req.flash("error", "خطأ في كلمة المرور أو اسم المستخدم");
            return done(null, false, {message: ""});
        }
            return done(null, user);
    });
}));