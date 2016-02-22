// Functionality related to game logic, e.g., loading levels, points.
$(function () {

    'use strict';

    var hints,
        storyPointsTimer,
        speechBubbleTimer,
		links = $('link[rel="import"]'),
		storyPoint = 0,
        speechBubbleIndex = 0;

    // When stats object changes, run callback.
    watch (stats, function () {

        var level = links[stats.level].import;

        // Select and display our level.
        $('.game-window').html(level.querySelector('#level' + stats.level).innerHTML);
        
        // Kick off any speech bubbles.
        hints = $('.game-window .hint');
        
        if (hints.length > 0) {
            $('div#speech-bubble').html($(hints[speechBubbleIndex++]).children());
        }
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
                    
                    speechBubbleTimer = setInterval(function () {
                        
                        $('div#speech-bubble').html($(hints[speechBubbleIndex++]).children());
                        
                        if (speechBubbleIndex === hints.length) {
                            setTimeout(function () {
                                $('div#speech-bubble').fadeOut(500);
                                clearInterval(speechBubbleTimer);
                            }, 3500);
                        }
                    }, 3500);
				});
				
				clearInterval(storyPointsTimer);
			}
		}, 100);
	}
    
});