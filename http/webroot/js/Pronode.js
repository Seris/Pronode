/**
 *
 * Pronode
 *
 **/

/** @namespace Pronode */
var Pronode = {};

/* Pronode Application */
(function () {
	/**
	 * Applications
	 * @var {Object} Applications
	 * @memberOf Pronode
	 */
	Pronode.Applications = [];

	/**
	 * Pronode Application
	 * @constructor
	 * @param name {string} - Application name
	 * @param app {Object} - Data provided by the Pronode Server
	 */
    Pronode.Application = function (name, data) {
        this.name = name;
        this.rawData = data;

        this.status = data.status;
        this.ressource = {
            cpu: data.cpu || '?',
            memory: data.memory || '?'
        };
        this.user = data.user || 'nobody';
        this.group = data.group || 'nogroup';

        Pronode.Applications.push(this);
    };

    /**
	 * Start application
	 */
    Pronode.Application.prototype.start = function () {
        Pronode.socket.emit('start application', this.name, function (err) {

        });
    };

    /**
	 * Stop application
     */
    Pronode.Application.prototype.stop = function () {
        Pronode.socket.emit('stop application', this.name, function (data) {

        });
    };


    /**
     * @constant {number}
     * @default
     */
    Pronode.Application.APPLICATION_RUN = 2;

    /**
     * @constant {number}
     * @default
     */
    Pronode.Application.APPLICATION_STOP = 1;

    /**
     * @constant {number}
     * @default
     */
    Pronode.Application.APPLICATION_ERROR = 0;
}).call(this);

/* Update Application Table */
(function(){
	/**
	 * Contain some DOM Elements
	 * @namespace DOM
	 * @memberOf Pronode
	 */
	Pronode.DOM = {};

	/**
	 * Application Table
	 * @var {Object} ApplicationTable
	 * @memberOf Pronode.DOM 
	 */
	Pronode.DOM.ApplicationTable = document.getElementById('application-table');

	/**
	 * Refresh Application Table
	 * @param applications {Pronode.Application[]} - Applications List
	 * @param [cleanTable=false] {boolean} - If true, the function will clean the table before append applications
	 */
	Pronode.ApplicationTable = function(applications, cleanTable){
		if(cleanTable){
			Pronode.DOM.ApplicationTable.querySelector('tbody').innerHTML = '';
		}

		for (var i = 0; i < applications.length; i++) {
			var app = applications[i];

			var row = document.createElement('tr'),
				name = document.createElement('td'),
				status = document.createElement('td'),
				statusLabel = document.createElement('span'),
				ressource = document.createElement('td'),
				user = document.createElement('td');

			name.innerHTML = app.name;

			statusLabel.classList.add('label');
			switch(app.status) {
				case Pronode.Application.APPLICATION_RUN:
					statusLabel.innerHTML = 'RUN';
					statusLabel.classList.add('label-success');
					row.classList.add('success');
					break;

				case Pronode.Application.APPLICATION_STOP:
					statusLabel.innerHTML = 'STOP';
					statusLabel.classList.add('label-active');
					row.classList.add('active');
					break;

				case Pronode.Application.APPLICATION_ERROR:
					statusLabel.innerHTML = 'ERROR';
					statusLabel.classList.add('label-danger');
					row.classList.add('danger');
					break;

				default:
					statusLabel.innerHTML = '?';
					statusLabel.classList.add('label-active');
					break;
			}

			user.innerHTML = app.user;

			row.appendChild(name);
			status.appendChild(statusLabel);
			row.appendChild(status);
			row.appendChild(user);

			Pronode.DOM.ApplicationTable.querySelector('tbody').appendChild(row);
		}
	};

	/**
	 * Sort Application Table by Name/User/Status
	 * @param by {String} - Sort the table by this argument
	 */
	Pronode.ApplicationTable.sortBy = function(by){
		switch(by.toLowerCase()){
			case 'name':
				Pronode.Applications.sort(function(a, b){
				    if(a.name < b.name) return -1;
				    if(a.name > b.name) return 1;
				    return 0;
				});
				break;

			case 'user':
				Pronode.Applications.sort(function(a, b){
				    if(a.user < b.user) return -1;
				    if(a.user > b.user) return 1;
				    return 0;
				});
				break;

			case 'status':
				Pronode.Applications.sort(function(a, b){
					if(a.status > b.status) return -1;
					if(a.status < b.status) return 1;
					return 0;
				});
				break;
				
		}
		Pronode.ApplicationTable(Pronode.Applications, true);
	};
}).call(this);
