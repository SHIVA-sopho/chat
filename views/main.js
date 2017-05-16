$(function () {	
    var socket = io();

 // emits message when form is  submitted   
    $('form').submit(function(){
      
      socket.emit('chat message', $('#name').val() ,$('#m').val());
      $('#m').val('');
   
      

      return false;
    });


    //user typing feature

   

// recives messages emited by server
    socket.on('chat message', function(user,msg){
    	$('#messages').append($	('<li>').text(user + ': ' + msg));
    });
     socket.on('connected', function(username){
    	$('#messages').append($	('<li>').text(username+ ' connected'));
    });
    socket.on('disconnected', function(username){
    	$('#messages').append($	('<li>').text(username+ ' disconnected'));
    });

  });
