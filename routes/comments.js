//require packages
var express = require('express');
var router = express.Router();
//require models and middlewares
var Comment = require('../models/comment');
var User		=	require('../models/User');
var Campground = require('../models/campground');
var middleware = require('../middlewares/index.js');

// show form for create new comment on perticular campground
router.get("/campgrounds/:id/comments/new",middleware.isLoggedin,function (req, res) {
	Campground.findById(req.params.id,function (err,campground) {
		if (err) {
			console.log(err);
		}else {
			res.render("comments/new",{campground:campground});
		}
	});
});

// create new comment
router.post("/campgrounds/:id/comments",middleware.isLoggedin,function (req,res) {
	var currentId = req.params.id;
	Campground.findById(currentId,function (err,campground) {
		if (err) {
			console.log(err);
		}else {
			Comment.create(req.body.comment, function (err, comment) {
				if (err) {
					console.log(err);
				}else {
					// console.log(comment);
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save(function (err) {
						if (err) {
							console.log(err);
						}else {
							campground.comments.push(comment);
							campground.save(function (err) {
								if (err) {
									console.log(err);
								}else {
									res.redirect("/campgrounds/"+currentId);
								}
							});
						}
					});
				}
			});
		}
	});
});

// show form for editing comment
router.get("/campgrounds/:id/comments/:comment_id/edit",middleware.checkCommentOwnership,function (req,res) {
	Comment.findById(req.params.comment_id,function (err,comment) {
		if (err) {
			console.log(err);
		}else {
			res.render("comments/edit.ejs",{comment:comment,campground_id : req.params.id});
		}
	});
});

module.exports = router;
