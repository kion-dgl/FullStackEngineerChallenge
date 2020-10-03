"use strict";

/**
 * Imports
 **/

const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const uuidv4 = require('uuid').v4;
const uniqid = require('uniqid');
const bcrypt = require('bcrypt');

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');

/** 
 * Initialize Application
 **/

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(session({
	secret: 'wjIcoqihx1',
	resave: false,
	saveUninitialized: false,
	cookie : {
		maxAge : 3600000
	}
}));

const admin_avatar = fs.readFileSync('admin_avatar.base64').toString();

/**
 * Initialize Database
 **/

const db = new sqlite3.Database('./db.sqlite', function() {

	console.log("initialize database");

	const schema = [
		`
			CREATE TABLE IF NOT EXISTS dat_employees (
				employee_uuid VARCHAR(36) NOT NULL UNIQUE,
				company_email VARCHAR(255) NOT NULL,
				display_name VARCHAR(255) NOT NULL,
				position VARCHAR(255) NOT NULL,
				avatar TEXT NOT NULL,
				password_text VARCHAR(255) NOT NULL,
				password_hash VARCHAR(255) NOT NULL,
				created_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
				removed_on TIMESTAMP NULL DEFAULT NULL
			)
		`,
		`
			CREATE TABLE IF NOT EXISTS dat_reviews (
				review_uuid VARCHAR(36) NOT NULL UNIQUE,
				employee_uuid VARCHAR(36) NOT NULL,
				display_name VARCHAR(255) NOT NULL,
				avatar TEXT NOT NULL,
				title VARCHAR(255) NOT NULL,
				rating TINYINT NOT NULL,
				review TEXT NOT NULL,
				created_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
				updated_on TIMESTAMP NULL DEFAULT NULL
			)
		`,
		`
			CREATE TABLE IF NOT EXISTS dat_comments (
				review_uuid VARCHAR(36) NOT NULL,
				display_name VARCHAR(255) NOT NULL,
				avatar TEXT NOT NULL,
				comment TEXT NOT NULL,
				created_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
			)
		`
	];

	schema.forEach(function(sql) {
		db.run(sql);
	});

});

/**
 * Listen on Port
 **/

const port = 4000;
app.listen(port, function() {
	console.log("App is listening on port: %d", port);
});


app.post('/api/v1/addEmployee', async function(req, res) {

	
	let employee_uuid = uuidv4();
	let password_text = uniqid();
	let password_hash;

	try {
		password_hash = await asyncHash(password_text);
	} catch(err) {
		throw err;
	}

	let sql = `
		INSERT INTO dat_employees (
			employee_uuid,
			company_email,
			display_name,
			position,
			avatar,
			password_text,
			password_hash
		) VALUES (
			?,
			?,
			?,
			?,
			?,
			?,
			?
		)
	`;

	const args = [
		employee_uuid,
		req.body.company_email,
		req.body.display_name,
		req.body.position,
		req.body.avatar,
		password_text,
		password_hash
	];
	
	try {
		await asyncQuery('insert', sql, args);
	} catch(err) {
		throw err;
	}

	res.json({
		err : 0,
		data : {
			employee_uuid : employee_uuid,
			company_email : req.body.company_email,
			display_name : req.body.display_name,
			position : req.body.position,
			avatar : req.body.avatar,
			password_text : password_text,
			password_hash : password_hash
		}
	});

});


app.post('/api/v1/selectEmployees', async function(req, res) {

	
	let employee_uuid = uuidv4();
	let password_text = uniqid();
	let password_hash;

	try {
		password_hash = await asyncHash(password_text);
	} catch(err) {
		throw err;
	}

	let sql = `
		SELECT
			employee_uuid,
			company_email,
			display_name,
			position,
			avatar,
			password_text,
			password_hash
		FROM
			dat_employees
		WHERE
			removed_on IS NULL
		ORDER BY
			created_on DESC
	`;
	
	let rows;
	try {
		rows = await asyncQuery('selectAll', sql, []);
	} catch(err) {
		throw err;
	}

	res.json({
		err : 0,
		data : rows
	});

});


app.post('/api/v1/removeEmployee', async function(req, res) {

	
	let sql = `
		UPDATE
			dat_employees
		SET
			removed_on = datetime('now')
		WHERE
			employee_uuid = ?
	`;
	
	try {
		await asyncQuery('update', sql, [req.body.employee_uuid]);
	} catch(err) {
		throw err;
	}

	res.json({
		err : 0,
	});

});


app.post('/api/v1/createReview', async function(req, res) {

	let review_uuid = uuidv4();
	
	let sql = `
		INSERT INTO dat_reviews (
			review_uuid,
			employee_uuid,
			display_name,
			avatar,
			title,
			rating,
			review
		) VALUES (
			?,
			?,
			?,
			?,
			?,
			?,
			?
		)
	`;

	const args = [
		review_uuid,
		req.body.employee_uuid,
		req.body.display_name,
		req.body.avatar,
		req.body.title,
		req.body.rating,
		req.body.review
	];
	
	try {
		await asyncQuery('insert', sql, args);
	} catch(err) {
		throw err;
	}

	res.json({
		err : 0,
		data : review_uuid
	});

});

app.post('/api/v1/selectReviews', async function(req, res) {

	let sql = `
		SELECT
			review_uuid,
			display_name,
			avatar,
			title,
			rating,
			created_on
		FROM
			dat_reviews
		ORDER BY
			created_on DESC
	`;
	
	let rows;
	try {
		rows = await asyncQuery('selectAll', sql, []);
	} catch(err) {
		throw err;
	}

	res.json({
		err : 0,
		data : rows
	});

});

app.post('/api/v1/selectReview', async function(req, res) {

	let sql = `
		SELECT
			*
		FROM
			dat_reviews
		WHERE
			review_uuid = ?
		ORDER BY
			created_on DESC
	`;
	
	let row;
	try {
		row = await asyncQuery('select', sql, [req.body.review_uuid]);
	} catch(err) {
		throw err;
	}

	res.json({
		err : 0,
		data : row
	});

});

app.post('/api/v1/updateReview', async function(req, res) {

	let sql = `
		UPDATE
			dat_reviews
		SET
			updated_on = datetime('now'),
			title = ?,
			rating = ?,
			review = ?
		WHERE
			review_uuid = ?
	`;
	
	let args = [
		req.body.title,
		req.body.rating,
		req.body.review,
		req.body.review_uuid
	];

	try {
		await asyncQuery('update', sql, args);
	} catch(err) {
		throw err;
	}

	res.json({
		err : 0,
		data : null
	});

});

app.post('/api/v1/attemptLogin', async function(req, res) {

	console.log(req.body);

	if(req.body.username === 'admin' && req.body.password === 'admin') {

		if(req.body.remember_me) {
			req.session.cookie.maxAge = null;
		}

		req.session.data = {
			employee_uuid : "ADMIN_PLACEHOLDER_UUID",
			display_name : "Admin",
			position : "The Mighty Admin",
			role : "admin",
			avatar : admin_avatar
		}

		return res.json({
			err : 0,
			data : req.session.data
		});

	}

	let sql = `
		SELECT
			employee_uuid,
			display_name,
			position,
			avatar,
			password_hash
		FROM
			dat_employees
		WHERE
			company_email = ?
	`;

	let args = [ req.body.username ];
	let row;

	try {
		row = await asyncQuery('select', sql, args);
	} catch(err) {
		throw err;
	}

	if(!row) {
		return res.json({
			err : 1,
			data : "Username not found"
		});
	}

	let bool
	try {
		bool = await asyncCompare(req.body.password, row.password_hash);
	} catch(err) {
		throw err;
	}

	if(!bool) {
		return res.json({
			err : 1,
			data : "Wrong Password"
		});
	}

	delete row.password_hash;
	row.role = "employee";

	if(req.body.remember_me) {
		req.session.cookie.maxAge = null;
	}

	req.session.data = row;
	return res.json({
		err : 0,
		data : req.session.data
	});

});

app.post('/api/v1/checkSession', async function(req, res) {

	if(req.session.data) {

		res.json({
			err : 0,
			data : req.session.data
		});

	} else {

		res.json({
			err : 1,
			data : "Session not set"
		});

	}

});

app.post('/api/v1/endSession', async function(req, res) {

	req.session.destroy(function(err) {
		res.json({
			err: 0,
			data : null
		});
	});

});

app.post('/api/v1/leaveComment', async function(req, res) {

	let sql = `
		INSERT INTO dat_comments (
			review_uuid,
			display_name,
			avatar,
			comment
		) VALUES (
			?,
			?,
			?,
			?
		)
	`;

	let args = [
		req.body.review_uuid,
		req.session.data.display_name,
		req.session.data.avatar,
		req.body.comment
	];

	try {
		await asyncQuery('insert', sql, args);
	} catch(err) {
		throw err;
	}

	res.json({
		err : 0,
		data : {
			display_name : req.session.data.display_name,
			avatar : req.session.data.avatar,
			comment : req.body.comment
		}
	});

});

app.post('/api/v1/selectComments', async function(req, res) {

	let sql = `
		SELECT 
			display_name,
			avatar,
			comment
		FROM
			dat_comments
		WHERE
			review_uuid = ?
		ORDER BY
			created_on ASC
	`;

	let args = [
		req.body.review_uuid
	];


	let rows
	try {
		rows = await asyncQuery('selectAll', sql, args);
	} catch(err) {
		throw err;
	}

	res.json({
		err : 0,
		data : rows
	});

});

/**
 * Promise Functions
 **/

function asyncHash(myPlaintextPassword) {
	
	return new Promise (function( resolve, reject) {

		const saltRounds = 10;
		bcrypt.genSalt(saltRounds, function(err, salt) {
			if(err) {
				return reject(err);
			}

			bcrypt.hash(myPlaintextPassword, salt, function(err, hash) {
				if(err) {
					return reject(err);
				}

				resolve(hash);
			});

		});

	});

}

function asyncCompare(myPlaintextPassword, hash) {

	return new Promise( function(resolve, reject) {

		bcrypt.compare(myPlaintextPassword, hash, function(err, result) {
			if(err) {
				return reject(err);
			}

			resolve(result);
		});

	});

}

function asyncQuery(type, sql, args) {

	return new Promise (function( resolve, reject) {
	
		switch(type) {
		case 'insert':
		case 'update':

			db.run (sql, args, function(err) {
				if(err) {
					return reject(err);
				}
				resolve(null);
			});

			break;
		case 'select':

			db.get(sql, args, function(err, row) {
				if(err) {
					return reject(err);
				}
				resolve(row);
			});

			break;
		case 'selectAll':

			db.all (sql, args, function(err, rows) {
				if(err) {
					return reject(err);
				}
				resolve(rows);
			});
			
			break;
		}

	});

}
