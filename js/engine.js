$(function() {
    var guy = $('#guy'),
        colliders_selector = ".collider";
        obstacles_selector = ".obstacle";
        guy_height = guy.css('height');
        verticalVelocity = 1;
        horizontalVelocity = 0,
        arrowLeft = 37,
        arrowUp = 38,
        arrowRight = 39,
        arrowDown = 40;

    $(document).keydown(function(e) {
        console.log(e.keyCode);

        if (e.keyCode === arrowRight) {
            horizontalVelocity = 1;
        } else if (e.keyCode === arrowLeft) {
            horizontalVelocity = -1;
        } else if (e.keyCode === arrowUp && verticalVelocity < 0 ) {
            verticalVelocity = 5;
        }
    });

    $(document).keyup(function (e) {
        horizontalVelocity = 0;
    });

    $('#input').change(function () {
        $('#sandbox').html($('#input').val());
    });

    // Gravity
    setInterval(function () {

        var hits = $(colliders_selector).collision(obstacles_selector);

        verticalVelocity = verticalVelocity + (-9.81 * 0.028);
        if (hits.length === 0) {
            guy.css('top', guy.offset().top + (-1 * verticalVelocity) + 'px');
        } else {
            if  (hits[0].id ==  "deathfield" ){
                verticalVelocity = 0;
                guy.css('top', 0);
                guy.css('left', 0);
                return;
            }
            console.log(hits);

            if (verticalVelocity < 0) {
                guy.css('top', $(hits[0]).offset().top - guy_height);
            } else {
                guy.css('top', guy.offset().top + (-1 * verticalVelocity) + 'px');
            }
        }

        if (horizontalVelocity != 0) {
            guy.css('left', guy.offset().left + (3 * horizontalVelocity) + 'px');
        }
    }, 28);
});
