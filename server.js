let mysql = require('mysql');
let express = require('express');
let session = require('express-session');
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
let path = require('path');
let crypto = require('crypto');
const { MemoryStore } = require('express-session');


let app = module.exports = express();
let key = `3082N-t2983-[mIKi-rU42h-3roqe-idkxf-[239s&`

app.use(session({
	secret: 'secret', 
	resave: true,
    saveUninitialized: true,
	cookie: {secure: false, sameSite: false},
	store: new MemoryStore()
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(cookieParser())
app.use(express.static('public'))

let connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : 'root',
	database : 'ticket_system'
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
			AND departure_time = ?`, 
		[srcaptName, dstaptName, date], 
		(error, results, fields) => {
			if (results.length > 0) {
				res.send(results);
			} else {
				res.sendStatus(404);
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
			AND departure_time = ?
			AND arrival_time = ?`, 
		[flightNumber, departureDate, arrivalDate], 
		(error, results, fields) => {
			if (results.length > 0) {
				res.send(results);
			} else {
				res.sendStatus(404);
			}			
		res.end();
	});
});


app.post('/api/register/customer', (req, res) => {
	let email = req.body.email;
	let name = req.body.name;
	let password = req.body.password;
	let buildingNumber = req.body.buildingNumber;
	let street = req.body.street;
	let city = req.body.city;
	let state = req.body.state;
	let phoneNumber = req.body.phoneNumber;
	let passportNumber = req.body.passportNumber;
	let passportExpiration = req.body.passportExpiration;
	let passportCountry = req.body.passportCountry;
	let dateOfBirth = req.body.dateOfBirth;
	let hashPassword = crypto.createHash('md5').update(password).digest('hex');
	console.log([email, name, hashPassword, buildingNumber, street, city, state, phoneNumber, passportNumber, passportExpiration, passportCountry, dateOfBirth]);
	connection.query(
		`INSERT INTO customer VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`, 
		[email, name, hashPassword, buildingNumber, street, city, state, phoneNumber, passportNumber, passportExpiration, passportCountry, dateOfBirth], 
		(error, results, fields) => {
			if (error) {
				console.log(error);
				res.sendStatus(500);
			} else {
				res.sendStatus(200);
			}			
		res.end();
	});
});

app.post('/api/register/agent', (req, res) => {
	let email = req.body.email;
	let password = req.body.password;
	let hashPassword = crypto.createHash('md5').update(password).digest('hex');
	let id = rypto.createHmac('sha1', key).update(email).digest('hex');
	connection.query(
		`INSERT INTO booking_agent VALUES (?,?,?)`,
		[email, hashPassword, id], 
		(error, results, fields) => {
			if (error) {
				console.log(error);
				res.sendStatus(500);
			} else {
				res.sendStatus(200);
			}			
		res.end();
	});
});

app.post('/api/register/staff', (req, res) => {
	let username = req.body.username;
	let firstName = req.body.firstName;
	let lastName = req.body.lastName;
	let password = req.body.password;
	let dateOfBirth = req.body.dateOfBirth;
	let airlineName = req.body.airlineName;
	let hashPassword = crypto.createHash('md5').update(password).digest('hex');
	connection.query(
		`INSERT INTO airline_staff VALUES (?, ?, ?, ?, ?, ?)`, 
		[username, firstName, lastName, hashPassword, dateOfBirth, airlineName], 
		(error, results, fields) => {
			if (error) {
				console.log(error);
				res.send(500);
			} else {
				res.send(200);
			}			
		res.end();
	});
});

app.post('/api/login/customer', (req, res) => {
	let email = req.body.email;
	let password = req.body.password;
	let hashPassword = crypto.createHash('md5').update(password).digest('hex')
	if (email && password) {
		connection.query(
            'SELECT * FROM customer WHERE email = ? AND password = ?',
            [email, hashPassword],
            (error, results, fields) => {
                if (results.length > 0) {
                    req.session.loggedin = true;
					req.session.email = email; 
					req.session.identity = "Customer";
					res.sendStatus(200);
                } else {
                    res.sendStatus(418);
				}			
			res.end();
		});
	} else {
		res.sendStatus(418);
		res.end();
	}
});

app.post('/api/login/agent', (req, res) => {
	let email = req.body.email;
	let password = req.body.password;
	let hashPassword = crypto.createHash('md5').update(password).digest('hex')
	if (email && password) {
		connection.query(
            'SELECT * FROM booking_agent WHERE email = ? AND password = ?', 
            [email, hashPassword], 
            (error, results, fields) => {
                if (results.length > 0) {
                    req.session.loggedin = true;
					req.session.email = email; 
					req.session.identity = "Agent";
					res.sendStatus(200);
                } else {
                    res.sendStatus(418);
				}			
			res.end();
		});
	} else {
		res.sendStatus(418);
		res.end();
	}
});

app.post('/api/login/staff', (req, res) => {
	let username = req.body.username;
	let password = req.body.password;
	let hashPassword = crypto.createHash('md5').update(password).digest('hex')
	if (username && password) {
		connection.query(
            'SELECT * FROM airline_staff WHERE username = ? AND password = ?', 
            [username, hashPassword], 
            (error, results, fields) => {
                if (results.length > 0) {
                    req.session.loggedin = true;
					req.session.username = username; 
					req.session.identity = "Airline Staff";
                } else {
                    res.send(418);
				}			
			res.end();
		});
	} else {
		res.send(418);
		res.end();
	}
});

app.post('/api/customer/flights', (req, res) => {
	if(req.session.loggedin === true && req.session.identity === "Customer"){
		let email = req.body.email;
		connection.query(
			`SELECT * FROM customer, purchases, ticket, flight
			WHERE customer.email = purchases.customer_email 
			AND purchases.ticket_id = ticket.ticket_id
			AND ticket.airline_name = flight.airline_name
			AND ticket.flight_num = flight.flight_num
			AND customer.email = ?`,
			[email],
			(error, results, fields) => {
				res.send(results); 
				res.end();
			}
		);
	}
	else{
		res.send(300);
	}
});


app.post('/api/customer/purchase', (req, res) => {
	if(req.session.loggedin === true && req.session.identity === "Customer"){
		let email = req.body.email;
		let flightNum = req.body.flightNum;
		let airlineName = req.body.airlineName;
		let date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/,'') ;
		let id = crypto.createHmac('sha1', key).update(email + date).digest('hex');
		connection.query(
			`INSERT INTO ticket VALUES(?,?,?);
			INSERT INTO purchases VALUES(?,?,?,?);`,
			[id, airlineName, flightNum, id, email, null, date],
			(error, results, fields) => {
				if(error){
					console.log(error);
					res.send(500);
				}
				else{
					res.send(200);
				}
			}
		);
	}
	else{
		res.send(300);
	}
});


app.post('/api/customer/bill', (req, res) => {
	if(req.session.loggedin === true && req.session.identity === "Customer"){
		let email = req.body.email;
		connection.query(
			`SELECT purchases.purchase_date, flight.price FROM purchases, ticket, flight
			WHERE purchases.ticket_id = ticket.ticket_id
			AND ticket.airline_name = flight.airline_name
			AND ticket.flight_num = flight.flight_num
			AND purchases.customer_email = ?;`,
			[email],
			(error, results, fields) => {
				if(error){
					console.log(error);
					res.sendStatus(500);
				}
				else{
					res.send(results);
				}
			}
		);
	}
	else{
		res.sendStatus(300);
	}
});


app.post('/api/customer/logout', (req, res) => {
	if(req.session.loggedin === true && req.session.identity === "Customer"){
		req.session.destroy();
		res.sendStatus(200);
	}
	else{
		res.sendStatus(300);
	}
});


app.post('/api/agent/flight', (req, res) => {
	if(req.session.loggedin === true && req.session.identity === "Agent"){
		let email = req.body.email;
		connection.query(
			`SELECT * FROM customer, purchases, ticket, flight, booking_agent
			WHERE customer.email = purchases.customer_email 
			AND purchases.ticket_id = ticket.ticket_id
			AND ticket.airline_name = flight.airline_name
			AND ticket.flight_num = flight.flight_num
			AND purchases.booking_agent_id = booking_agent.booking_agent_id
			AND booking_agent.email = ?`,
			[email],
			(error, results, fields) => {
				res.send(results); 
				res.end();
			}
		);
	}
	else{
		res.send(300);
	}
});

app.post('/api/agent/purchase', (req, res) => {
	if(req.session.loggedin === true && req.session.identity === "Agent"){
		let agentID = req.body.agentID;
		let email = req.body.email;
		let flightNum = req.body.flightNum;
		let airlineName = req.body.airlineName;
		let date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/,'');
		let id = crypto.createHmac('sha1', key).update(email + date).digest('hex');
		connection.query(
			`INSERT INTO ticket VALUES(?,?,?);
			INSERT INTO purchases VALUES(?,?,?,?);`,
			[id, airlineName, flightNum, id, email, agentID, date],
			(error, results, fields) => {
				if(error){
					console.log(error);
					res.sendStatus(500);
				}
				else{
					res.sendStatus(200);
				}
			}
		);
	}
	else{
		res.sendStatus(300);
	}
});


app.post('/api/agent/commission', (req, res) => {
	if(req.session.loggedin === true && req.session.identity === "Agent"){
		let agentID = req.body.agentID;
		let start = req.body.start;
		let end = req.body.end;
		connection.query(
			`SELECT price, purchase_date FROM purchases NATURAL JOIN ticket NATURAL JOIN flight
			WHERE booking_agent_id = ?
			AND (purchase_date BETWEEN ? AND ?);`,
			[agentID, start, end],
			(error, results, fields) => {
				if(error){
					console.log(error);
					res.sendStatus(500);
				}
				else{
					res.send(results);
				}
			}
		);
	}
	else{
		res.sendStatus(300);
	}
});

app.post('/api/agent/fathers', (req, res) => {
	if(req.session.loggedin === true && req.session.identity === "Agent"){
		let agentID = req.body.agentID;
		let start = req.body.start;
		let end = req.body.end;
		connection.query(
			`SELECT COUNT(ticket_id), customer_email FROM purchases
			ORDER BY COUNT(ticket_id) DESC LIMIT 5
			WHERE booking_agent_id = ? 
			AND (purchase_date BETWEEN ? AND ?)
			GROUP BY customer_email;`,
			[agentID, start, end],
			(error, results, fields) => {
				if(error){
					console.log(error);
					res.sendStatus(500);
				}
				else{
					res.send(results);
				}
			}
		);
	}
	else{
		res.sendStatus(300);
	}
});

app.post('/api/agent/mothers', (req, res) => {
	if(req.session.loggedin === true && req.session.identity === "Agent"){
		let agentID = req.body.agentID;
		let start = req.body.start;
		let end = req.body.end;
		connection.query(
			`SELECT SUM(price), customer_email FROM purchases
			ORDER BY SUM(price) DESC LIMIT 5
			WHERE booking_agent_id = ? 
			AND (purchase_date BETWEEN ? AND ?)
			GROUP BY customer_email;`,
			[agentID, start, end],
			(error, results, fields) => {
				if(error){
					console.log(error);
					res.sendStatus(500);
				}
				else{
					res.send(results);
				}
			}
		);
	}
	else{
		res.sendStatus(300);
	}
});

app.post('/api/agent/logout', (req, res) => {
	if(req.session.loggedin === true && req.session.identity === "Agent"){
		req.session.destroy();
		res.sendStatus(200);
	}
	else{
		res.sendStatus(300);
	}
});


app.post('/api/staff/flights', (req, res) => {
	if(req.session.loggedin === true && req.session.identity === "Staff"){
		let username = req.body.username;
		let start = req.body.start;
		let end = req.body.end;
		connection.query(
			`SELECT * FROM airline_staff NATURAL JOIN airline NATURAL JOIN flight
			WHERE airline_staff.username = ?
			AND (departure_time BETWEEN ? AND ?)`,
			[username, start, end],
			(error, results, fields) => {
				if(error){
					console.log(error);
					res.sendStatus(500);
				}
				else{
					res.send(results);
				}
			}
		);
	}
	else{
		res.sendStatus(300);
	}
});

app.post('/api/staff/customers', (req, res) => {
	if(req.session.loggedin === true && req.session.identity === "Staff"){
		let username = req.body.username;
		let flightNum = req.body.flightNum;
		let airlineName = req.body.airlineName;
		connection.query(
			`SELECT customer.email, customer.name, customer.phone_number 
			FROM airline_staff NATURAL JOIN airline NATURAL JOIN flight NATURAL JOIN ticket NATURAL JOIN purchases NATURAL JOIN customer
			WHERE airline_staff.username = ?
			AND flight.flight_num = ?
			AND flight.airline_name = ?`,
			[username, flightNum, airlineName],
			(error, results, fields) => {
				if(error){
					console.log(error);
					res.sendStatus(500);
				}
				else{
					res.send(results);
				}
			}
		);
	}
	else{
		res.sendStatus(300);
	}
});


app.post('/api/staff/create', (req, res) => {
	if(req.session.loggedin === true && req.session.identity === "Staff"){
		let airlineName = req.body.airlineName;
		let flightNum = req.body.flightNum;
		let departureAirport = req.body.departureAirport;
		let departureTime = req.body.departureTime;
  		let arrivalAirport = req.body.arrivalAirport;
  		let arrivalTime = req.body.arrivalTime;
  		let price = req.body.price;
  		let status = req.body.status;
  		let airplaneID = req.body.airplaneID;

		connection.query(
			`INSERT INTO flight VALUES(?,?,?,?,?,?,?,?,?);`,
			[airlineName, flightNum, departureAirport, departureTime, arrivalAirport, arrivalTime, price, status, airplaneID],
			(error, results, fields) => {
				if(error){
					console.log(error);
					res.sendStatus(500);
				}
				else{
					res.sendStatus(200);
				}
			}
		);
	}
	else{
		res.sendStatus(300);
	}
});







app.post('/api/staff/logout', (req, res) => {
	if(req.session.loggedin === true && req.session.identity === "Staff"){
		req.session.destroy();
		res.sendStatus(200);
	}
	else{
		res.sendStatus(300);
	}
});




app.listen(3000,  () => console.log("app listening on port 3000!"));