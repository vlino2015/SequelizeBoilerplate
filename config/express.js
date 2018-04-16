const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const expressEJS = require('ejs');
const expressValidator = require('express-validator');
var Sequelize = require('sequelize');

const session = require('express-session');
var SequelizeStore = require('connect-session-sequelize')(session.Store);
var connection = new Sequelize('postgres://localhost:5432/seqClass');
const cookieParser = require('cookie-parser');


const winston = require('winston');
const config = require('./'); //requires the index file

const env = process.env.NODE_ENV || 'development'

//this entire function gets passed back
module.exports = (app, passport, pool) => {
	let log = 'dev'
	if (env !== 'development') {
		log = {
			stream: {
				write: message => winston.info(message)
			}
		}
	}

	

	//pass to express object my templating engine
	
	app.set('views', path.join(config.root, 'views'))
	app.set('view engine', 'ejs')

	//body parser used for parsing information in header files
	app.use(bodyParser.json())
	app.use(bodyParser.urlencoded({ extended: true }))
	app.use(expressValidator())

	

	var myStore = new SequelizeStore({
		db: connection
	})
	//setting session information
	app.use(cookieParser())
	app.use(session({
		store: myStore,
		secret: config.session_secret,
		resave: false,
		cookie: { maxAge: 14 * 24 * 60 * 60 * 1000 }
	}))

	//inside of my express object, I have to pass my passport object and session
	app.use(passport.initialize()); 
	app.use(passport.session());

	myStore.sync();
	// continue as normal

	//public assets
	app.use('/', express.static(path.join(config.root, 'public')))
}
