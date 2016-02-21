$(document).ready(function () {
  'use strict';
  $("#update").click(function() {
    document.getElementById('pickup').play();
    var text = $('textarea#htmlcommand').val();
    $("div#sandbox").hide().fadeIn(500);
    $("div#sandbox").html(text);
    console.log($("div#sandbox a").length)
  });
});
