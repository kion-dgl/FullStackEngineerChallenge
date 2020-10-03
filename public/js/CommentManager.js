"use strict";

const CommentManager = (function() {

	this.MEM = {}

	this.DOM = {
		span : {
			back : document.getElementById('CommentManager.span.back'),
			edit : document.getElementById('CommentManager.span.edit'),
			cancel : document.getElementById('CommentManager.span.cancel'),
			save : document.getElementById('CommentManager.span.save')
		},
		form : {
			title : document.getElementById('CommentManager.form.title'),
			name : document.getElementById('CommentManager.form.name'),
			rating : document.getElementById('CommentManager.form.rating'),
			review : document.getElementById('CommentManager.form.review')
		},
		comment : {
			textarea : document.getElementById('CommentManager.comment.textarea'),
			submit : document.getElementById('CommentManager.comment.submit'),
		}
	}

	this.EVT = {
		handleBackClick : evt_handleBackClick.bind(this),
		handleEditClick : evt_handleEditClick.bind(this),
		handleSaveClick : evt_handleSaveClick.bind(this),
		handleCancelClick : evt_handleCancelClick.bind(this)
	}

	this.API = {
		openReview : api_openReview.bind(this),
		resetView : api_resetView.bind(this),
		renderView : api_renderView.bind(this)
	}

	init.apply(this);
	return this;

	function init() {

		this.DOM.span.back.addEventListener('click', this.EVT.handleBackClick);
		this.DOM.span.edit.addEventListener('click', this.EVT.handleEditClick);
		this.DOM.span.cancel.addEventListener('click', this.EVT.handleCancelClick);
		this.DOM.span.save.addEventListener('click', this.EVT.handleSaveClick);

	}

	function evt_handleSaveClick(evt) {

		this.API.resetView();
		
		const params = {
			review_uuid : this.MEM.review.review_uuid,
			title : this.DOM.form.title.value,
			rating : this.DOM.form.rating.value,
			review : this.DOM.form.review.value
		}

		const ajax = new XMLHttpRequest();
		ajax.open("POST", "/api/v1/updateReview");
		ajax.setRequestHeader('Content-Type', 'application/json');
		ajax.responseType = 'json';
		ajax.send(JSON.stringify(params));

		ajax.onload = () => {

			ReviewManager.API.selectReviewList();

		}

	}

	function evt_handleCancelClick(evt) {

		this.API.resetView();
		this.API.renderView();

	}

	function evt_handleEditClick(evt) {

		this.DOM.span.edit.classList.add("hide");
		this.DOM.span.save.classList.remove("hide");
		this.DOM.span.cancel.classList.remove("hide");

		this.DOM.form.title.removeAttribute("readonly");
		this.DOM.form.rating.removeAttribute("disabled");
		this.DOM.form.review.removeAttribute("readonly");

	}

	function evt_handleBackClick(evt) {

		PageManager.API.openPage("reviews");

	}

	function api_resetView() {

		this.DOM.form.title.setAttribute("readonly", "readonly");
		this.DOM.form.name.setAttribute("readonly", "readonly");
		this.DOM.form.rating.setAttribute("disabled", "disabled");
		this.DOM.form.review.setAttribute("readonly", "readonly");

		let session_data = SessionManager.API.getSessionData();
		switch(session_data.role) {
		case "admin":
			this.DOM.span.edit.classList.remove("hide");
			break;
		default:
			this.DOM.span.edit.classList.add("hide");
			break;
		}

		this.DOM.span.save.classList.add("hide");
		this.DOM.span.cancel.classList.add("hide");

	}

	function api_openReview(review_uuid) {

		this.API.resetView();
		PageManager.API.openPage("comments");

		const params = {
			review_uuid : review_uuid
		}

		const ajax = new XMLHttpRequest();
		ajax.open("POST", "/api/v1/selectReview");
		ajax.setRequestHeader('Content-Type', 'application/json');
		ajax.responseType = 'json';
		ajax.send(JSON.stringify(params));

		ajax.onload = () => {

			let res = ajax.response;
			this.MEM.review = res.data;
			this.API.renderView();

		}

	}

	function api_renderView() {

		this.DOM.form.name.value = this.MEM.review.display_name;
		this.DOM.form.title.value = this.MEM.review.title;
		this.DOM.form.rating.value = this.MEM.review.rating;
		this.DOM.form.review.value = this.MEM.review.review;

	}

}).apply({});
