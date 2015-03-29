var express = require('express');
var router = express.Router(),
	User = require('../models/User'),
	util = require('util');

/**
 * Fetch a specific user's profile.
 */
router.get('/:id', function(req, res, next) {
	
	//Fetch params
	var userId = req.params.id

	//Validate and Sanitize
	req.checkParams('id', 'Invalid user id').notEmpty().isInt();
	req.sanitize('id').toInt();
	
	var errors = req.validationErrors(true);
	if(errors){
		res.status(404).json({"status" : "OK", "errors" : util.inspect(errors)});
		return;
	}
	
	//Fetch user data
	User.getById(userId, function(err, resp){
		
		if(err){
			return res.status(500).json({"status" : "OK", "data" : {}});
		}
		else{
			
			return res.status(200).json({"status" : "OK", "data" : resp});
		}
		
	});
  
});


/**
 * Create a new user.
 */
router.post('/', function(req, res){
	
	//Fetch data 
	var username = req.param('username'),
		password = req.param('password');
	
	//Validate and Sanitize
	req.checkBody('username', 'Invalid username').notEmpty().isAlphanumeric().isLength(4,16);
	req.checkBody('password', 'Invalid password').notEmpty().isAlphanumeric().isLength(4,8);
	
	req.sanitize('username').toString();
	req.sanitize('password').toString();
	
	var errors = req.validationErrors(true);
	if(errors){
		return res.status(404).json({"status" : "OK", "errors" : util.inspect(errors)});
	}
	
	//Create obj
	var userObj = {"username" : username, "password" : password};
	
	User.save(userObj, function(err, resp){
		
		if(err){
			return res.status(400).json({"status" : "OK", "errors": err});
		}
		else{
			
			//Good Response.
			return res.status(200).json({"status" : "OK", "data" : {"id" : resp.id}});
			
		}
		
	});
	
	
});


/**
 * Update user's data. - Not available.
 */
router.put('/', function(req, res){
	
	res.status(200).json({"status" : "OK"});
	
});


/**
 * Authenticate a user.
 */
router.post('/login', function(req, res){
	
	//Fetch params
	var username = req.body.username,
		password = req.param("password");

		console.log(username);
		console.log(password);
	//Validate & Sanitize
	req.checkBody('username', 'Invalid username').notEmpty().isAlphanumeric().isLength(4,16);
	req.checkBody('password', 'Invalid password').notEmpty().isAlphanumeric().isLength(4,8);

	req.sanitize('username').toString();
	req.sanitize('password').toString();
	
	var errors = req.validationErrors(true);
	if(errors){
		return res.status(200).json({"status" : "OK", "errors" : util.inspect(errors)});
	}
		
	//Check if user is present.
	User.auth({"username" : username, "password" : password}, function(err, resp){
		
		if(err){
			return res.status(200).json({"status" : "OK", "errors": err});
		}
		else{
			
			if(resp){
				return res.status(200).json({"status" : "OK", "data": "valid"});
			}
			else{
				return res.status(200).json({"status" : "OK", "data" : "invalid"});
			}
		}
		
	});

	
})


module.exports = router;
