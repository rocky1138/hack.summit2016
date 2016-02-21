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

    // Load level from save game or start at 0.
    stats.level = localStorage.getItem('level') || 0;
});