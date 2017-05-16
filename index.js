var express = require('express');

var app = require('express')();

var http = require('http').Server(app);
var IO = require('socket.io')(http);

app.use(express.static(__dirname + '/views'));
/*app.get('/',function (req,res){

        
		res.sendFile(__dirname + '/views');

});*/

var username = "user";	

IO.on('connection',function(socket){
	console.log('a user is connected');
	socket.broadcast.emit('connected', socket.username);
	socket.on('disconnect',function(){
		console.log(username + ' disconnected');
		socket.broadcast.emit('disconnected', socket.username);

	});
	
   // recives the message from client
	socket.on('chat message',function(user,msg){
		//console.log('message: '+msg);
 		username = user;
 		socket.username = user;
 		// broad casts the message to other clients
		socket.broadcast.emit('chat message', user,msg);
	});

   // user typing broadcast
  

});

http.listen(3000,function(){
	console.log('running on port 3000');
});

