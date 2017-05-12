var express = require('express');
var router = express.Router();
var Post = require('../models/post');
var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/');
}

module.exports = function(passport){
	/* GET login page. */
	router.get('/', function(req, res) {
    	// Display the Login page with any flash message, if any
		res.render('index', { message: req.flash('message') });
	});

	/* Handle Login POST */
	router.post('/login', passport.authenticate('login', {
		successRedirect: '/home',
		failureRedirect: '/',
		failureFlash : true  
	}));

	/* GET Registration Page */
	router.get('/signup', function(req, res){
		res.render('register',{message: req.flash('message')});
	});

	/* Handle Registration POST */
	router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/home',
		failureRedirect: '/signup',
		failureFlash : true  
	}));

	/* GET Home Page */
	router.get('/home', isAuthenticated, function(req, res){
		Post.find({}, function(err, posts) {
			if(err) console.log(err);
			res.render('home', { user: req.user, posts: posts || [] });
			
		});
	});

	/* Handle Logout */
	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	router.post('/addpost', function(req, res) {
		var newPost = new Post();
		newPost.title = req.param('title');
		newPost.body = req.param('body');
		newPost.author = {
			name: req.user.username,
			id: req.user._id
		};
		newPost.authorId = req.user._id;
		newPost.createdAt = Date.now();
		newPost.save(function(err) {
			if(err){
				console.log('Error saving post', err);
				throw err;
			}
			res.redirect('/home');
		})
	});
	
	router.post('/deletepost/:id', function(req, res) {
		console.log('ID:', req.params.id);
		Post.remove({_id: req.params.id}, function(err){
			if(err) console.log(err);
			res.redirect('/home');
		});
	});

	

	return router;
}




