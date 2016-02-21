$(document).ready(function () {
  'use strict';
  var hrefValue = "";
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
    console.log(volume);
    if(volume === "1"){
      $('#music').prop('volume', 0);
      $('#music').attr('volume', 0);
    }
    if(volume === "0"){
      $('#music').prop('volume', 1);
      $('#music').attr('volume', 1);
    }
  });
});
