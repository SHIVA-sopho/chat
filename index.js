var app = require('express')();
var http = require('http').Server(app);
var IO = require('socket.io')(http);

app.get('/',function (req,res){

        
		res.sendFile(__dirname + '/views/index.html');

});

var username = "user";

IO.on('connection',function(socket){
	console.log('a user is connected');
	socket.on('disconnect',function(){
		console.log('user disconnected');
		socket.broadcast.emit('disconnected', username);

	});
	



	socket.on('chat message',function(user,msg){
		//console.log('message: '+msg);
 		username = user;
		socket.broadcast.emit('chat message', user,msg);
	});
});

http.listen(3000,function(){
	console.log('running on port 3000');
});

