// Functionality related to game logic, e.g., loading levels, points.
$(function () {

    'use strict';

    var links = $('link[rel="import"]');

    // When stats object changes, run callback.
    watch (stats, function () {

        var level = links[stats.level].import;

        // Select and display our level.
        $('.game-window').html(level.querySelector('#level' + stats.level).innerHTML);
    });

    stats.level = 4;
});

$('.game-window').append('<div style="position:absolute;width:400px;bottom:0;height:100px;"></div>');
