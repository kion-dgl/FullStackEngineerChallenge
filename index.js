"use strict";

/**
 * Imports
 **/

const sqlite3 = require('sqlite3').verbose();
const uuidv4 = require('uuid').v4;
const uniqid = require('uniqid');
const bcrypt = require('bcrypt');

const express = require('express');
const bodyParser = require('body-parser');

/** 
 * Initialize Application
 **/

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));


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
