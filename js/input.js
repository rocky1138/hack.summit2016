$(document).ready(function () {
  'use strict';
  $("#update").click(function() {
    console.log("tty");
    var text = $('textarea#htmlcommand').val();
    $("div#sandbox").html(text);
  });
});


