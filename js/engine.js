$(function() {
    var guy = $('#guy'),
        colliders_selector = ".collider";
        obstacles_selector = ".obstacle",
        guy_height = guy.css('height');
        lastColDir = '',
        verticalVelocity = 1,
        horizontalVelocity = 0,
        arrowLeft = 37,
        arrowUp = 38,
        arrowRight = 39,
        arrowDown = 40;

    $(document).keydown(function(e) {
        console.log(e.keyCode);

        if (e.keyCode === arrowRight) {
            horizontalVelocity = 1;
        }
        if (e.keyCode === arrowLeft) {
            horizontalVelocity = -1;
        }
        if (e.keyCode === arrowUp && lastColDir == "S" ) {
            lastColDir = '';
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

        var collData = $(colliders_selector).collision(obstacles_selector, { relative: "collider", obstacleData: "odata", colliderData: "cdata", directionData: "ddata", as: "<div/>"} );
        var hits = $(colliders_selector).collision(obstacles_selector); //hacky above, blame richard

        verticalVelocity = verticalVelocity + (-9.81 * 0.028);
        if (hits.length === 0) {
            guy.css('top', guy.offset().top + (-1 * verticalVelocity) + 'px');
        } else {
            //console.dir(hits[0].id);
            //console.dir($(collData[0]).data("ddata"));
            lastColDir = $(collData[0]).data("ddata"); //for jumping

            if  (hits[0].id ==  "deathfield" ){
                verticalVelocity = 0;
                guy.css('top', 0);
                guy.css('left', 0);
                return;
            }

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
