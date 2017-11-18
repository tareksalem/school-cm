const express = require('express');
var router = express.Router();
const passport = require("passport");
const sanitize = require("sanitize-html");
const Assistant = require("../../models/controllers/assistant");
const multer = require("multer");
const Event = require("../../models/events");
const path = require("path");
//set the setting of multer for uploading files
const storage = multer.diskStorage({
    destination: "public/images/users",
    filename: function (req, file, cb) {
        cb(null, req.user.username + "-" + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({
    storage: storage,
    limits: {fileSize: 1000000},
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single("userimage");
//function to check file type
function checkFileType(file, cb) {
    //allowed file types
    let fileTypes = /jpeg|jpg|png|gif/;
    let extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    //check mime type of image
    let mimeType = fileTypes.test(file.mimetype);
    if (mimeType && extname) {
        return cb(null, true);
    } else {
        cb("تحميل صور فقط");
    }
}
/* GET users listing. */
// router for get the home page of assitant
router.use("/", isLoggedin, function (req, res, next) {
    next();
});
router.get("/dashboard", function (req, res, next) {
    res.render("./controllers/assistant", {user: req.user, success: req.flash("success"), title: "لوحة التحكم", titleSite: "ركن الدراسات الاجتماعية", user: req.user, error: req.flash("error")});
});
//function to authenicate login
router.get("/biography", function (req, res, next) {
    res.render("./controllers/biography", {title: "السيرة الذاتية", titleSite: "ركن الدراسات الاجتماعية", user: req.user, error: req.flash("error"), success: req.flash("success"), titleTool: "السيرة الذاتية"});
});
//update the image
router.post("/uploadimg", function (req, res, next) {
    upload(req, res, function (err, img) {
        if (req.file == undefined) {
            req.flash("error", "لم يتم اختيار صور");
            return res.redirect("/controllers/biography");
        }
        if (err) {
            console.log(err);
                req.flash("error", err);
                return res.redirect("/controllers/biography");
        } else {
                
                Assistant.findOne({"_id": req.user.id}, function (err, user) {
                    if (err) {
                        throw err;
                    }
                    if (user) {
                        console.log(req.file);
                        user.userimage = "images/users/" + req.file.filename;
                        user.save(function (err) {
                            if (err) {
                                throw err;
                            }

                        });
                        req.flash("success", "تم التطبيق بنجاح");
                        res.redirect("/controllers/biography");
                    }
                });
            }
            
        
    });
});

//update the biography
router.post("/updatebiography", function (req, res, next) {
    Assistant.findOne({"_id": req.user.id}, function (err, user) {
        if (err) {
            throw err;
        }
        if (user) {
            /*var textarea = sanitize(req.body.userBiography, {
                allowedTags: [],
                allowedAttributes: []
            });*/
            user.userBiography = req.body.userBiography;
            user.save(function (err) {
                if (err) {
                    throw err;
                }
                req.flash("success", "تم حفظ السيرة الذاتية بنجاح");
                res.redirect("/controllers/dashboard");
            });
        }
    });
});
//get profile page
router.get("/profile", function (req, res, next) {
     res.render("./controllers/profile", {user: req.user, success: req.flash("success"), title: "الملف الشخصي", titleSite: "ركن الدراسات الاجتماعية", user: req.user, error: req.flash("error"), titleTool: "الملف الشخصي"});
});
//function to update info of user
router.post("/updateinfouser", function (req, res, next) {
    Assistant.findOne({"_id": req.user.id}, function (err, user) {
        if (err) {
            throw err;
        }
        if (user) {
            user.username = req.body.username;
            user.email = req.body.email;
            user.password = user.encryptPassword(req.body.password);
            user.save(function (err) {
                if (err) {
                    throw err;
                }
                req.flash("success", "تم تحديث المعلومات بنجاح");
                res.redirect("/controllers/profile");
            });
        }
    });

});
//router for get the calendar page
router.get("/calendar", function (req, res, next) {
    res.render("./controllers/calendar", {user: req.user, success: req.flash("success"), title: "الأجندة", titleSite: "ركن الدراسات الاجتماعية", user: req.user, error: req.flash("error"), titleTool: "الأجندة"});
});
//router for post hte next event
router.post("/addevent", function (req, res, next) {
    var newEvent = new Event();
    newEvent.eventname = req.body.eventname;
    newEvent.eventdate = req.body.eventdate;
    newEvent.save(function (err) {
        if (err) {
            throw err;
        }
        req.flash("success", "تم نشر الحدث بنجاح");
        res.redirect("/controllers/dashboard");
    });
});
//router to logout
router.get("/logout", function (req, res, next) {
    req.logout();
    req.session.destroy();
    res.redirect("/");
});
function isLoggedin(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}
module.exports = router;
