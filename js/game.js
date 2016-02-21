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
	
	storyPointsTimer = setInterval(function () {
		
		$('div#storyText').append('<p>' + story[storyPoint] + '</p>');
		
		if (storyPoint++ > 3) {
			
			$('div#story > button').css('display', 'block');
			$('div#story > button').click(function () {
				$('div#story').css('display', 'none');
			});
			
			clearInterval(storyPointsTimer);
		}
	}, 1500);
});
