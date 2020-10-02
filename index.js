"use strict";

/**
 * Imports
 **/

const express = require('express');
const bodyParser = require('body-parser');

/** 
 * Initialize Application
 **/

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

/**
 * Listen on Port
 **/

const port = 4000;
app.listen(port, function() {
	console.log("App is listening on port: %d", port);
});
