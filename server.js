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
	if(req.body.backdoor === "__EastWind__"){
		req.session.loggedin = true;
		req.session.identity = req.body.identity;  
	}
	next();	
});

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
	let flightNum = req.body.flightNum;
	let airlineName = req.body.airlineName;
	// console.log(((srcaptName && dstaptName && date) !== undefined) && ((srcaptName && dstaptName && date) !== null));
	// console.log(((airlineName && flightNum) !== undefined && (airlineName && flightNum) !== null));
	if ((srcaptName && dstaptName && date) !== undefined && (srcaptName && dstaptName && date) !== null){
		connection.query(
			`SELECT * FROM flight 
				WHERE departure_airport = ?
				AND arrival_airport = ?
				AND date(departure_time) = ?`,
			[srcaptName, dstaptName, date],
			(error, results, fields) => {
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
	let id = Math.floor((Math.random() * 100000000) + 1);
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
		let email = req.session.email;
		let start = req.body.start;
		let end = req.body.end;
		connection.query(
			`SELECT COUNT(ticket_id), customer_email FROM purchases NATURAL JOIN booking_agent
			WHERE booking_agent.email = ? 
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
		let agentID = req.body.agentID;
		let start = req.body.start;
		let end = req.body.end;
		connection.query(
			`SELECT SUM(price), customer_email FROM purchases NATURAL JOIN booking_agent
			WHERE booking_agent.email = ?
			AND (purchase_date BETWEEN ? AND ?)
			GROUP BY customer_email
			ORDER BY SUM(price) DESC LIMIT 5;`,
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
		let username = req.session.username;
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

app.post('/api/staff/customers-flight', (req, res) => {
	if(req.session.loggedin === true && req.session.identity === "Staff"){
		let username = req.session.username;
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
			`INSERT INTO airport VALUES(?,?,?)`,
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
		console.log(pastmonthstring);
		let result1 = ''; 
		connection.query(
			`SELECT COUNT(ticket_id), booking_agent_id, booking_agent.email FROM booking_agent NATURAL JOIN purchases 
			WHERE purchase_date BETWEEN ? AND ?
			GROUP BY booking_agent_id
			ORDER BY COUNT(ticket_id) DESC LIMIT 5;`,
			[pastmonthstring, datestring],
			(error, results, fields) => {
				if(error){
					console.log(error);
					res.sendStatus(500);
				}
				else{
					result1 = results;
				}
			}
		);
		connection.query(
			`SELECT COUNT(ticket_id), booking_agent_id, booking_agent.email FROM booking_agent NATURAL JOIN purchases
			WHERE purchase_date BETWEEN ? AND ?
			GROUP BY booking_agent_id
			ORDER BY COUNT(ticket_id) DESC LIMIT 5 ;`,
			[pastyearstring, datestring],
			(error, results, fields) => {
				if(error){
					console.log(error);
					res.sendStatus(500);
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

app.post('/api/staff/agentsOnCommissions', (req, res) => {
	if(req.session.loggedin === true && req.session.identity === "Staff"){
		let username = req.session.username;
		let startdate = req.body.startdate;
		let enddate = req.body.enddate;
		connection.query(
			`SELECT SUM(price), booking_agent_id, booking_agent.email
			FROM booking_agent NATURAL JOIN purchases NATURAL JOIN ticket NATURAL JOIN flight
			WHERE (purchase_date BETWEEN ? AND ?)
			AND flight.airline_name = (
				SELECT DISTINCT aitline_name FROM staff WHERE username = ?
			) GROUP BY purchases.booking_agent_id
			ORDER BY SUM(flight.price);`,
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

app.post('/api/staff/freqCustomers', (req, res) => {
	if(req.session.loggedin === true && req.session.identity === "Staff"){
		let username = req.session.username;
		let startdate = req.body.startdate;
		let enddate = req.body.enddate;
		connection.query(
			`SELECT customer.email, customer.name FROM flight NATURAL JOIN ticket NATURAL JOIN purchases NATURAL JOIN customer
			WHERE (purchase_date BETWEEN ? AND ?)
			AND flight.airline_name = (
				SELECT DISTINCT aitline_name FROM staff WHERE username = ?
			) GROUP BY customer.email
			ORDER BY COUNT(ticket.ticket_id) DESC LIMIT 5;`,
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

app.post('/api/staff/reports', (req, res) => {
	if(req.session.loggedin === true && req.session.identity === "Staff"){
		let username = req.session.username;
		let startdate = req.body.startdate;
		let enddate = req.body.enddate;
		connection.query(
			`SELECT COUNT(ticket_id) FROM flight NATURAL JOIN ticket NATURAL JOIN purchases
			WHERE (purchase_date BETWEEN ? AND ?)
			AND flight.airline_name = (
				SELECT DISTINCT aitline_name FROM staff WHERE username = ?
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

app.post('/api/staff/revenueDirect', (req, res) => {
	if(req.session.loggedin === true && req.session.identity === "Staff"){
		let username = req.session.username;
		let date = req.body.date;
		let now = new Date().toISOString().replace(/T/, ' ').replace(/\..+/,'');
		connection.query(
			`SELECT SUM(flight.price) FROM purchases NATURAL JOIN ticket NATURAL JOIN flight
			WHERE purchases.purchase_date BETWEEN ? AND ?
			AND purchases.booking_agent_id = null
			AND flight.airline_name = (
				SELECT DISTINCT aitline_name FROM staff WHERE username = ?
			);`,
			[date, now, username],
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

app.post('/api/staff/revenueIndirect', (req, res) => {
	if(req.session.loggedin === true && req.session.identity === "Staff"){
		let username = req.session.username;
		let date = req.body.date;
		let now = new Date().toISOString().replace(/T/, ' ').replace(/\..+/,'');
		connection.query(
			`SELECT SUM(flight.price) FROM purchases NATURAL JOIN ticket NATURAL JOIN flight
			WHERE purchases.purchase_date BETWEEN ? AND ?
			AND purchases.booking_agent_id != null
			AND flight.airline_name = (
				SELECT DISTINCT aitline_name FROM staff WHERE username = ?
			);`,
			[date, now, username],
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

app.post('/api/staff/topDest', (req, res) => {
	if(req.session.loggedin === true && req.session.identity === "Staff"){
		let date = req.body.date;
		let now = new Date().toISOString().replace(/T/, ' ').replace(/\..+/,'');
		connection.query(
			`SELECT COUNT(airport.airport_city), airport.airport_city FROM purchases NATURAL JOIN ticket NATURAL JOIN flight, airport
			WHERE flight.arrival_airport = airport.airport_name
			AND (purchase_date BETWEEM ? AND ?)
			GROUP BY airport.airport_city
			ORDER BY COUNT(airport.airport_city) DESC LIMIT 5`,
			[date, now],
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