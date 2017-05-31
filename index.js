var express = require('express');

var app = require('express')();

var http = require('http').Server(app);
var IO = require('socket.io')(http);

app.use(express.static(__dirname + '/views'));
/*app.get('/',function (req,res){

        
		res.sendFile(__dirname + '/views');

});*/ 
	
var users = {};
var numberOfUsers =0;

IO.on('connection',function(socket){
	console.log('a user is connected');
	if(socket.username)
	{
		console.log("page refreshed");
		delete  users[socket.username];
		numberOfUsers--;
		socket.broadcast.emit('disconnected', socket.username);	
	}
	socket.on('disconnect',function(){
		console.log(socket.username + ' disconnected');

		if(socket.username)
		{
			
			delete  users[socket.username];
			numberOfUsers--;
			socket.broadcast.emit('disconnected', socket.username);
		}

	});


    // checks new uer  connected if alredy presnt or not
	socket.on('new_user_connected',function(username,callback){
		console.log('new_user_connected and his name is ' + username);
		if(username in users )
		{
			console.log('user already present');
			callback(false);
		}
		else{
			console.log('he is really a new user');
			numberOfUsers++;
	    	socket.username = username;
	    	users[socket.username] = socket;   // saving my socket here for private messaging
	   		socket.broadcast.emit('connected', username);
	   		callback(Object.keys(users));
		}
    

	});
	
   // recives the message from client
	socket.on('chat message',function(message){
	
		socket.broadcast.emit('chat message',socket.username,message);
	});


   socket.on('pvt msg',function(message,callback){

   	var user = message.trim();
   	var index  = user.indexOf(' ');
   	console.log(index);
   	if(index != -1)
   	{
	   	user = user.substr(0,index);
	   	console.log(user);
	   	message = message.substr(index+1);
	   	console.log(message);
	   	if(user in users)
	   	{
	   		(users[user]).emit('pvt msg',socket.username,message);
	   	}
	   	else
	   	{
	   		callback('error! please enter a valid user');
	   	}
	}
	else{
		callback('error! please enter some message');
	}

   });
  

});

http.listen(3000,function(){
	console.log('running on port 3000');
});

