"use strict";

const ReviewManager = (function() {

	this.MEM = {}

	this.DOM = {
		modal : {
			container : document.getElementById('ReviewManager.modal.container'),
			employee_uuid : document.getElementById('ReviewManager.modal.employee_uuid'),
			rating : document.getElementById('ReviewManager.modal.rating'),
			textarea : document.getElementById('ReviewManager.modal.textarea'),
			cancel : document.getElementById('ReviewManager.modal.cancel'),
			accept : document.getElementById('ReviewManager.modal.accept')
		},
		reviews : {
			list : document.getElementById('ReviewManager.reviews.list'),
			add : document.getElementById('ReviewManager.reviews.add')
		}
	}

	this.EVT = {
		handleReviewAddClick : evt_handleReviewAddClick.bind(this),
		handleReviewAcceptClick : evt_handleReviewAcceptClick.bind(this),
		handleReviewCancelClick : evt_handleReviewCancelClick.bind(this)
	}

	this.API = {}

	init.apply(this);
	return this;

	function init() {

		this.DOM.reviews.add.addEventListener('click', this.EVT.handleReviewAddClick);
		this.DOM.modal.cancel.addEventListener('click', this.EVT.handleReviewCancelClick);
		this.DOM.modal.accept.addEventListener('click', this.EVT.handleReviewAcceptClick);

	}

	function evt_handleReviewAddClick(evt) {
		
		this.DOM.modal.container.classList.add('open');

	}

	function evt_handleReviewCancelClick() {
		
		this.DOM.modal.container.classList.remove('open');

	}

	function evt_handleReviewAcceptClick(evt) {

		this.DOM.modal.container.classList.remove('open');

	}

}).apply({});
