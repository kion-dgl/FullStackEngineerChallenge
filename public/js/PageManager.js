"use strict";

const PageManager = (function() {

	this.MEM = {}

	this.DOM = {
		menu : {
			employees : document.getElementById('PageManager.menu.employees'),
			reviews : document.getElementById('PageManager.menu.reviews')
		},
		page : {
			employees : document.getElementById('PageManager.page.employees'),
			reviews : document.getElementById('PageManager.page.reviews'),
			comments : document.getElementById('PageManager.page.comments')
		}
	}

	this.EVT = {
		handleMenuClick : evt_handleMenuClick.bind(this)
	}

	this.API = {
		setRole : api_setRole.bind(this),
		openPage : api_openPage.bind(this)
	}

	init.apply(this);
	return this;

	function init() {

		for(let key in this.DOM.menu) {
			this.DOM.menu[key].addEventListener('click', this.EVT.handleMenuClick);
		}

	}

	function evt_handleMenuClick(evt) {
		
		let elem = evt.target;
		let id = elem.getAttribute("id");
		let leaf = id.split(".").pop();
			
		for(let key in this.DOM.menu) {
			this.DOM.menu[key].classList.remove("active");
		}
		elem.classList.add("active");
		this.API.openPage(leaf);

	}

	function api_setRole(role) {

		switch(role) {
		case "admin":
			this.DOM.menu.employees.classList.add("active");
			this.DOM.page.employees.classList.remove("hide");
			break;
		case "employee":
			this.DOM.menu.employees.style.display = "none";
			this.DOM.menu.reviews.classList.add("active");
			this.DOM.page.reviews.classList.remove("hide");
			break;
		}

	}

	function api_openPage(leaf) {
			
		for(let key in this.DOM.page) {
			this.DOM.page[key].classList.add("hide");
		}
		this.DOM.page[leaf].classList.remove("hide");

	}

}).apply({});
