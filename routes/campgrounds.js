//requiring packages
var express = require('express');
var router = express.Router();

//requiring modles and middleware
var Campground = require('../models/campground');
var middleware = require('../middlewares/index.js');


// Show all campgrounds
router.get("/campgrounds",function (req,res) {
	//get campgrounds from database
	Campground.find({},function (err,campgrounds) {
		if(err){
			console.log(err);
		}else {
			//console.log(campgrounds);
			//send data to campgrounds.ejs and render it
			res.render("campgrounds/index",{campgrounds:campgrounds});
		}
	});
});

// show form for creating new campground
router.get('/campgrounds/new',middleware.isLoggedin,function (req,res) {
	res.render('campgrounds/new');
});

// show perticular campground
router.get("/campgrounds/:id",function (req,res) {
	//find campground with id in link and send to show.ejs page
	Campground.findById(req.params.id).populate("comments").exec(function (err,campground) {
		if (err) {
			console.log(err);
		}else {
			//redirect to show Page
			res.render('campgrounds/show',{campground:campground});
		}
	})
});

// create new campground
router.post('/campgrounds',middleware.isLoggedin,function (req,res) {
	//get data and add to campground
	var campground = req.body.campground;
	Campground.create(campground, function (err,campground) {
		if (err) {
			console.log(err);
		}else {
			campground.author.id = req.user._id;
			campground.author.username = req.user.username;
			campground.save();
			//show all campgrounds
			req.flash("success","Campground added successfully!");
			res.redirect('/campgrounds');
		}
	});
});

// show edit form for perticular campground
router.get('/campgrounds/:id/edit',middleware.checkCampgroundOwnership,function (req,res) {
	Campground.findById(req.params.id,function (err,campground) {
		if (err) {
			console.log(err);
		}else {
			res.render('campgrounds/edit',{campground : campground});
		}
	});
});

module.exports = router;
