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
            
            $('div#speech-bubble-text').html($(hints[0]).html());
            
            console.log(hints);
            
            $('span#speech-bubble-prev').click(function () {
                if (speechBubbleIndex > 0) {
                    
                    $('div#speech-bubble-text').html($(hints[--speechBubbleIndex]).html());
                    
                    $('span#speech-bubble-next').removeClass('faded');
                    
                    if (speechBubbleIndex === 0) {
                        $('span#speech-bubble-prev').addClass('faded');    
                    } else {
                        $('span#speech-bubble-prev').removeClass('faded');
                    }
                }
            });
            
            $('span#speech-bubble-next').click(function () {
                if (speechBubbleIndex < hints.length - 1) {
                    
                    $('div#speech-bubble-text').html($(hints[++speechBubbleIndex]).html());
                    
                    $('span#speech-bubble-prev').removeClass('faded');
                    
                    if (speechBubbleIndex == hints.length - 1) {
                        $('span#speech-bubble-next').addClass('faded');
                    } else {
                        $('span#speech-bubble-next').removeClass('faded');
                    }
                }
            })
            
        } else {
            $('div#speech-bubble').css('display', 'none');
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
				});
				
				clearInterval(storyPointsTimer);
			}
		}, 100);
	}
    
});