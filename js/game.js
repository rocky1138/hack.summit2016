// Functionality related to game logic, e.g., loading levels, points.
$(function () {

    'use strict';

    var storyPointsTimer,
		links = $('link[rel="import"]'),
		storyPoint = 0;

    // When stats object changes, run callback.
    watch (stats, function () {

        var level = links[stats.level].import;

        // Select and display our level.
        $('.game-window').html(level.querySelector('#level' + stats.level).innerHTML);
    });

    // Load level from save game or start at 0.
    stats.level = localStorage.getItem('level') || 0;
	
	// Only show the intro screen on the first level.
	if (parseInt(stats.level) === 0) {
		
		$('div#story').css('display', 'block');
		
		storyPointsTimer = setInterval(function () {
			
			$('div#storyText').append('<p>' + story[storyPoint] + '</p>');
			
			if (storyPoint++ > 3) {
				
				$('div#story > button').css('display', 'block');
				$('div#story > button').click(function () {
					$('div#story').css('display', 'none');
				});
				
				clearInterval(storyPointsTimer);
			}
		}, 100);
	}
});
