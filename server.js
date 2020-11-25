var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var path = require('path');
var crypto = require('crypto')


var app = module.exports = express();
var key = `3082N-t2983-[mIKi-rU42h-3roqe-idkxf-[239s&`

app.use(session({
	secret: 'secret', 
	resave: true,
    saveUninitialized: true,
    cookie: {secure: true, sameSite: true}
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(cookieParser())
app.use(express.static('public'))

var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'nodelogin'
});

app.get('/api', (req, res) => res.send("CALL"));

app.post('/api/search/flight', (req, res) => {
	let srcaptName = req.body.srcaptName;
	let dstaptName = req.body.dstaptName;
	let date = req.body.date;
	connection.query(
		`SELECT * FROM flight 
			WHERE departure_airport = ?
			AND arrival_airport = ?
			AND DATE_FORMAT(departure_time, %y, %m, %d) = ?`, 
		[srcaptName, dstaptName, date], 
		function(error, results, fields) {
			if (results.length > 0) {
				res.send(results);
			} else {
				res.send(404);
			}			
		res.end();
	});
});

app.post('/api/search/status', (req, res) => {
	let flightNumber = req.body.flightNumber;
	let arrivalDate = req.body.arrivalDate;
	let departureDate = req.body.departureDate;
	connection.query(
		`SELECT * FROM flight 
			WHERE flight_num = ?
			AND DATE_FORMAT(departure_time, %y, %m, %d) = ?
			AND DATE_FORMAT(arrival_time, %y, %m, %d) = ?`, 
		[flightNumber, departureDate, arrivalDate], 
		function(error, results, fields) {
			if (results.length > 0) {
				res.send(results);
			} else {
				res.send(404);
			}			
		res.end();
	});
});


app.post('/api/register/customer', (req, res) => {
	email = req.body.email;
	name = req.body.name;
	password = req.body.password;
	buildingNumber = req.body.buildingNumber;
	street = req.body.street;
	city = req.body.city;
	state = req.body.state;
	phoneNumber = req.body.phoneNumber;
	passportNumber = req.body.passportNumber;
	passportExpiration = req.body.passportExpiration;
	passportCountry = req.body.passportCountry;
	dateOfBirth = req.body.dateOfBirth;
	hashPassword = crypto.createHmac('sha1', key).update(password).digest('hex');
	connection.query(
		`INSERT INTO customer VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`, 
		[email, name, hashPassword, buildingNumber, street, city, state, phoneNumber, passportNumber, passportExpiration, passportCountry, dateOfBirth], 
		function(error, results, fields) {
			if (results.length > 0) {
				res.send(200);
			} else {
				res.send(500);
			}			
		res.end();
	});
});

app.post('/api/register/agent', (req, res) => {
	email = req.body.email;
	id = req.body.id;
	password = req.body.password;
	hashPassword = crypto.createHmac('sha1', key).update(password).digest('hex');
	connection.query(
		`INSERT INTO booking_agent VALUES (?,?)`, 
		[email, hashPassword], 
		function(error, results, fields) {
			if (results.length > 0) {
				res.send(200);
			} else {
				res.send(500);
			}			
		res.end();
	});
});

app.post('/api/register/staff', (req, res) => {
	username = req.body.username;
	firstName = req.body.firstName;
	lastName = req.body.lastname;
	password = req.body.password;
	dateOfBirth = req.body.dateOfBirth;
	airlineName = req.body.airlineName;
	hashPassword = crypto.createHmac('sha1', key).update(password).digest('hex');
	connection.query(
		`INSERT INTO airline_staff VALUES (?, ?, ?, ?, ?, ?)`, 
		[username, firstName, lastName, hashPassword, dateOfBirth, airlineName], 
		function(error, results, fields) {
			if (results.length > 0) {
				res.send(200);
			} else {
				res.send(500);
			}			
		res.end();
	});
});

app.post('/api/login/customer', (req, res) => {
	var username = req.body.username;
	var password = req.body.password;
	var hashPassword = crypto.createHmac('sha1', key).update(password).digest('hex')
	if (username && password) {
		connection.query(
            'SELECT * FROM customer WHERE username = ? AND password = ?', 
            [username, hashPassword], 
            function(error, results, fields) {
                if (results.length > 0) {
                    req.session.loggedin = true;
					req.session.username = username; 
					req.session.identity = "Customer";
                } else {
                    res.send('Error');
				}			
			res.end();
		});
	} else {
		res.send("Error");
		res.end();
	}
});

app.post('/api/login/agent', (req, res) => {
	var username = req.body.username;
	var password = req.body.password;
	var hashPassword = crypto.createHmac('sha1', key).update(password).digest('hex')
	if (username && password) {
		connection.query(
            'SELECT * FROM booking_agent WHERE username = ? AND password = ?', 
            [username, hashPassword], 
            function(error, results, fields) {
                if (results.length > 0) {
                    req.session.loggedin = true;
					req.session.username = username; 
					req.session.identity = "Booking Agent";
                } else {
                    res.send('Error');
				}			
			res.end();
		});
	} else {
		res.send("Error");
		res.end();
	}
});

app.post('/api/login/staff', (req, res) => {
	var username = req.body.username;
	var password = req.body.password;
	var hashPassword = crypto.createHmac('sha1', key).update(password).digest('hex')
	if (username && password) {
		connection.query(
            'SELECT * FROM airline_staff WHERE username = ? AND password = ?', 
            [username, hashPassword], 
            function(error, results, fields) {
                if (results.length > 0) {
                    req.session.loggedin = true;
					req.session.username = username; 
					req.session.identity = "Airline Staff";
                } else {
                    res.send('Error');
				}			
			res.end();
		});
	} else {
		res.send("Error");
		res.end();
	}
});







app.listen(3000,  () => console.log("app listening on port 3000!"));