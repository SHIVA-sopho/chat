$(function () {	
    console.log("javascript is running");
    var $window = $('window');
    var $firstpage = $('#firstpage');
    var $name_input = $('#name_input');
    var $usernameErr = $('#usernameErr');
    var $mainpage = $('#mainpage');
    var $messages = $('#messages'); // messages log
    var $message_input = $('#message_input');//messages
    var $message_form = $('#message_form'); // form to be submitted for sending a message
    var $users = $('#users'); // keeps track of whio all are online
    var socket = io();

var username;
// It is a function which is used to set username
function set_user()
{
  console.log("set_user called");
  username = $name_input.val();
  console.log(username);

  if(username)
  {
    socket.emit('new_user_connected',username ,function(data){
      if(data)
      {
        $firstpage.fadeOut();
        $mainpage.show();
        $name_input.off('click');
        $name_input.val('');
        $name_input.trigger('blur');

      }
      else
      {
        $name_input.val('');

        $usernameErr.html("user name already exists"); 

      }

    });

  }
   
}

    
 // seting up new user
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
      
     var message = $('#message_input').val();
     socket.emit('chat message', message);
     $('#message_input').val('');
     return false;
   
    });

  
   

// recives messages emited by server
    socket.on('chat message',function(user,msg){

      //console.log(user + ':' + msg);
    	$messages.append($	('<li>').text(user + ': ' + msg));
    });

     socket.on('connected', function(username){
    	$messages.append($	('<li>').text(username+ ' connected'));
      $users.append($ ('<li id='+username+'>').text(username));
    });

    socket.on('disconnected', function(username){
    	$messages.append($('<li>').text(username+ ' disconnected'));
      var $elem = $('#' +username);
      $elem.remove();
    });



      
  });
