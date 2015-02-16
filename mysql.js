var mysql = require('mysql');
var db = null;

module.exports = function(){
	
	
	if(!db){
		db = mysql.createConnection({
			
			host: 'localhost',
			user: 'root',
			password: '',
			database: 'stevenc_sof'
			
		});
	}
	
	return db;
	
}