$(function () {	
    console.log("javascript is running");
    var $window = $('window');
    var $firstpage = $('#firstpage');
    var $name_input = $('#name_input');
    var $mainpage = $('#mainpage');
    var $messages = $('#messages'); // messages log
    var $message_input = $('#message_input');//messages
    var socket = io();

    var username ;

function set_user()
{
  console.log("set_user called");
  username = $name_input.val();
  console.log($name_input.val());
  if(username)
  {
    $firstpage.fadeOut();
    $mainpage.show();
  }
  
  socket.emit('new_user_connected',username);
  $name_input.off('click');
}

    



 $('#name_input').keypress(function(event){

console.log("key down worked");
  if(event.which === 13)
  {
    console.log("its an enter key");
    set_user();
  }
 });

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
