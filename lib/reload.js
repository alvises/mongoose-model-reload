module.exports = function(schema) {
	
	schema.method('reload',function(done){
		//make the callback a valid function
		done = done || function(){};

		this.constructor.findOne({_id: this._id}).exec(done);
	});
}