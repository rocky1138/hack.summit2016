$(document).ready(function () {
  'use strict';
  var hrefValue = "",
      currentMousePos = { x: -1, y: -1},
      windowHeight =  $( window ).height();

  $("#update").click(function() {
    document.getElementById('pickup').play();
    var text = $('textarea#htmlcommand').val();
    $("div#sandbox").html(text);
    //console.log($("div#sandbox a").length)
    if($("div#sandbox a").length > 0){
      hrefValue = $("div#sandbox a").attr('href');
      console.log(hrefValue);
    }
    $('div#sandbox').children().addClass( "platform obstacle" ).hide().fadeIn(500);
  });

  /* Code for toggle Music */
  $('#music-button').click(function(){
    var volume = $('#music').attr('volume');
    if(volume === "1"){
      $('#music').prop('volume', 0);
      $('#music').attr('volume', 0);
    }
    if(volume === "0"){
      $('#music').prop('volume', 1);
      $('#music').attr('volume', 1);
    }
  });

  /* Code for mouse position tooltip */
  $(document).mousemove(function(event) {
    currentMousePos.x = event.pageX;
    currentMousePos.y = event.pageY;
    $('.tooltip').css('left', event.pageX + 10).css('top', event.pageY + 10).css('display', 'block');
    $('.tooltip').html( "X: " + currentMousePos.x + "px, Y: " + (windowHeight - currentMousePos.y) + "px" );
  });
});
