"use strict";

const SessionManager = (function() {

	this.MEM = {}

	this.DOM = {
		header : {
			role : document.getElementById('SessionManager.header.role'),
			logout : document.getElementById('SessionManager.header.logout')
		}
	}

	this.EVT = {
		handleLogoutClick : evt_handleLogoutClick.bind(this)
	}

	this.API = {
		checkSession : api_checkSession.bind(this),
		getSessionData : api_getSessionData.bind(this),
		endSession : api_endSession.bind(this)
	}

	init.apply(this);
	return this;

	function init() {

		this.API.checkSession();
		this.DOM.header.logout.addEventListener('click', this.EVT.handleLogoutClick);

	}

	function api_getSessionData() {

		return this.MEM.session_data;

	}

	function api_checkSession() {

		/*
		const ajax = new XMLHttpRequest();
		ajax.open("POST", "/api/v1/getSession");
		ajax.setRequestHeader('Content-Type', 'application/json');
		ajax.responseType = 'json';
		ajax.send(JSON.stringify());

		ajax.onload = () => {

		}
		*/

		let session_data = {
			role : "admin"
		}
		this.MEM.session_data = session_data;

		PageManager.API.setRole(session_data.role);
		EmployeeManager.API.setRole(session_data.role);

		switch(session_data.role) {
		case "admin":
			this.DOM.header.role.textContent = "Admin";
			break;
		case "employee":
			this.DOM.header.role.textContent = "Employee";
			break;
		}

	}

	function evt_handleLogoutClick(evt) {

		this.API.endSession();

	}

	function api_endSession() {

		/*
		const ajax = new XMLHttpRequest();
		ajax.open("POST", "/api/v1/attemptLogin");
		ajax.setRequestHeader('Content-Type', 'application/json');
		ajax.responseType = 'json';
		ajax.send(JSON.stringify(params));

		ajax.onload = () => {

		}
		*/

		window.location.href = "/";

	}

}).apply({});
