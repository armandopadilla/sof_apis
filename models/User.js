var db = require('../mysql');
var connection = db();

module.exports = {
		
	/**
	 * Authenticate a user
	 */
	auth: function(obj, cb){
		
		var query = "SELECT COUNT(*) as total FROM tblRegistration WHERE username = '"+obj.username+"' AND password = '"+obj.password+"'";
		
		connection.query(query, function(err, rows, fields){
			
			if(err) return cb(err, false);
			
			if(rows.length === 0){
				return cb(null, false);
			}
			else {
				
				if(rows[0].total === 1){
					return cb(null, true);
				}
				
				return cb(null, false);
				
			}
			
		});
		
	},
	
	
	/**
	 * Fetch a user profile by the user id.
	 */
	getById: function(userId, cb){
		
		var query = "SELECT * FROM tblRegistration WHERE RegID = "+userId;
		connection.query(query, function(err, rows, fields){
			
			if(err) return cb(err, {});
			
			if(rows.length === 0){
				return cb(err, {});
			}
			
			return cb(err, rows[0]);
			
		});
		
	},
	
	
	/**
	 * Create a new user. 
	 * At the moment we only store the username and password.
	 * 
	 */
	save: function(obj, cb){
		
		var query = "INSERT INTO tblRegistration (UserName, Password) " +
				"VALUES ('"+obj.username+"', '"+obj.password+"')";
		
		connection.query(query, function(err, rows, fields){
			
			if(err) return cb(err, null);
			
			return cb(null, rows.insertId);
			
		});
	}

}