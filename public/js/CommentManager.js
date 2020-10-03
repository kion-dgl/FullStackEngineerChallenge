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
		handleBackClick : evt_handleBackClick.bind(this)
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
		switch(session.role) {
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

	this.API.renderView() {

	}

}).apply({});
