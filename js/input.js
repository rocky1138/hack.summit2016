$(document).ready(function () {
  'use strict';
  $("#update").click(function() {
    document.getElementById('pickup').play();
    var text = $('textarea#htmlcommand').val();
    $("div#sandbox").html(text);
    console.log($("div#sandbox a").length)
    $('div#sandbox').children().addClass( "platform obstacle" ).hide().fadeIn(500);
  });
});
