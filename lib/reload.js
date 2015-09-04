module.exports = function(schema) {
	
	schema.method('reload',function(){
		
		var projection, done = function() {};

		//check the first argument
		if(typeof(arguments[0]) == 'function') {
			done = arguments[0];
		}
		else if(typeof(arguments[0]) == 'object') {
			//the projection can be only the first parameter
			projection = arguments[0]; 

			//in this case the callback could be
			//the second parameter
			if(typeof(arguments[1]) == 'function') {
				done = arguments[1];
			}
		}

		this.constructor.findOne({_id: this._id},projection).exec(done);
	});

}