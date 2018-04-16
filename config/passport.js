const bcrypt = require('bcrypt')
const winston = require('winston')
const LocalStrategy = require('passport-local').Strategy

module.exports = (passport, db) => {
	passport.use(new LocalStrategy((username, password, cb) => {
		
		db.users.findOne({
			where: {
			  username: username
			}
		  }).then(function(results){

			if(results !== null) {
				//const first = result.rows[0]
				bcrypt.compare(password, results.password, function(err, res) {
					if(res) {
						console.log("found user");
						console.log(results.id)
						cb(null, { id: results.id, username: results.username, type: results.type })
					} else {
						console.log("did not find user");
						cb(null, false)
					}
				})
			} else {
				console.log("did not find user");
				cb(null, false)
			}
		  
		  })//end of promise
	}))

	passport.serializeUser((user, done) => {
		console.log("serializing user: Id:")
		console.log(user.id)
		done(null, user.id)
	})

	passport.deserializeUser((id, cb) => {
		

		db.users.findById(id).then(function(results){
			if (results == null)
			{
				return cb(err)
			}
			
			console.log(results.dataValues)
			cb(null, results.dataValues)
		} )
	})
}
