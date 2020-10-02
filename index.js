"use strict";

/**
 * Imports
 **/

const sqlite3 = require('sqlite3').verbose();
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


app.post('/api/v1/addEmployee', function(req, res) {

	console.log(req.body);
	
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

	];

	db.run(sql, args, function(err) {
		if(err) {
			throw err;
		}

		res.json({

		});
	});


});
