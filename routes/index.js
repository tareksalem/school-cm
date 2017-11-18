var express = require('express');
const async = require("async");
const crypto = require("crypto");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");
const Assistant = require("../models/controllers/assistant");
const secrets = require("../secrets/secret");
var router = express.Router();

/*router.use("/controllers", notLoggedin, function (req, res, next) {
    next();
});*/
/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect("/login");
});
router.use("/login", notLoggedin, function (req, res, next) {
    next();
});
router.get('/login', function(req, res, next) {
    res.render('login', { title: 'الدخول', titleSite: "ركن الدراسات الاجتماعية", message: req.flash("error"), success: req.flash("success")});
});
//post login
router.post('/login', passport.authenticate("local.login", {
    failureRedirect: "/",
    failureFlash: true,
    successRedirect: "/controllers/dashboard"
}));
//get reset password page
router.get('/login/reset', function(req, res, next) {
    res.render('reset', { title: 'تغيير كلمة المرور', titleSite: "ركن الدراسات الاجتماعية", error: req.flash("error"), info: req.flash("info")});
});

//for post reset password
router.post("/login/reset", function (req, res, next) {
    async.waterfall([
        function (callback) {
            crypto.randomBytes(20, function (err, buf) {
                var random = buf.toString("hex");
                callback(err, random);
            });
        },
        function (random, callback) {
            Assistant.findOne({"email": req.body.email}, function (err, user) {
                if (err) {
                    console.log(err);
                }
                if (!user) {
                    req.flash("error", "الإيميل غير موجود");
                    return res.redirect("/login/reset");
                } else {
                    user.passwordResetToken = random;
                    user.passwordResetExpires = Date.now() + 30*60*1000;
                    user.save(function (err) {
                        if (err) {
                            throw err;
                        }
                        callback(err, random, user);
                    });
                }
            });
        },
        function (random, user, callback) {
        var smtpTransport = nodemailer.createTransport({
            service: "Gmail",
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: secrets.auth.user,
                pass: secrets.auth.pass
            }
        });
        var mailOptions = {
            from: "ركن الدراسات الاجتماعية",
            to: req.body.email,
            subject: "أهلا" + req.body.email + "\n",
            text: "يتم ارسال هذه الرسالة حيث تم طلب تغيير كلمة المرور الخاصة بهذا الحساب إذا كان هذا الطلب تم من خلالكم الرجاء الضغط على الرابط التالي لإعادة كلمة المرور" + "\n\n" + "http://localhost:3000/login/resetpassword/" + random + "\n\n"
        };
        smtpTransport.sendMail(mailOptions, function (err, response) {
            req.flash("info", "تم إرسال كلمة المرور إلى الإيميل");
            return callback(err, user);
        });
        }
    ], function (err) {
        if (err) {
            return next(err);
        }
        res.redirect("/login/reset");
    });
});

//get the reset password page
router.get("/login/resetpassword/:token", function (req, res, next) {
    Assistant.findOne({"passwordResetToken": req.params.token, "passwordResetExpires": {$gt: Date.now()}}, function (err, user) {
        if (err) {
            throw err;
        }
        if (!user) {
            req.flash("error", "للأسف المدة انتهت أو الرابط غير صحيح من فضلك أعد ادخال الإيميل ثانية");
            return res.redirect("/login/reset");
        }
        var errors = req.flash("error");
        res.render("resetpassword", {title: "تعيين كلمة السر", titleSite: "ركن الدراسات الاجتماعية", errors: errors});
    });
});
//function to post the new password
router.post("/login/resetpassword/:token", function (req,  res,  next) {
    Assistant.findOne({"passwordResetToken": req.params.token, "passwordResetExpires": {$gt: Date.now()}}, function (err, user) {
        if (err) {
            throw err;
        }
        if (!user) {
            req.flash("error", "عذرا انتهت صلاحية الرابط أو هذا المسار غير صحيح")
            res.redirect("/login/reset");
        }
        if (user) {
            user.password = user.encryptPassword(req.body.password);
            user.confirmPassword = user.encryptPassword(req.body.confirmPassword);
            user.passwordResetExpires = undefined;
            user.passwordResetToken = undefined;
            user.save(function (err) {
                if (err) {
                    throw err;
                }
                req.flash("success", "تمت إعادة كلمة المرور بنجاح ويمكنك الأن تسجيل الدخول");
                res.redirect("/login");
            });
        }
    });
});
//function to make sure if is not logged in
function notLoggedin(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect("/controllers/dashboard");
}
function isLoggedin(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}
module.exports = router;
