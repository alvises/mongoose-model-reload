var mongoose = require('mongoose');
var assert = require('chai').assert;

var mongooseReload = require('../lib/reload.js');

//defining the schema and registering the model
var Schema = mongoose.Schema;
var UserSchema = new Schema({
	email: String,
	firstName: String,
	lastName: String
});

//loading mongoose reload plugin
UserSchema.plugin(mongooseReload);

mongoose.model('User',UserSchema);


describe('reload',function(){

	before(function(done){
		//connect to the database
		mongoose.connect('mongodb://localhost/mongoose_reload_test',{},done);
	});

	after(function(done){
		//drop the database after the tests
		var dbConnection = mongoose.createConnection('mongodb://localhost/mongoose_reload_test',function(err){
			if(err) throw err;
			dbConnection.db.dropDatabase(done);
		});
	});
	
	var User = mongoose.model('User');
	var userId;
	beforeEach(function(done){
		//insert some data
		User.create({
			email: 'alvise@poeticoding.com', 
			firstName: 'Alvise',
			lastName: 'Susmel'
		},function(err,newUser){
			if(err) throw err;
			userId = newUser._id;
			done();	
		});
	});


	it('should load the user',function(done){
		User.findOne({_id: userId},function(err,user){
			assert.isNull(err);
			assert.isNotNull(user)
			done();
		});
	});

	it('should reload the new data after the update',function(done){
		//getting the user instance 
		User.findOne({_id: userId},function(err,user){
			assert.isNull(err);
			assert.equal('alvise@poeticoding.com', user.email);

			//updating using mongo update function
			User.update({_id: userId},{$set: {email: 'alvise@poetic.io'}},function(err,updateInfo){
				assert.isNull(err);
				assert.equal(1,updateInfo.nModified);

				//reloading
				user.reload(function(err,reloadedUser){
					assert.isNull(err);
					assert.equal('alvise@poetic.io',reloadedUser.email);
					assert.equal(user._id.toString(),reloadedUser._id.toString());

					done();
				});

			});
		});
	});
})