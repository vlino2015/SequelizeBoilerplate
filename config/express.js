const bodyParser = require('body-parser')
const expressValidator = require('express-validator')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const methodOverride = require('method-override')
const morgan = require('morgan')
const winston = require('winston')
const config = require('./')

const env = process.env.NODE_ENV || 'development'

module.exports = (app, passport) => {
	let log = 'dev'
	if (env !== 'development') {
		log = {
			stream: {
				write: message => winston.info(message)
			}
		}
	}

	if (env !== 'test') app.use(morgan(log))

	app.use(bodyParser.json())
	app.use(bodyParser.urlencoded({ extended: true }))
	app.use(expressValidator())

	app.use(methodOverride(function (req) {
		if (req.body && typeof req.body === 'object' && '_method' in req.body) {
			var method = req.body._method
			delete req.body._method
			return method
		}
	}))

	app.use(cookieParser())
	app.use(session({
		secret: config.session_secret,
		resave: false,
		saveUninitialized: false
	}))

	app.use(passport.initialize())
	app.use(passport.session())
}