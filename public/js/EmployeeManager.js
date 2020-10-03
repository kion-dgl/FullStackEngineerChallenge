"use strict";

const EmployeeManager = (function() {

	this.MEM = {
		employees : []
	}

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
		handleModalAcceptClick : evt_handleModalAcceptClick.bind(this),
		handleRemoveClick : evt_handleRemoveClick.bind(this)
	}

	this.API = {
		getAvatarImage : api_getAvatarImage.bind(this),
		appendEmployee : api_appendEmployee.bind(this),
		setRole : api_setRole.bind(this),
		selectEmployees : api_selectEmployees.bind(this),
		getEmployees : api_getEmployees.bind(this)
	}

	init.apply(this);
	return this;

	function init() {
		
		this.DOM.form.add.addEventListener('click', this.EVT.handleEmployeeAddClick);
		this.DOM.modal.cancel.addEventListener('click', this.EVT.handleModalCancelClick);
		this.DOM.modal.accept.addEventListener('click', this.EVT.handleModalAcceptClick);

	}

	function evt_handleRemoveClick(evt) {

		let elem = evt.target;
		let userData = elem.userData;
		console.log(userData);

		if(!userData) {
			return;
		}

		let bool = confirm(`Are you sure you want to remove ${userData.display_name} ?`);
		if(!bool) {
			return;
		}

		let index = this.MEM.employees.indexOf(userData);
		this.MEM.employees.splice(index, 1);
		
		let params = {
			employee_uuid : userData.employee_uuid
		}

		const ajax = new XMLHttpRequest();
		ajax.open("POST", "/api/v1/removeEmployee");
		ajax.setRequestHeader('Content-Type', 'application/json');
		ajax.responseType = 'json';
		ajax.send(JSON.stringify(params));

		ajax.onload = () => {
			
			while(elem.parentNode && elem.tagName !== 'LI') {
				elem = elem.parentNode;
			}
			elem.parentNode.removeChild(elem);
			
		}

	}

	function api_getEmployees() {
		
		return this.MEM.employees;

	}

	function api_selectEmployees() {
		
		const ajax = new XMLHttpRequest();
		ajax.open("POST", "/api/v1/selectEmployees");
		ajax.setRequestHeader('Content-Type', 'application/json');
		ajax.responseType = 'json';
		ajax.send();

		ajax.onload = () => {

			let res = ajax.response;
			this.MEM.employees = res.data;
			this.MEM.employees.forEach( employee => {
				this.API.appendEmployee(employee);
			});

		}



	}

	function api_setRole(role) {

		if(role !== 'admin') {
			return;
		}

		this.API.selectEmployees();

	}

	function evt_handleEmployeeAddClick(evt) {

		this.DOM.modal.container.classList.add('open');

	}

	function evt_handleModalCancelClick(evt) {

		this.DOM.modal.container.classList.remove('open');

	}

	async function evt_handleModalAcceptClick(evt) {

		this.DOM.modal.container.classList.add('open');

		let img_src;

		try {
			img_src = await this.API.getAvatarImage();
		} catch(err) {
			throw err;
		}

		console.log(img_src);

		const params = {
			company_email : this.DOM.modal.company_email.value,
			display_name : this.DOM.modal.display_name.value,
			position : this.DOM.modal.position.value,
			avatar : img_src
		}
		
		const ajax = new XMLHttpRequest();
		ajax.open("POST", "/api/v1/addEmployee");
		ajax.setRequestHeader('Content-Type', 'application/json');
		ajax.responseType = 'json';
		ajax.send(JSON.stringify(params));

		ajax.onload = () => {
	
			let res = ajax.response;
			this.MEM.employees.push(res.data);
			this.API.appendEmployee(res.data);

			this.DOM.modal.company_email.value = '';
			this.DOM.modal.display_name.value = '';
			this.DOM.modal.position.value = '';
			this.DOM.modal.avatar.value = '';
			this.DOM.modal.container.classList.remove('open');

		}

	}

	function api_getAvatarImage() {

		return new Promise( (resolve, reject) => {

			let files = this.DOM.modal.avatar.files;
			if(!files.length) {
				return;
			}

			let file = files[0];
			let img = new Image;
			img.onload = () => {

				const canvas = document.createElement('canvas');
				const context = canvas.getContext('2d');
				canvas.width = 120;
				canvas.height = 120;
				context.drawImage(img, 0, 0, canvas.width, canvas.height);
				resolve(canvas.toDataURL());

			}

			img.src = URL.createObjectURL(file);

		});

	}

	function api_appendEmployee(employee) {

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
		avatar.style.backgroundImage = 'url(' + employee.avatar + ')';
		cell_0.appendChild(avatar);
		
		let node1 = document.createTextNode(employee.display_name);
		let node2 = document.createTextNode(employee.company_email);

		cell_1.appendChild(node1);
		cell_1.appendChild(document.createElement('br'));
		cell_1.appendChild(node2);

		cell_2.textContent = employee.position;
		cell_3.textContent = employee.password_text;

		const button = document.createElement("button");
		button.userData = employee;
		button.textContent = "Remove";
		button.addEventListener('click', this.EVT.handleRemoveClick);
		cell_4.appendChild(button);

		li.appendChild(table);
		this.DOM.form.list.appendChild(li);

	}


}).apply({});
