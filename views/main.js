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
var no_of_popups = 0;
var popups  =  [];

//creates popups
function create_popup(userid)
{
  var len = popups.length;
    for(var i=0;i < len;i++)
    {

      if(userid === popups[i])
      {
        popups.splice(i,1);
        popups.unshift(userid); //puts an element at the start of array
        diplay_popups();
      }

      

    }
}



// It is a function which is used to set username
function set_user()
{
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
        var len = data.length; // gives the length of the array

        for(i = 0 ; i < len; i++)
        {
        if(data[i]===username)
          continue;  
        console.log(i+' '+data[i]);
        $users.append($ ('<li id='+data[i]+'>').append($('<a href="javascript:create_popup()">').text('1' + data[i])));
        //$users.append($ ('<li id='+data[i]+'>').html('<a href="javascript:create_chatbox('+data[i]+');">'+data[i])+'</a>' );
        }


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
     var msg = message.trim();
    
     if(msg.substr(0,4) === '/pm ')
     {
      console.log('its a private message');
       message = message.substr(4);
       console.log(message);
      socket.emit('pvt msg',message,function(data){
      $messages.append($  ('<li class="err">').text(data));  
          
      });

     }
     else{
     socket.emit('chat message', message);
   }
     $('#message_input').val('');
     return false;
   
    });

  
   

// recives messages emited by server
    socket.on('chat message',function(user,msg){

      //console.log(user + ':' + msg);
    	$messages.append($	('<li class="gen_message">').text(user + ': ' + msg));
    });

     socket.on('connected', function(username){
    	$messages.append($	('<li >').text(username+ ' connected'));
      $users.append($ ('<li id='+username+'>').append($('<a href="javascript:create_chatbox()">').text(2+' '+username)));

      //$users.append($ ('<li id='+username+'>').text(username)); // idname same as username helps to identify the element
    });

    socket.on('disconnected', function(username){
    	$messages.append($('<li >').text(username+ ' disconnected'));
      var $elem = $('#' +username); 
      $elem.remove();
    });

    socket.on('pvt msg',function(user,msg){
      console.log('pvt_message recived');
      $messages.append($ ('<li class="pvt_message">').text(user+ ':' + msg));
    });




      
  });
