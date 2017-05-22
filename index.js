var express = require('express');

var app = require('express')();

var http = require('http').Server(app);
var IO = require('socket.io')(http);

app.use(express.static(__dirname + '/views'));
/*app.get('/',function (req,res){

        
		res.sendFile(__dirname + '/views');

});*/
	
var usernames = [];
var numberOfUsers =0;

IO.on('connection',function(socket){
	console.log('a user is connected');
	
	socket.on('disconnect',function(){
		console.log(socket.username + ' disconnected');

		if(socket.username)
			socket.broadcast.emit('disconnected', socket.username);

		var index = usernames.indexOf(socket.username);
		usernames.splice(index,1);

	});


    // checks new uer  connected if alredy presnt or not
	socket.on('new_user_connected',function(username,callback){
		console.log('new_user_connected and his name is ' + username);
		if(usernames.indexOf(username ) != -1)
		{
			console.log('user already present');
			callback(false);
		}
		else{
			console.log('call back true');
			
			numberOfUsers++;
	    	socket.username = username;
	   		usernames.push(username);
	   		socket.broadcast.emit('connected', username);
	   		socket.emit('update_users',username);
	   		callback(true);

		}
    

	});
	
   // recives the message from client
	socket.on('chat message',function(message){
		//console.log('message: '+message);
 		// broad casts the message to other clients

		socket.broadcast.emit('chat message',socket.username,message);
	});

   // user typing broadcast
  

});

http.listen(3000,function(){
	console.log('running on port 3000');
});

