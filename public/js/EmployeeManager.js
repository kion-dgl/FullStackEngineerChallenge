"use strict";

const EmployeeManager = (function() {

	this.MEM = {}

	this.DOM = {
		modal : {
			container : document.getElementById('EmployeeManager.modal.container'),
			company_email : document.getElementById('EmployeeManager.modal.company_email'),
			display_name : document.getElementById('EmployeeManager.modal.display_name'),
			position : document.getElementById('EmployeeManager.modal.position'),
			avatar : document.getElementById('EmployeeManager.modal.avatar'),
			cancel : document.getElementById('EmployeeManager.modal.cancel'),
			accept : document.getElementById('EmployeeManager.modal.accept')
		},
		form : {
			add : document.getElementById('EmployeeManager.form.add'),
			list :document.getElementById('EmployeeManager.form.list')
		}
	}

	this.EVT = {
		handleEmployeeAddClick : evt_handleEmployeeAddClick.bind(this),
		handleModalCancelClick : evt_handleModalCancelClick.bind(this),
		handleModalAcceptClick : evt_handleModalAcceptClick.bind(this)
	}

	this.API = {}

	init.apply(this);
	return this;

	function init() {
		
		this.DOM.form.add.addEventListener('click', this.EVT.handleEmployeeAddClick);
		this.DOM.modal.cancel.addEventListener('click', this.EVT.handleModalCancelClick);
		this.DOM.modal.accept.addEventListener('click', this.EVT.handleModalAcceptClick);

	}

	function evt_handleEmployeeAddClick(evt) {

		this.DOM.modal.container.classList.add('open');

	}

	function evt_handleModalCancelClick(evt) {

		this.DOM.modal.container.classList.remove('open');

	}

	function evt_handleModalAcceptClick(evt) {

		this.DOM.modal.container.classList.add('open');

		const params = {
			company_email : this.DOM.modal.company_email.value,
			display_name : this.DOM.modal.display_name.value,
			position : this.DOM.modal.position.value,
			avatar : this.DOM.modal.avatar.value
		}
		
		/*
		const ajax = new XMLHttpRequest();
		ajax.open("POST", "/api/v1/addEmployee");
		ajax.setRequestHeader('Content-Type', 'application/json');
		ajax.responseType = 'json';
		ajax.send(JSON.stringify(params));

		ajax.onload = () => {

		}
		*/
		
		this.DOM.modal.company_email.value = '';
		this.DOM.modal.display_name.value = '';
		this.DOM.modal.position.value = '';
		this.DOM.modal.avatar.value = '';
		this.DOM.modal.container.classList.remove('open');

	}


}).apply({});
