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
		

		var query =  "SELECT * FROM tblImage WHERE MBRContains ( LineString ( Point ( "+searchObj.longitude + searchObj.range+" / ( 111.1 / COS(RADIANS("+searchObj.latitude+"))), "+searchObj.latitude + searchObj.range+" / 111.1 ), Point ( "+searchObj.longitude - searchObj.range+" / ( 111.1 / COS(RADIANS("+searchObj.latitude+"))),"+searchObj.latitude - searchObj.range+" / 111.1 )), mypoint ) AND "+whereClause;
		
		console.log(query);
		
		connection.query(query, function(err, rows, fields){
			
			if(err) return cb(err, null);
			return cb(null, rows);
			
			
		});
		
	}
		
		
}