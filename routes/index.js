//requiring packages
var passport = require('passport');
var express = require('express');
var router = express.Router();
//require modles and middleware
var User = require('../models/User');
var middleware = require('../middlewares/index');

// show home page
router.get('/',function (req,res) {
	res.render('landing');
});

//show register page
router.get('/register',middleware.isNotLoggedin,function (req,res) {
	res.render("register");
});

// register a user and log in to his/her account
router.post("/register",middleware.isNotLoggedin,function (req,res) {
	User.register(new User({username: req.body.username}),req.body.password,function (err,user) {
		if (err) {
			console.log(err);
			req.flash("error","User with same username is already exist");
			return res.redirect("/register");
		}
		else {
			passport.authenticate("local")(req,res,function () {
				req.flash("success","Welcome to YelpCamp, "+req.user.username);
				res.redirect("/campgrounds");
			});
			// passport.authenticate("local",{
			// 	successRedirect:"/campgrounds",
			// 	failureRedirect:"/login"
			// });
		}
	});
});

// show login page
router.get("/login",middleware.isNotLoggedin,function (req,res) {
	res.render("login");
});

// login to account
router.post("/login",passport.authenticate("local",{
	successRedirect:"/campgrounds",
	failureRedirect:"/login"
}),function (req,res) {
	req.flash("success","successfully logged in!")
});

// logout route
router.get("/logout",middleware.isLoggedin,function (req,res) {
	req.logout();
	req.flash("success","Logged you out successfully!")
	res.redirect("/campgrounds");
});

module.exports = router;
