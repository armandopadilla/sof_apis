var express = require('express'),
	router  = express.Router(),
	util = require('util'),
	Asset = require('../models/Asset');



/**
 * Rate an asset (in this case an image)
 */
router.post('/submit/:id', function(req, res){
	
	//Ini vars.
	var assetId = req.param("id"),
		rating = req.param("rating");
	
	//Validate and Sanitize
	req.checkParams('id', 'Invalid id').notEmpty().isInt();
	req.checkBody('rating' , 'Invalid rating').notEmpty().isInt();
	
	req.sanitize('username').toInt();
	req.sanitize('password').toInt();
	
	var errors = req.validationErrors(true);
	if(errors){
		return res.status(404).json({"status" : "OK", "errors" : util.inspect(errors)});
	}
	
	//Save the rating.
	var obj = {"id" : assetId, "rating" : rating};
	
	Asset.rate(obj, function(err, resp){
		
		if(err){
			return res.status(400).json({"status" : "OK", "errors": err});
		}
		else{
			
			//Good Response.
			return res.status(200).json({"status" : "OK", "transaction_status" : "OK"});
		}
		
	});
	
	
});


/**
 * Fetch a list of ratings.
 * Search by distance from a given location.
 * Search by gender.
 * Search by rating. 
 * Search by time (within 1 hour of this time) This is more like a current time.
 */
router.get('/list', function(req, res){
	
	//Init 
	var lat = req.param('latitude'),
		long = req.param('longitude'),
		rating = req.param('rating') || 3,
		time = req.param('time'),
		date = req.param('date'),
		dayofweek = req.param('dayofweek') || '',
		range = req.param('range') || 5,
		gender = req.param('gender') || 'female';
	
	//Validate
	req.checkQuery('latitude', 'Invalid latitude').notEmpty();
	req.checkQuery('longitude', 'Invalid longitude').notEmpty();
	req.checkQuery('rating', 'Invalid rating').notEmpty().isInt();
	req.checkQuery('time', 'Invalid time').notEmpty();
	req.checkQuery('date', 'Invalid date').notEmpty();
	req.checkQuery('range', 'Invalid range').notEmpty().isInt();
	
	var errors = req.validationErrors(true);
	if(errors){
		return res.status(200).json({"status" : "OK", "errors" : util.inspect(errors)});
	}
	
	
	//Fetch asset with criteria.
	var searchObj = {"latitude" : lat, 
					 "longitude" : long, 
					 "rating" : rating, 
					 "time" : time, 
					 "date" : date, 
					 "dayofweek" :  dayofweek, 
					 "range" : range,
					 "gender" : gender};
	
	Asset.search(searchObj, function(err, resp){
		
		if(err){
			return res.status(200).json({"status" : "OK", "data" : []});
		}
		else{
			
			return res.status(200).json({"status" : "OK", "data" : resp});
		}
		
	});
	
	
});


module.exports = router;
