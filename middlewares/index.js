var Campground = require('../models/campground');
var Comment = require('../models/comment');
var User = require('../models/User');

var middleware = {};

middleware.isLoggedin = function(req,res,next) {
	if (req.isAuthenticated()) {
		next();
	}
	else {
		req.flash("error","Please login first!")
		res.redirect("/login");
	}
}

middleware.isNotLoggedin = function (req,res,next) {
	if (req.isAuthenticated()) {
		req.flash("error","You are alredy logged in!");
		res.redirect("/campgrounds");
	}
	else {
		next();
	}
}

middleware.checkCampgroundOwnership = function (req,res,next) {
	if (req.isAuthenticated()) {
		Campground.findById(req.params.id,function (err,campground) {
			if (err) {
				console.log(err);
				res.redirect("back");
			}else {
				if (campground.author.id.equals(req.user.id)) {
					console.log("Ownership verified!!");
					next();
				}
				else {
					console.log("User dont owns it!!");
					req.flash("error","You don't have permission to do that!");
					res.redirect("/campgrounds/"+req.params.id);
				}
			}
		})
	}else {
		console.log("User is not signed in!!!");
		req.flash("error","Please login first!");
		res.redirect("/login");
	}
}

middleware.checkCommentOwnership = function (req,res,next) {
	if (req.isAuthenticated()) {
		Comment.findById(req.params.comment_id,function (err,comment) {
			if (err) {
				console.log(err);
				res.redirect("/campgrounds/"+req.params.id);
			}else {
				if (comment.author.id.equals(req.user.id)) {
					console.log("Ownership verified!!");
					next();
				}
				else {
					console.log("User dont owns it!!");
					req.flash("error","You don't have permission to do that!");
					res.redirect("/campgrounds/"+req.params.id);
				}
			}
		})
	}else {
		console.log("User is not signed in!!!");
		req.flash("error","Please login first!");
		res.redirect("/login");
	}
}
module.exports = middleware;
