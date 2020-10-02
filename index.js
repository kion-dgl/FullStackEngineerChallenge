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

	console.log(req.body);
	
	let employee_uuid = uuidv4();
	let password_text = uniqid();

	let password_hash;

	try {
		password_hash = await asyncHash(password_hash);
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
	
		let stmt;

		switch(type) {
		case 'insert':
		case 'update':
			stmt.run;
			break;
		case 'select':
			stmt.get;
			break;
		case 'selectAll':
			stmt.all;
			break;
		}

		stmt(sql, args, function(err, res) {
			if(err) {
				return reject(err);
			}

			resolve(res);
		});

	});

}
