const express = require('express');
const passport = require('passport'); //only one instance of passport
const winston = require('winston');
const db = require('./db'); //only one instance of database

const port = process.env.PORT || 9000;
const app = express();

//no need to declare variable because not going to use it for anything else,
//being passed back instances of express object back to app.js
require('./config/passport')(passport, db);
require('./config/express')(app, passport, db);
require('./config/routes')(app, passport, db);

const server = app.listen(port, () => {
	if(app.get('env') === 'test') return

	winston.log('Express app started on port ' + port)
})


//when you shut down this server, close the database instance
server.on('close', () => {
	winston.log('Closed express server')

	db.pool.end(() => {
		winston.log('Shut down connection pool')
	})
})
