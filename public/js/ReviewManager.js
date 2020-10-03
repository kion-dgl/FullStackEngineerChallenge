"use strict";

const ReviewManager = (function() {

	this.MEM = {}

	this.DOM = {
		modal : {
			container : document.getElementById('ReviewManager.modal.container'),
			employee_uuid : document.getElementById('ReviewManager.modal.employee_uuid'),
			rating : document.getElementById('ReviewManager.modal.rating'),
			title : document.getElementById('ReviewManager.modal.title'),
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
		handleReviewCancelClick : evt_handleReviewCancelClick.bind(this),
		handleViewReviewClick : evt_handleViewReviewClick.bind(this)
	}

	this.API = {
		selectReviewList : api_selectReviewList.bind(this),
		renderReviewList : api_renderReviewList.bind(this)
	}

	init.apply(this);
	return this;

	function init() {

		this.DOM.reviews.add.addEventListener('click', this.EVT.handleReviewAddClick);
		this.DOM.modal.cancel.addEventListener('click', this.EVT.handleReviewCancelClick);
		this.DOM.modal.accept.addEventListener('click', this.EVT.handleReviewAcceptClick);

		this.API.selectReviewList();

	}

	function evt_handleReviewAddClick(evt) {
		
		let employees = EmployeeManager.API.getEmployees();
		this.MEM.employees = employees;
		this.DOM.modal.employee_uuid.innerHTML = `
			<option value='none'>Select an Employee</option>
		`;

		employees.forEach(employee => {
			const option = document.createElement('option');
			option.setAttribute('value', employee.employee_uuid);
			option.textContent = employee.display_name;
			this.DOM.modal.employee_uuid.appendChild(option);
		});

		this.DOM.modal.rating.selectedIndex = 0;
		this.DOM.modal.textarea.value = '';
		this.DOM.modal.title.value = '';
		this.DOM.modal.container.classList.add('open');

	}

	function evt_handleReviewCancelClick() {
		
		this.DOM.modal.container.classList.remove('open');

	}

	function evt_handleReviewAcceptClick(evt) {

		let errs = [];

		if(this.DOM.modal.employee_uuid.value === 'none') {
			errs.push('Please select an employee to rate');	
		}

		if(this.DOM.modal.rating.value === 'none') {
			errs.push('Please select a rating for this employee');	
		}

		if(errs.length) {
			return alert(errs.join('\n'));
		}

		const params = {
			employee_uuid : this.DOM.modal.employee_uuid.value,
			rating : this.DOM.modal.rating.value,
			title : this.DOM.modal.title.value,
			review : this.DOM.modal.textarea.value
		}

		for(let i = 0; i < this.MEM.employees.length; i++) {
			if(this.MEM.employees[i].employee_uuid !== params.employee_uuid) {
				continue;
			}
			params.avatar = this.MEM.employees[i].avatar;
			params.display_name = this.MEM.employees[i].display_name;
			break;
		}

		const ajax = new XMLHttpRequest();
		ajax.open("POST", "/api/v1/createReview");
		ajax.setRequestHeader('Content-Type', 'application/json');
		ajax.responseType = 'json';
		ajax.send(JSON.stringify(params));

		ajax.onload = () => {
			
			this.API.selectReviewList();
			this.DOM.modal.container.classList.remove('open');

		}

	}

	function api_selectReviewList() {

		const ajax = new XMLHttpRequest();
		ajax.open("POST", "/api/v1/selectReviews");
		ajax.setRequestHeader('Content-Type', 'application/json');
		ajax.responseType = 'json';
		ajax.send();

		ajax.onload = () => {
			
			this.API.renderReviewList(ajax.response.data);

		}

	}

	function api_renderReviewList( list ) {

		console.log("render review list");

		this.DOM.reviews.list.innerHTML = '';
		list.forEach( review => {

			const li = document.createElement("li");
			li.setAttribute("class", "tbody");

			const table = document.createElement("table");
			const row = table.insertRow();

			const cell_0 = row.insertCell();
			const cell_1 = row.insertCell();
			const cell_2 = row.insertCell();
			const cell_3 = row.insertCell();
			const cell_4 = row.insertCell();

			cell_0.setAttribute("class", "img");
			cell_1.setAttribute("class", "name");
			cell_2.setAttribute("class", "title");
			cell_3.setAttribute("class", "password");
			cell_4.setAttribute("class", "remove");

			const avatar = document.createElement("div");
			avatar.setAttribute("class", "avatar");
			avatar.style.backgroundImage = 'url(' + review.avatar + ')';
			cell_0.appendChild(avatar);

			let node1 = document.createTextNode(review.display_name);
			let node2 = document.createTextNode(review.created_on);

			cell_1.appendChild(node1);
			cell_1.appendChild(document.createElement('br'));
			cell_1.appendChild(node2);

			cell_2.textContent = review.title;
			cell_3.textContent = review.rating;

			const button = document.createElement("button");
			button.userData = review;
			button.textContent = "View";
			button.addEventListener('click', this.EVT.handleViewReviewClick);
			cell_4.appendChild(button);

			li.appendChild(table);
			this.DOM.reviews.list.appendChild(li);

		});

	}

	function evt_handleViewReviewClick(evt) {
		
		let elem = evt.target;
		let userData = elem.userData;

		if(!userData) {
			return;
		}
		
		CommentManager.API.openReview(userData.review_uuid);

	}

}).apply({});
