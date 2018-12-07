// require frameworks and apis
var	bodyParser			= require('body-parser');
var mongoose				= require('mongoose');
var passport				=	require('passport');
var LocalStrategy		= require('passport-local');
var expressSession	= require('express-session');
var flash						=	require('connect-flash');
var methodOverride	=	require('method-override');
var express					= require("express");
var app							= express();

// require models
var User						=	require('./models/User');
var Campground = require('./models/campground');
var Comment 				= require('./models/comment');

// require routes
var authRoutes 			= require('./routes/index');
var commentRoutes		= require('./routes/comments');
var campgroundRoutes= require('./routes/campgrounds');

//requiring middleware
var middleware			=	require('./middlewares')

// connection to database
// mongoose.connect("mongodb://localhost:27017/yelp_camp",{ useNewUrlParser: true });
mongoose.connect("mongodb://jalak:jalak12345@ds127954.mlab.com:27954/campgrounds", { useNewUrlParser: true });

// app config
app.use(flash());
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(expressSession({
	secret : "I love to code",
	resave : false,
	saveUninitialized : false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(function (req,res,next) {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
})
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(authRoutes);
app.use(commentRoutes);
app.use(campgroundRoutes);
app.use(methodOverride("_method"));

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                               App put and delete routes
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//campgrounds update route
app.put("/campgrounds/:id",middleware.checkCampgroundOwnership,function (req,res) {
	Campground.findByIdAndUpdate(req.params.id,req.body.campground,function (err,campground) {
		if (err) {
			console.log(err);
			res.redirect("/campgrounds");
		}else {
			req.flash("success","Campground updated successfully!");
			res.redirect('/campgrounds/'+req.params.id);
		}
	});
});

// delete campground route
app.delete("/campgrounds/:id",middleware.checkCampgroundOwnership,function (req,res) {
	Campground.findByIdAndRemove(req.params.id,function (err) {
		if (err) {
			console.log(err);
		}else {
			req.flash("success","Campground deleted successfully!");
			res.redirect("/campgrounds")
		}
	});
});



// comments update route
app.put("/campgrounds/:id/comments/:comment_id",middleware.checkCommentOwnership,function (req,res) {
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function (err,comment){
		if (err) {
			console.log(err);
			res.redirect("back");
		}else {
			req.flash("success","Comment edited successfully!");
			res.redirect("/campgrounds/"+req.params.id);
		}
	});
});

// comments destroy route
app.delete("/campgrounds/:id/comments/:comment_id",middleware.checkCommentOwnership,function (req,res) {
	Comment.findByIdAndRemove(req.params.comment_id,function (err) {
		if (err) {
			console.log(err);
			res.redirect("back");
		}else {
			req.flash("success","Comment deleted successfully!");
			res.redirect("/campgrounds/"+req.params.id);
		}
	});
});

app.listen(process.env.PORT || 9999, function () {
	console.log("server is started!");
});
