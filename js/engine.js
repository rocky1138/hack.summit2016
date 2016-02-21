$(function () {
    
    'use strict';
    
    var guy,
        colliders_selector = ".collider",
        obstacles_selector = ".obstacle",
        guy_height,
        lastColDir = '',
        verticalVelocity = 1,
        horizontalVelocity = 0,
        arrowLeft = 37,
        arrowUp = 38,
        arrowRight = 39,
        arrowDown = 40,
        currentLevel = 0;

    $('#level0').css('display', 'block');
        
    // place guy
    $('.game-window').append('<div class="collider" id="guy"></div>');
    guy = $('#guy');
    guy_height = guy.css('height');

    $(document).keydown(function (e) {
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

            lastColDir = $(collData[0]).data("ddata"); //for jumping

            if (hits[0].className.indexOf('deathfield') > -1) {
                verticalVelocity = 0;
                guy.css('top', 0);
                guy.css('left', 0);
                return;
            }

            if (verticalVelocity < 0) {
                guy.css('top', $(hits[0]).offset().top - guy_height);
            } else {
                
                // FIXME For some reason this doesn't always put the player directly on top of the div.
                // The player sorta sinks halfway.
                guy.css('top', guy.offset().top + (-1 * verticalVelocity) + 'px');
            }
        }

        if (horizontalVelocity != 0) {
            guy.css('left', guy.offset().left + (3 * horizontalVelocity) + 'px');
        }
    }, 28);
});
