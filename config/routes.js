const winston = require('winston')
const { requiresLogin, requiresAdmin } = require('./middlewares/authorization')
const admin = require('../app/admin')
const users = require('../app/users')

var Sequelize = require('sequelize');
var connection = new Sequelize('postgres://localhost:5432/seqClass');
const bcrypt = require('bcrypt');

module.exports = (app, passport, db) => {
	app.get('/api/login', users.login)
	app.post('/api/login', passport.authenticate('local'), users.login)
	app.get('/api/logout', users.logout)
	app.get('/api/ping', requiresLogin, users.ping)

	app.get('/api/register', function(req, res) {
 

		res.send(
			` 
			<h1>Registration</h1>
	
			<form action="/api/register" method="POST">
			  <input type="text" name="username" />
			  <input type="text" name="password" />
			  <input type="submit" />
			</form>
			`
		); //end of res.send
		
	});//end of app.get

	app.post('/api/register',function(req,res){

		let username = req.body.username;
		// hashing the password
		let password = bcrypt.hashSync(req.body.password,10);
	  
		let user = db.users.build({
			username: username,
			password: password,
			type: ""
		})

		user.save();
		db.users.sync();
		
		console.log(users);
		res.redirect('/api/login');
	  });

	app.get('/admin/login', admin.renderLogin)
	app.post('/admin/login', passport.authenticate('local', { failureRedirect: '/admin/login' }), admin.login)
	app.get('/admin/panel', requiresAdmin, admin.renderPanel)

	app.get('/admin/create', function(req, res){

		const bcrypt = require('bcrypt')
		const pass = '1234'
		let password = bcrypt.hashSync(pass, 10);
		//const saltRounds = 10 //the higher the better - the longer it takes to generate & compare
		//bcrypt.hashSync(pass, saltRounds)
		console.log("inside of create functions")

		let user = db.users.build({
			username: "Veronica",
			password: password,
			type: "admin"
		})

		user.save();
		db.users.sync();

		
		res.send("created");
		console.log("end of create functions")
	})

	

	app.use(function (err, req, res, next) {
		if (err.message && (~err.message.indexOf('not found'))) {
			return next()
		}

		winston.error(err.stack)

		return res.status(500).json({error: 'Error on backend occurred.'})
	})

	
}

