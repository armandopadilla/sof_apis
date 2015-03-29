var db = require('../mysql');
var connection = db();

module.exports = {
		
	
	/**
	 * Save the image.
	 */
	save: function(obj, cb){
		
		var query = "INSERT INTO tblImage (RegId, ImageName, Date, Time, DayOfWeek, Latitude, Longitude, ImageRate, ImageFile, ImageRequestTime, city, " +
				"state) VALUES('"+obj.userId+"', ' ', '"+obj.date+"', '"+obj.time+"', '"+obj.dayofweek+"', " +
						"'"+obj.latitude+"', '"+obj.longitude+"', '"+obj.imageRate+"', '"+obj.filename+"', " +
						"'0', '"+obj.city+"', '"+obj.state+"')";
		
		connection.query(query, function(err, rows, fields){
			
			if(err) return cb(err, null);
			
			if(rows.affectedRows > 0){
				return cb(null, true);
			}
			else{
				return cb(null, false);
			}
			
			
		});
		
	},
	
	
	/**
	 * Rate a specific image.
	 */
	rate: function(obj, cb){
		
		var rating = obj.rating,
			id = obj.id,
			column = '';
		
		if(rating === "1"){
			column = 'Rate1';
		}else if(rating === "2"){
			column = 'Rate2';
		}else if(rating === "3"){
			column = 'Rate3';
		}else if(rating === "4"){
			column = 'Rate4';
		}else if(rating === "5"){
			column = 'Rate5';
		}
		
		var query = "UPDATE tblImage SET "+column+" = "+column+" + 1 WHERE id = "+id;
		connection.query(query, function(err, rows, fields){
			
			if(err) return cb(err, null);
			
			if(rows.affectedRows > 0){
				//Update the rating average
				var query = "UPDATE tblImage SET RateAverage = ((1*Rate1)+(2*Rate2)+(3*Rate3)+(4*Rate4)+(5*Rate5))/5";
				connection.query(query);
				return cb(null, true);
			}
			else{
				return cb(null, false);
			}
			
		});
		
		
	},
	
	
	/**
	 * Search for a collection of assets.
	 */
	search: function(searchObj, cb)
	{
	
		//Build search.
		var whereClause = '';
		
		if(searchObj.range){
			whereClause +=  'range >= '+searchObj.range;
		}
		if(searchObj.rating){
			whereClause += ' AND rating >= '+searchObj.rating;
		}
		if(searchObj.gender){
			whereClause += " AND gender = '"+searchObj.gender+"'";
		}
		//if(searchObj.time){
		//	whereClause += " AND time = '"+searchObj.time+"'";
		//}
		if(searchObj.date){
			whereClause += " AND date = '"+searchObj.date+"'";
		}
		

		var query = "SELECT *, (3959 * acos(cos(radians('"+searchObj.latitude+"')) * cos(radians(latitude)) * cos( radians(longitude) - radians('"+searchObj.longitude+"')) + sin(radians('"+searchObj.latitude+"')) *  sin(radians(latitude))))  AS distance FROM tblImage HAVING distance < "+searchObj.range+" ORDER BY distance LIMIT 0 , 10;";	
	
	
		connection.query(query, function(err, rows, fields){
	
			console.log(err);		
			console.log(query);
			if(err) return cb(err, null);
			return cb(null, rows);
			
			
		});
	}
		
		
}
