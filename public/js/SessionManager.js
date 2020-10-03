"use strict";

const SessionManager = (function() {

	this.MEM = {}

	this.DOM = {
		header : {
			role : document.getElementById('SessionManager.header.role'),
			logout : document.getElementById('SessionManager.header.logout')
		},
		nav : {
			avatar : document.getElementById('SessionManager.nav.avatar'),
			name : document.getElementById('SessionManager.nav.name'),
			position : document.getElementById('SessionManager.nav.position')
		},
		comment : {
			avatar : document.getElementById('SessionManager.comment.avatar'),
			name : document.getElementById('SessionManager.comment.name'),
		}
	}

	this.EVT = {
		handleLogoutClick : evt_handleLogoutClick.bind(this)
	}

	this.API = {
		checkSession : api_checkSession.bind(this),
		getSessionData : api_getSessionData.bind(this),
		initSession : api_initSession.bind(this),
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

	function api_initSession() {

		let session_data = this.MEM.session_data;
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

		this.DOM.nav.avatar.style.backgroundImage = 'url(' + session_data.avatar + ')';
		this.DOM.nav.name.textContent = session_data.display_name;
		this.DOM.nav.position.textContent = session_data.position;

		this.DOM.comment.avatar.style.backgroundImage = 'url(' + session_data.avatar + ')';
		this.DOM.comment.name.textContent = session_data.display_name;

	}

	function api_checkSession() {

		const ajax = new XMLHttpRequest();
		ajax.open("POST", "/api/v1/checkSession");
		ajax.setRequestHeader('Content-Type', 'application/json');
		ajax.responseType = 'json';
		ajax.send(JSON.stringify());

		ajax.onload = () => {
			
			let res;
			res = ajax.response;
			if(res.err) {
				window.location.href = "/";
			}

			this.MEM.session_data = res.data;
			this.API.initSession();

		}

	}

	function evt_handleLogoutClick(evt) {

		this.API.endSession();

	}

	function api_endSession() {

		const ajax = new XMLHttpRequest();
		ajax.open("POST", "/api/v1/endSession");
		ajax.setRequestHeader('Content-Type', 'application/json');
		ajax.responseType = 'json';
		ajax.send();

		ajax.onload = () => {
		
			window.location.href = "/";

		}


	}

}).apply({});
