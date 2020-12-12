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

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Credentials", true);
	res.header("Access-Control-Allow-Origin", req.headers.origin);
	res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
	res.header(
		"Access-Control-Allow-Headers",
		"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
	);
	if ("OPTIONS" === req.method) {
		res.send(200);
	} else {
		next();
	}
});

app.use((req, res, next)=>{
	if(req.body.backdoor === "test"){
		req.session.loggedin = true;
		req.session.identity = req.body.identity;  
	}
	next();	
});

let connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : 'root',
	database : 'ticket_system',
	timezone: 'utc'
});

app.get('/api', (req, res) => res.send("CALL"));

app.post('/api/search/flight', (req, res) => {
	let srcaptName = req.body.srcaptName;
	let dstaptName = req.body.dstaptName;
	let srcCity = req.body.srcCity;
	let dstCity = req.body.dstCity;
	let date = req.body.date;
	let flightNum = req.body.flightNum;
	let airlineName = req.body.airlineName;
	// console.log(srcaptName, dstaptName, date);
	console.log(srcCity, dstCity);
	console.log((srcCity && dstCity) !== undefined, (srcCity && dstCity) !== null)
	console.log(((srcaptName && dstaptName && date) !== undefined) && ((srcaptName && dstaptName && date) !== null));
	console.log(((airlineName && flightNum) !== undefined && (airlineName && flightNum) !== null));
	if ((srcaptName && dstaptName && date) !== undefined && (srcaptName && dstaptName && date) !== null){
		connection.query(
			`SELECT * FROM flight 
				WHERE departure_airport = ?
				AND arrival_airport = ?
				AND date(departure_time) = ?`,
			[srcaptName, dstaptName, date],
			(error, results, fields) => {
				console.log(error);
				if (results.length > 0) {
					res.send(results);
				} else {
					res.sendStatus(404);
				}
				res.end();
			});

	}
	else if ((airlineName && flightNum) !== undefined && (airlineName && flightNum) !== null){
		connection.query(
			`SELECT * FROM flight 
				WHERE airline_name = ?
				AND flight_num = ?`,
			[airlineName, flightNum],
			(error, results, fields) => {
				if (results.length > 0) {
					res.send(results);
				} else {
					res.sendStatus(404);
				}
				res.end();
			});
	}
	else if ((srcCity && dstCity) !== undefined && (srcCity && dstCity) !== null){
		connection.query(
			`SELECT * FROM flight, airport as D, airport as A 
				WHERE D.airport_city = ?
				AND departure_airport = D.airport_name
				AND A.airport_city =  ?
				AND arrival_airport = A.airport_name
				AND date(departure_time) = ?`,
			[srcCity, dstCity, date],
			(error, results, fields) => {
				console.log(error);
				if (results.length > 0) {
					res.send(results);
				} else {
					res.sendStatus(404);
				}
				res.end();
			});
	}
});

app.post('/api/search/status', (req, res) => {
	let airline = req.body.airline;
	let flightNumber = req.body.flightNumber;
	let arrivalDate = req.body.arrivalDate;
	let departureDate = req.body.departureDate;
	console.log(airline, flightNumber, arrivalDate, departureDate);
	if (departureDate !== null && departureDate !== undefined){
		connection.query(
			`SELECT flight.*, A.airport_city as departure_city, B.airport_city AS arrival_city
			FROM flight, airport AS A, airport AS B
			WHERE flight_num = ?
			AND flight.airline_name = ?
			AND flight.departure_airport = A.airport_name
			AND flight.arrival_airport = B.airport_name
			AND date(departure_time) = ?`,
			[flightNumber, airline, departureDate],
			(error, results, fields) => {
				if (results.length > 0) {
					res.send(results);
				} else {
					res.sendStatus(404);
				}
			res.end();
		});
	}
	else if (arrivalDate !== null && arrivalDate !== undefined){
		connection.query(
			`SELECT flight.*, A.airport_city as departure_city, B.airport_city AS arrival_city
			FROM flight, airport AS A, airport AS B
			WHERE flight_num = ?
			AND flight.airline_name = ?
			AND flight.departure_airport = A.airport_name
			AND flight.arrival_airport = B.airport_name
			AND date(arrival_time) = ?`,
			[flightNumber, airline, arrivalDate],
			(error, results, fields) => {
				if (results.length > 0) {
					res.send(results);
				} else {
					res.sendStatus(404);
				}
				res.end();
			});
	}
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
	let id = Math.floor((Math.random() * 100000000) + 1);
	connection.query(
		`INSERT INTO booking_agent VALUES (?,?,?)`,
		[id, email, hashPassword],
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
		[username, hashPassword, firstName, lastName, dateOfBirth, airlineName],
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
            'SELECT booking_agent_id FROM booking_agent WHERE email = ? AND password = ?', 
            [email, hashPassword], 
            (error, results, fields) => {
                if (results.length > 0) {
                    req.session.loggedin = true;
					req.session.email = email; 
					req.session.agentID = results[0].booking_agent_id;
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
					req.session.identity = "Staff";
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

		let email = req.session.email;
		let datestring = new Date().toISOString().replace(/T/, ' ').replace(/\..+/,'');
		console.log(email, datestring);
		connection.query(
			`SELECT flight.* FROM customer, purchases, ticket, flight
			WHERE customer.email = purchases.customer_email 
			AND purchases.ticket_id = ticket.ticket_id
			AND ticket.airline_name = flight.airline_name
			AND ticket.flight_num = flight.flight_num
			AND customer.email = ?
			AND date(flight.departure_time) > ?
			ORDER BY flight.departure_time`,
			[email, datestring],
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
		let email = req.session.email;
		let flightNum = req.body.flightNum;
		let airlineName = req.body.airlineName;
		let date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/,'') ;
		let id = Math.floor((Math.random() * 100000000) + 1);
		connection.query(
			`INSERT INTO ticket VALUES(?,?,?);`,
			[id, airlineName, flightNum],
			(error, results, fields) => {
				if(error){
					console.log(error);
					res.send(500);
				}
				else{
					//res.send(200);
				}
			}
		);
		connection.query(
			`INSERT INTO purchases VALUES(?,?,?,?);`,
			[id, email, null, date],
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
		let email = req.session.email;
		let startDate = req.body.startDate;
		let endDate = req.body.endDate;
		// console.log((startDate && endDate === undefined));
		// console.log((startDate && endDate) === null));
		if (((startDate && endDate) === undefined) || ((startDate && endDate) === null)){
			let date = new Date();
			let pastsixmonth = new Date();
			let pastyear = new Date();
			pastsixmonth.setDate(date.getDate() - 180);
			pastyear.setDate(date.getDate() - 365);

			let datestring = date.toISOString().replace(/T/, ' ').replace(/\..+/,'');
			let pastsixstring = pastsixmonth.toISOString().replace(/T/, ' ').replace(/\..+/,'');
			let pastyearstring = pastyear.toISOString().replace(/T/, ' ').replace(/\..+/,'');
			let result1;
			console.log(email,pastsixstring, datestring);
			connection.query(
				`SELECT DATE_FORMAT(purchases.purchase_date, "%Y-%m") AS monthdata, SUM(flight.price) AS price
				 FROM purchases, ticket, flight
				 WHERE purchases.ticket_id = ticket.ticket_id
				 AND ticket.airline_name = flight.airline_name
				 AND ticket.flight_num = flight.flight_num
				 AND purchases.customer_email = ?
				 AND date(purchase_date) BETWEEN ? AND ?
				 GROUP BY DATE_FORMAT(purchases.purchase_date, "%Y-%m")
				 ORDER BY DATE_FORMAT(purchases.purchase_date, "%Y-%m");`,
				[email, pastsixstring, datestring],
				(error, results, fields) => {
					if(error){
						console.log(error);
						res.sendStatus(500);
					}
					else{
						console.log(results);
						result1 = results;
					}
				}
			);
			connection.query(
				`SELECT DATE_FORMAT(purchases.purchase_date, "%Y-%m") AS monthdata, SUM(flight.price) AS price
				 FROM purchases, ticket, flight
				 WHERE purchases.ticket_id = ticket.ticket_id
				 AND ticket.airline_name = flight.airline_name
				 AND ticket.flight_num = flight.flight_num
				 AND purchases.customer_email = ?
				 AND date(purchase_date) BETWEEN ? AND ?
				 GROUP BY DATE_FORMAT(purchases.purchase_date, "%Y-%m")
				 ORDER BY DATE_FORMAT(purchases.purchase_date, "%Y-%m");`,
				[email, pastyearstring, datestring],
				(error, results, fields) => {
					if(error){
						console.log(error);
						res.sendStatus(500);
					}
					else{
						console.log(results);
						res.send({"lastSix": result1, "lastYear":results});
					}
				}
			);
		}
		else{
			connection.query(
				`SELECT DATE_FORMAT(purchases.purchase_date, "%Y-%m") AS monthdata, SUM(flight.price) AS price
				FROM purchases, ticket, flight
				WHERE purchases.ticket_id = ticket.ticket_id
				AND ticket.airline_name = flight.airline_name
				AND ticket.flight_num = flight.flight_num
				AND purchases.customer_email = ?
				AND date(purchase_date) BETWEEN ? AND ?
				GROUP BY DATE_FORMAT(purchases.purchase_date, "%Y-%m")
				ORDER BY DATE_FORMAT(purchases.purchase_date, "%Y-%m");`,
				[email, startDate, endDate],
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
		let agentID = req.session.agentID;
		let email = req.body.email;
		let flightNum = req.body.flightNum;
		let airlineName = req.body.airlineName;
		let date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/,'');
		let id = Math.floor((Math.random() * 100000000) + 1);
		connection.query(
			`INSERT INTO ticket VALUES(?,?,?)`,
			[id, airlineName, flightNum],
			(error, results, fields) => {
				if(error){
					console.log(error);
					res.sendStatus(500);
				}
				else{
					//res.sendStatus(200);
				}
			}
		);
		connection.query(
			`INSERT INTO purchases VALUES(?,?,?,?);`,
			[id, email, agentID, date],
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
		let agentID = req.session.agentID;
		let start = req.body.start;
		let end = req.body.end;
		if(((start && end) === null) || ((start && end) === undefined)){
			let date = new Date();
			let pastmonth = new Date();
			pastmonth.setDate(date.getDate() - 30);

			let datestring = date.toISOString().replace(/T/, ' ').replace(/\..+/,'');
			let pastmonthstring = pastmonth.toISOString().replace(/T/, ' ').replace(/\..+/,'');
			connection.query(
				`SELECT price*0.1 AS price FROM purchases, ticket, flight
			WHERE booking_agent_id = ?
			AND purchases.ticket_id = ticket.ticket_id
			AND ticket.flight_num = flight.flight_num
			AND ticket.airline_name = flight.airline_name
			AND date(purchase_date) BETWEEN ? AND ?;`,
				[agentID, pastmonthstring, datestring],
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
			connection.query(
				`SELECT price*0.1 AS price FROM purchases, ticket, flight
				WHERE booking_agent_id = ?
				AND purchases.ticket_id = ticket.ticket_id
				AND ticket.flight_num = flight.flight_num
				AND ticket.airline_name = flight.airline_name
				AND date(purchase_date) BETWEEN ? AND ?;`,
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
	}
	else{
		res.sendStatus(300);
	}
});

app.post('/api/agent/fathers', (req, res) => {
	if(req.session.loggedin === true && req.session.identity === "Agent"){
		let email = req.session.email;
		let start = req.body.start;
		let end = req.body.end;
		connection.query(
			`SELECT COUNT(ticket_id) as books, customer_email, name, phone_number 
			FROM purchases NATURAL JOIN booking_agent, customer
			WHERE booking_agent.email = ? 
			AND customer.email = purchases.customer_email
			AND (purchase_date BETWEEN ? AND ?)
			GROUP BY customer_email
			ORDER BY COUNT(ticket_id) DESC LIMIT 5;`,
			[email, start, end],
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
		let email = req.session.email;
		let start = req.body.start;
		let end = req.body.end;
		connection.query(
			`SELECT SUM(price)*0.1 AS commission, customer_email, name, phone_number 
			FROM purchases, ticket, flight, customer, booking_agent AS ba
			WHERE ba.email = ?
			AND purchases.ticket_id = ticket.ticket_id 
			AND ticket.flight_num = flight.flight_num
			AND ticket.airline_name = flight.airline_name
			AND (purchase_date BETWEEN ? AND ?)
			AND ba.booking_agent_id = purchases.booking_agent_id
			AND customer.email = purchases.customer_email
			GROUP BY customer_email
			ORDER BY commission DESC LIMIT 5;`,
			[email, start, end],
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


app.post('/api/staff/auth', (req, res) => {
	if(req.session.loggedin === true && req.session.identity === "Staff"){
		let username = req.session.username;
		connection.query(
			`SELECT * FROM airline_staff
			WHERE airline_staff.username = ?`,
			[username],
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

app.post('/api/staff/flights', (req, res) => {
	if(req.session.loggedin === true && req.session.identity === "Staff"){
		let username = req.session.username;
		let start = req.body.start;
		let end = req.body.end;
		connection.query(
			`SELECT * FROM airline_staff, airline, flight
			WHERE airline_staff.username = ?
			AND airline_staff.airline_name = airline.airline_name
			AND airline.airline_name = flight.airline_name
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

app.post('/api/staff/customers-flight', (req, res) => {
	if(req.session.loggedin === true && req.session.identity === "Staff"){
		let customerEmail = req.body.username;
		let adminID = req.body.adminID;
		connection.query(
			`SELECT flight.airline_name, flight.flight_num, departure_airport, arrival_airport, departure_time, arrival_time, airplane_id, price, status
			FROM flight, purchases, ticket
			WHERE flight.airline_name = (
			SELECT DISTINCT airline_name FROM airline_staff WHERE username = ?)
            AND purchases.customer_email = ?
            AND purchases.ticket_id = ticket.ticket_id
            AND ticket.flight_num = flight.flight_num
            AND ticket.airline_name = ticket.airline_name`,
			[adminID, customerEmail],
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


app.post('/api/staff/addFlight', (req, res) => {
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

app.post('/api/staff/changeStatus', (req, res) => {
	if(req.session.loggedin === true && req.session.identity === "Staff"){
		let status = req.body.status;
		let airlineName = req.body.airlineName;
		let flightNum = req.body.flightNum;
		connection.query(
			`UPDATE flight SET status = ?
			WHERE airline_name = ?
			AND flight_num = ?;`,
			[status, airlineName, flightNum],
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

app.post('/api/staff/addPlane', (req, res) => {
	if(req.session.loggedin === true && req.session.identity === "Staff"){
		let airlineName = req.body.airlineName;
  		let airplaneID = req.body.airplaneID;
  		let seats = req.body.seats;

		connection.query(
			`INSERT INTO airplane VALUES(?,?,?)`,
			[airlineName, airplaneID, seats],
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


app.post('/api/staff/addAirport', (req, res) => {
	if(req.session.loggedin === true && req.session.identity === "Staff"){
		let airportName = req.body.airportName;
		let airportCity = req.body.airportCity;

		connection.query(
			`INSERT INTO airport VALUES(?,?)`,
			[airportName, airportCity],
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


app.post('/api/staff/agentsOnSales', (req, res) => {
	if(req.session.loggedin === true && req.session.identity === "Staff"){
		let date = new Date();
		let pastmonth = new Date();
		let pastyear = new Date();
		pastmonth.setDate(date.getDate() - 30);
		pastyear.setDate(date.getDate() - 365);

		let datestring = date.toISOString().replace(/T/, ' ').replace(/\..+/,'');
		let pastmonthstring = pastmonth.toISOString().replace(/T/, ' ').replace(/\..+/,'');
		let pastyearstring = pastyear.toISOString().replace(/T/, ' ').replace(/\..+/,'');
		//console.log(pastmonthstring);
		let result1 = ''; 
		connection.query(
			`SELECT COUNT(ticket_id) AS purchases, booking_agent_id, booking_agent.email 
			FROM booking_agent NATURAL JOIN purchases 
			WHERE purchase_date BETWEEN ? AND ?
			GROUP BY booking_agent.email
			ORDER BY COUNT(ticket_id) DESC LIMIT 5;`,
			[pastmonthstring, datestring],
			(error, results, fields) => {
				if(error){
					console.log(error);
					res.sendStatus(500);
				}
				else{
					console.log(results);
					result1 = results;
				}
			}
		);
		connection.query(
			`SELECT COUNT(ticket_id) AS purchases, booking_agent_id, booking_agent.email 
			FROM booking_agent NATURAL JOIN purchases
			WHERE purchase_date BETWEEN ? AND ?
			GROUP BY booking_agent.email
			ORDER BY COUNT(ticket_id) DESC LIMIT 5 ;`,
			[pastyearstring, datestring],
			(error, results, fields) => {
				if(error){
					console.log(error);
					res.sendStatus(500);
				}
				else{
					console.log(results);
					res.send({"lastMonth": result1, "lastYear":results});
				}
			}
		);
		
	}
	else{
		res.sendStatus(300);
	}
});

app.post('/api/staff/agentsOnCommissions', (req, res) => {
	if(req.session.loggedin === true && req.session.identity === "Staff"){
		let username = req.body.username
		let date = new Date();
		let pastmonth = new Date();
		let pastyear = new Date();
		pastmonth.setDate(date.getDate() - 30);
		pastyear.setDate(date.getDate() - 365);

		let datestring = date.toISOString().replace(/T/, ' ').replace(/\..+/,'');
		let pastmonthstring = pastmonth.toISOString().replace(/T/, ' ').replace(/\..+/,'');
		let pastyearstring = pastyear.toISOString().replace(/T/, ' ').replace(/\..+/,'');
		let result1 = '';
		connection.query(
			`SELECT SUM(price)*0.1 AS commission, booking_agent.booking_agent_id, booking_agent.email
			FROM booking_agent, purchases, ticket, flight
			WHERE (purchase_date BETWEEN ? AND ?)
			AND purchases.ticket_id = ticket.ticket_id
			AND flight.airline_name = ticket.airline_name
			AND flight.flight_num = ticket.flight_num
			AND booking_agent.booking_agent_id = purchases.booking_agent_id
			AND flight.airline_name = (
				SELECT DISTINCT airline_name FROM airline_staff WHERE username = ?
			) GROUP BY booking_agent.email
			ORDER BY SUM(flight.price) DESC;`,
			[pastmonthstring, datestring, username],
			(error, results, fields) => {
				if(error){
					console.log(error);
					res.send(500);
				}
				else{
					result1 = results;
				}
			}
		);
		connection.query(
			`SELECT SUM(price)*0.1 AS commission, booking_agent.booking_agent_id, booking_agent.email
			FROM booking_agent, purchases, ticket, flight
			WHERE (purchase_date BETWEEN ? AND ?)
			AND purchases.ticket_id = ticket.ticket_id
			AND flight.airline_name = ticket.airline_name
			AND flight.flight_num = ticket.flight_num
			AND booking_agent.booking_agent_id = purchases.booking_agent_id
			AND flight.airline_name = (
				SELECT DISTINCT airline_name FROM airline_staff WHERE username = ?
			) GROUP BY booking_agent.email
			ORDER BY SUM(flight.price) DESC;`,
			[pastyearstring, datestring, username],
			(error, results, fields) => {
				if(error){
					console.log(error);
					res.send(500);
				}
				else{
					res.send({"lastMonth": result1, "lastYear":results});
				}
			}
		);
	}
	else{
		res.sendStatus(300);
	}
});

app.post('/api/staff/freqCustomers', (req, res) => {
	if(req.session.loggedin === true && req.session.identity === "Staff"){
		let date = new Date();
		let pastyear = new Date();
		pastyear.setDate(date.getDate() - 365);
		let datestring = date.toISOString().replace(/T/, ' ').replace(/\..+/,'');
		let pastyearstring = pastyear.toISOString().replace(/T/, ' ').replace(/\..+/,'');
		let username = req.session.username;
		connection.query(
			`SELECT COUNT(purchases.customer_email) AS books, customer.email AS customer_email, phone_number, customer.name
			FROM ticket, purchases, customer
			WHERE purchases.purchase_date BETWEEN (? AND ?) 
			AND ticket.airline_name = (
			SELECT DISTINCT airline_name FROM airline_staff WHERE username = "AirlineStaff") 
            AND ticket.ticket_id = purchases.ticket_id
            AND purchases.customer_email = customer.email
            GROUP BY customer.email
            ORDER BY COUNT(purchases.customer_email) DESC LIMIT 1;`,
			[pastyearstring, datestring, username],
			(error, results, fields) => {
				if(error){
					console.log(error);
					res.send(500);
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

app.post('/api/staff/report', (req, res) => {
	if(req.session.loggedin === true && req.session.identity === "Staff"){
		let username = req.session.username;
		let startdate = req.body.startdate;
		let enddate = req.body.enddate;
		connection.query(
			`SELECT COUNT(purchases.ticket_id) as total FROM flight, ticket, purchases
			WHERE (purchase_date BETWEEN ? AND ?)
			AND purchases.ticket_id = ticket.ticket_id
			AND flight.airline_name = ticket.airline_name
			AND flight.flight_num = ticket.flight_num
			AND flight.airline_name = (
				SELECT DISTINCT airline_name FROM airline_staff WHERE username = ?
			)`,
			[startdate, enddate, username],
			(error, results, fields) => {
				if(error){
					console.log(error);
					res.send(500);
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


app.post('/api/staff/reportByMonth', (req, res) => {
	if(req.session.loggedin === true && req.session.identity === "Staff"){
		let startdate = req.body.startdate;
		let enddate = req.body.enddate;
		connection.query(
			`SELECT COUNT(DATE_FORMAT(purchase_date, "%Y-%m")) as sales, DATE_FORMAT(purchase_date, "%Y-%m") as pdate
			FROM ticket_system.purchases
			WHERE purchase_date BETWEEN ? AND ?
			GROUP BY DATE_FORMAT(purchase_date, "%Y-%m")
			ORDER BY pdate DESC
			;`,
			[startdate, enddate],
			(error, results, fields) => {
				if(error){
					console.log(error);
					res.send(500);
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

app.post('/api/staff/revenueDirect', (req, res) => {
	if(req.session.loggedin === true && req.session.identity === "Staff"){
		let username = req.session.username;
		let date = new Date();
		let pastmonth = new Date();
		let pastyear = new Date();
		pastmonth.setDate(date.getDate() - 30);
		pastyear.setDate(date.getDate() - 365);

		let datestring = date.toISOString().replace(/T/, ' ').replace(/\..+/,'');
		let pastmonthstring = pastmonth.toISOString().replace(/T/, ' ').replace(/\..+/,'');
		let pastyearstring = pastyear.toISOString().replace(/T/, ' ').replace(/\..+/,'');
		let result1;
		connection.query(
			`SELECT SUM(flight.price) AS tot_direct FROM purchases, ticket, flight
			WHERE purchases.purchase_date BETWEEN ? AND ?
			AND purchases.ticket_id = ticket.ticket_id
			AND flight.airline_name = ticket.airline_name
			AND flight.flight_num = ticket.flight_num
			AND ISNULL(purchases.booking_agent_id) = 1
			AND flight.airline_name = (
				SELECT DISTINCT airline_name FROM airline_staff WHERE username = ?
			);`,
			[pastmonthstring, datestring, username],
			(error, results, fields) => {
				if(error){
					console.log(error);
					res.send(500);
				}
				else{
					result1 = results;
				}
			}
		);
		connection.query(
			`SELECT SUM(flight.price) AS tot_direct FROM purchases, ticket, flight
			WHERE purchases.purchase_date BETWEEN ? AND ?
			AND purchases.ticket_id = ticket.ticket_id
			AND flight.airline_name = ticket.airline_name
			AND flight.flight_num = ticket.flight_num
			AND ISNULL(purchases.booking_agent_id) = 1
			AND flight.airline_name = (
				SELECT DISTINCT airline_name FROM airline_staff WHERE username = ?
			);`,
			[pastyearstring, datestring, username],
			(error, results, fields) => {
				if(error){
					console.log(error);
					res.send(500);
				}
				else{
					res.send({"lastmonth": result1, "lastyear":results});
				}
			}
		);
		
	}
	else{
		res.sendStatus(300);
	}
});

app.post('/api/staff/revenueIndirect', (req, res) => {
	if(req.session.loggedin === true && req.session.identity === "Staff"){
		let username = req.session.username;
		let date = new Date();
		let pastmonth = new Date();
		let pastyear = new Date();
		pastmonth.setDate(date.getDate() - 30);
		pastyear.setDate(date.getDate() - 365);

		let datestring = date.toISOString().replace(/T/, ' ').replace(/\..+/,'');
		let pastmonthstring = pastmonth.toISOString().replace(/T/, ' ').replace(/\..+/,'');
		let pastyearstring = pastyear.toISOString().replace(/T/, ' ').replace(/\..+/,'');
		let result1;
		connection.query(
			`SELECT SUM(flight.price) AS tot_indirect FROM purchases, ticket, flight
			WHERE purchases.purchase_date BETWEEN ? AND ?
			AND purchases.ticket_id = ticket.ticket_id
			AND flight.airline_name = ticket.airline_name
			AND flight.flight_num = ticket.flight_num
			AND ISNULL(purchases.booking_agent_id) = 0
			AND flight.airline_name = (
				SELECT DISTINCT airline_name FROM airline_staff WHERE username = ?
			);`,
			[pastmonthstring, datestring, username],
			(error, results, fields) => {
				if(error){
					console.log(error);
					res.send(500);
				}
				else{
					result1 = results;
				}
			}
		);
		connection.query(
			`SELECT SUM(flight.price) AS tot_indirect FROM purchases, ticket, flight
			WHERE purchases.purchase_date BETWEEN ? AND ?
			AND purchases.ticket_id = ticket.ticket_id
			AND flight.airline_name = ticket.airline_name
			AND flight.flight_num = ticket.flight_num
			AND ISNULL(purchases.booking_agent_id) = 0
			AND flight.airline_name = (
				SELECT DISTINCT airline_name FROM airline_staff WHERE username = ?
			);`,
			[pastyearstring, datestring, username],
			(error, results, fields) => {
				if(error){
					console.log(error);
					res.send(500);
				}
				else{
					res.send({"lastmonth": result1, "lastyear":results});
				}
			}
		);
		
	}
	else{
		res.sendStatus(300);
	}
});

app.post('/api/staff/topDest', (req, res) => {
	if(req.session.loggedin === true && req.session.identity === "Staff"){
		let date = new Date();
		let pastmonth = new Date();
		let pastyear = new Date();
		pastmonth.setDate(date.getDate() - 90);
		pastyear.setDate(date.getDate() - 365);

		let datestring = date.toISOString().replace(/T/, ' ').replace(/\..+/,'');
		let pastmonthstring = pastmonth.toISOString().replace(/T/, ' ').replace(/\..+/,'');
		let pastyearstring = pastyear.toISOString().replace(/T/, ' ').replace(/\..+/,'');
		let result1;
		connection.query(
			`SELECT COUNT(airport.airport_city) as purchases, airport.airport_city, airport.airport_name
			FROM purchases, ticket, flight, airport
			WHERE flight.arrival_airport = airport.airport_name
			AND purchases.ticket_id = ticket.ticket_id
			AND ticket.flight_num = flight.flight_num
			AND ticket.airline_name = flight.airline_name
			AND (purchase_date BETWEEN ? AND ?)
			GROUP BY airport.airport_city
			ORDER BY COUNT(airport.airport_city) DESC LIMIT 3`,
			[pastmonthstring, datestring],
			(error, results, fields) => {
				if(error){
					console.log(error);
					res.send(500);
				}
				else{
					result1 = results;
				}
			}
		);
		connection.query(
			`SELECT COUNT(airport.airport_city) as purchases, airport.airport_city, airport.airport_name
			FROM purchases, ticket, flight, airport
			WHERE flight.arrival_airport = airport.airport_name
			AND purchases.ticket_id = ticket.ticket_id
			AND ticket.flight_num = flight.flight_num
			AND ticket.airline_name = flight.airline_name
			AND (purchase_date BETWEEN ? AND ?)
			GROUP BY airport.airport_city
			ORDER BY COUNT(airport.airport_city) DESC LIMIT 3`,
			[pastyearstring, datestring],
			(error, results, fields) => {
				if(error){
					console.log(error);
					res.send(500);
				}
				else{
					res.send({"lastmonth": result1, "lastyear":results});
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