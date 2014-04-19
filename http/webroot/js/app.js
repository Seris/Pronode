/**
*
* Pronode
*
**/

(function(){
	Pronode.ApplicationTable([
		new Pronode.Application('Wavechat', {user: 'apply', group: 'apply', status: 1}),
		new Pronode.Application('Music Updater', {user: 'radiobrony', group: 'radiobrony', status: 0}),
		new Pronode.Application('Live', {user: 'radiobrony', group: 'radiobrony', status: 2}),
		new Pronode.Application('MumbleBot', {user: 'seris', group: 'seris', status: 1}),
		new Pronode.Application('SerisApp', {user: 'seris', group: 'seris', status: 2})
	], true);
}).call(this);

