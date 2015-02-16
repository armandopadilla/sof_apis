var express = require('express'),
	router = express.Router(),
	multer = require('multer'),
	Asset = require('../models/Asset'),
	util = require('util');

var multerObj = {

		dest: './uploads/',
		limits: { files: 1,
				  fileSize : 10, //10MB
				  fieldNameSize: 100
		},
		onFileUploadStart: function(file){
			
			if(file.mimetype !== 'image/png' && file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/jpg'){
				done=false;
				errorMessage = "Wrong file type";
				return false;
			}
			
		},
		onFileUploadComplete: function(file){
			done=true;
		}
		
}

/**
 * Submit asset for rating.
 */
router.post('/submit',[ multer(multerObj), function(req, res){
	
	//Init 
	var userId = req.param("id"),
		date = req.param("date"),
		time = req.param("time"),
		lat = req.param('latitude'),
		long = req.param('longitude'),
		city = decodeURIComponent(req.param('city')),
		state = req.param('state'),
		imageData = req.files.fileUpload;
	
	
	//Validate and sanitize
	req.checkBody('id', 'Invalid id').notEmpty().isNumeric;
	req.checkBody('date', 'Invalid date').notEmpty().isDate();
	req.checkBody('time', 'Invalid time').notEmpty();
	req.checkBody('latitude', 'Invalid latitude').notEmpty();
	req.checkBody('longitude', 'Invalid longitude').notEmpty();
	req.checkBody('city', 'Invalid city').notEmpty();
	req.checkBody('state', 'Invalid state').notEmpty().isAlpha();
	
	var errors = req.validationErrors(true);
	if(errors){
		return res.status(404).json({"status" : "OK", "errors" : util.inspect(errors)});
	}
	
	//Day of week and image name will be fetched internally
	var filename = imageData.name;
	
	//Save the asset
	if(done){
		
		var saveObj = {"userId" : userId, "date" : date, "time": time, "lat":lat, "long":long, "city": city, "state":state, 
				"filename": filename};
		

		Asset.save(saveObj, function(err, resp){
			
			if(err){
				return res.status(404).json({"status" : "OK", "errors" : err});
			}

			return res.status(200).json({"status" : "OK", "transaction_status" : "SUCCESS"});
			
		});
		
	}else{
		
		return res.status(500).json({"status" : "OK", "error" : errorMessage});
		
	}
	
}]);


module.exports = router;