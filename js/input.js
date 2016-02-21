$(document).ready(function () {
  'use strict';
  $("#update").click(function() {
    document.getElementById('pickup').play();
    var text = $('textarea#htmlcommand').val();
    $("div#sandbox").html(text);
    $('div#sandbox').children().addClass( "platform obstacle" ).hide().fadeIn(500);
  });
});
