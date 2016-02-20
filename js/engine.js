var colliders_selector = ".collider";
var obstacles_selector = ".obstacle";
var guy_height = $('#guy').css('height');
var verticalVelocity = 1;
var horizontalVelocity = 0;

$(document).keydown(function(e) {
    console.log(e.keyCode);

    if (e.keyCode === 39) {
        horizontalVelocity = 1;
    }
    else if (e.keyCode === 37) {
        horizontalVelocity = -1;
    }
    else if (e.keyCode === 38) {
        verticalVelocity = 5;
    }
});

$(document).keyup(function(e) {
    horizontalVelocity = 0;
});

$('#input').change(function() {
    $('#sandbox').html($('#input').val());
});

// Gravity 
setInterval(function() {
    var hits = $(colliders_selector).collision(obstacles_selector);
    verticalVelocity = verticalVelocity + (-9.81 * 0.028);

    if (hits.length === 0) {
        $('#guy').css('top', $('#guy').offset().top + (-1 * verticalVelocity) + 'px');
    }
    else {
        console.log(hits);

        if (verticalVelocity < 0) {
            $('#guy').css('top', $(hits[0]).offset().top - guy_height);
        }
        else {
            $('#guy').css('top', $('#guy').offset().top + (-1 * verticalVelocity) + 'px');
        }
    }

    if (horizontalVelocity != 0) {
        $('#guy').css('left', $('#guy').offset().left + (3 * horizontalVelocity) + 'px');
    }
}, 28);