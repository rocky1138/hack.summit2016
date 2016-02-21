// Functionality related to game logic, e.g., loading levels, points.
$(function () {
    
    'use strict';
    
    var links = document.querySelector('link[rel="import"]');
    
    // Load first level.
    $('.game-window').html(links.import.querySelector('#level0').innerHTML);
    
});