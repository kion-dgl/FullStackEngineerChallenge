"use strict";

const LoginManager = (function() {

	this.MEM = {}

	this.DOM = {
		form : {
			username : document.getElementById('LoginManager.form.username'),
			password : document.getElementById('LoginManager.form.password'),
			remember_me : document.getElementById('LoginManager.form.remember_me'),
			submit : document.getElementById('LoginManager.form.submit')
		}
	}

	this.EVT = {
		handleSubmitClick : evt_handleSubmitClick.bind(this)
	}

	this.API = {
		attemptLogin : api_attemptLogin.bind(this)
	};

	init.apply(this);
	return this;

	function init() {
		
		this.DOM.form.submit.addEventListener('click', this.EVT.handleSubmitClick);

	}

	function evt_handleSubmitClick(evt) {

		evt.preventDefault();
		this.API.attemptLogin();

	}

	function api_attemptLogin() {

		const params = {
			username : this.DOM.form.username.value,
			password : this.DOM.form.password.value,
			remember_me : this.DOM.form.remember_me.checked ? 1 : 0
		};
	
		/*
		const ajax = new XMLHttpRequest();
		ajax.open("POST", "/api/v1/attemptLogin");
		ajax.setRequestHeader('Content-Type', 'application/json');
		ajax.responseType = 'json';
		ajax.send(JSON.stringify(params));
	
		ajax.onload = () => {

		}
		*/

		window.location.href = "panel.html";

	}

}).apply({});
