const express = require('express');
var router = express.Router();
const passport = require("passport");
const sanitize = require("sanitize-html");
const Assistant = require("../../models/controllers/assistant");
const multer = require("multer");
const Calendar = require("../../models/calendar");
const Event = require("../../models/event");
const path = require("path");
const fs = require("fs");
//set the setting of multer for uploading files

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
    var storage = multer.diskStorage({
    destination: "public/images/users",
    filename: function (req, file, cb) {
        cb(null, req.user.username + "-" + Date.now() + path.extname(file.originalname));
    }
});
var upload = multer({
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
    upload(req, res, function (err) {
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
router.post("/calendar", function (req, res, next) {
    var newCalendar = new Calendar();
    newCalendar.eventname = req.body.eventname;
    newCalendar.eventdate = req.body.eventdate;
    newCalendar.save(function (err) {
        if (err) {
            throw err;
        }
        req.flash("success", "تم نشر الفاعلية بنجاح");
        res.redirect("/controllers/dashboard");
    });
});
    
//router to get hte events page
router.get("/events", function (req, res, next) {
    Event.find().sort("-eventdate").exec(function (err, event) {
        if (err) {
            console.log(err);
        }
        if (event) {
            res.render("./controllers/events", {user: req.user, success: req.flash("success"), title: "فعاليات وصور", titleSite: "ركن الدراسات الاجتماعية", user: req.user, error: req.flash("error"), titleTool: "فعاليات وصور", event: event});        
        }
    });
    
});
//router for post the new events
router.post("/addEvent", function (req, res, next) {
    var storage = multer.diskStorage({
    destination: "public/images/events",
    filename: function (req, file, cb) {
        cb(null, req.body.eventname + "-" + Date.now() + path.extname(file.originalname));
    }
    });
    var upload = multer({
        storage: storage,
        limits: {fileSize: 1000000},
        fileFilter: function (req, file, cb) {
            checkFileType(file, cb);
        }
    }).single("eventimage");
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
    upload(req, res, function (err) {
        if (req.file == undefined) {
            req.flash("error", "لم يتم ارسال أي صورة");
            return res.redirect("/controllers/events");
            console.log("none");
        }
        if (err) {
            console.log(err);
            req.flsh("error", err);
            return res.redirect("/controllers/events");
        } else {
            console.log(req.file);
            var newEvent = new Event();
            newEvent.eventname = req.body.eventname;
            newEvent.eventdate = req.body.eventdate;
            newEvent.eventimage = "images/events/" + req.file.filename;
            newEvent.save(function (err) {
                console.log(err);
                if (err) {
                    req.flash("error", "حدث خطأ ولم يتم نشر الفاعلية");
                    res.redirect("/controllers/events");
                }
                req.flash("success", "تم نشر الفعالية بنجاح");
                res.redirect("/controllers/dashboard");
            })
        }
    });
});

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/images/events");
    },
    filename: function (req, file, cb) {
        cb(null, req.body.eventname + Date.now() + ".jpg");
    }
});
var upload = multer({
    storage: storage,
    limits: {fileSize: 1000000}
    /*fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }*/
}).single("editeventimage");
//function to check file type
function checkFileType(file, cb) {
    //allowed file types
    var fileTypes = /jpeg|jpg|png|gif/;
    var extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    //check mime type of image
    var mimeType = fileTypes.test(file.mimetype);
    if (mimeType && extname) {
        return cb(null, true);
    } else {
        cb("تحميل صور فقط");
    }
};
//router for post the new events
router.post("/editevent/:id", function (req, res, next) {
    upload(req, res, function (err) {
       if (req.file == undefined) {
           Event.findOne({"_id": req.params.id}, function (err, event) {
               if (err) {
                   console.log(event);
               }
               event.eventname = req.body.eventname;
               event.eventdate = req.body.eventdate;
               event.eventimage = event.eventimage;
               event.save(function (err) {
                   if (err) {
                       console.log(err);
                   }
                   req.flash("success", "تم تعديل الفعالية بنجاح");
                   return res.redirect("/controllers/events");
               });
           });
       }
       if (err) {
           console.log(err);
           req.flash("error", err);
           return res.redirect("/controllers/events");
       } else {
           Event.findOne({"_id": req.params.id}, function (err, event) {
               if (err) {
                   console.log(event);
               }
               event.eventname = req.body.eventname;
               event.eventdate = req.body.eventdate;
               event.eventimage = "images/events/" + req.file.filename;
               event.save(function (err) {
                   if (err) {
                       console.log(err);
                   }
                   req.flash("success", "تم تعديل الفعالية بنجاح");
                   return res.redirect("/controllers/events");
               });
           });
       }
    });
});

//router for delete the event
router.post("/deleteevent/:id", function (req, res, next) {
    Event.findOne({"_id": req.params.id}, function (err, event) {
        if (err) {
            throw err;
        }
        event.remove(function (err) {
            if (err) {
                console.log(err);
            }
            req.flash("success", "تم حذف الفعالية بنجاح");
            res.redirect("/controllers/events");
        });
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
