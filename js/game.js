window.addEventListener('WebComponentsReady', function(e) {

    // Functionality related to game logic, e.g., loading levels, points.
    $(function () {

        'use strict';

        var storyPointsTimer,
            storyPoint = 0;

        // When stats object changes, run callback.
        watch (stats, function () {

            var hints,
                speechBubbleIndex = 0,
                level = $('link[rel="import"]')[stats.level].import,
                onBubbleClose = function () {
                    if (speechBubbleIndex === hints.length - 1) {
                        playable = true;
                        $('span#speech-bubble-close').off('click', onBubbleClose);
                        $('span#speech-bubble-prev').off('click', onBubblePrev);
                        $('span#speech-bubble-next').off('click', onBubbleNext);
                        $('span#speech-bubble-close').addClass('faded');
                        $('div#speech-bubble').fadeOut(250);
                    }
                },
                onBubbleNext = function () {
                    if (speechBubbleIndex < hints.length - 1) {

                        $('div#speech-bubble-text').html($(hints[++speechBubbleIndex]).html());

                        $('span#speech-bubble-prev').removeClass('faded');

                        if (speechBubbleIndex == hints.length - 1) {
                            $('span#speech-bubble-next').addClass('faded');
                            $('span#speech-bubble-close').removeClass('faded');
                        } else {
                            $('span#speech-bubble-next').removeClass('faded');
                        }
                    }
                },
                onBubblePrev = function () {
                    if (speechBubbleIndex > 0) {

                        $('div#speech-bubble-text').html($(hints[--speechBubbleIndex]).html());

                        $('span#speech-bubble-next').removeClass('faded');

                        if (speechBubbleIndex === 0) {
                            $('span#speech-bubble-prev').addClass('faded');
                        } else {
                            $('span#speech-bubble-prev').removeClass('faded');
                            $('span#speech-bubble-close').addClass('faded');
                        }
                    }
                };


            // Select and display our level.
            $('.game-window').html(level.querySelector('#level' + stats.level).innerHTML);

            // Kick off any speech bubbles.
            hints = $('.game-window .hint');

            if (hints.length > 0) {
                playable = false;
                $('div#speech-bubble').fadeIn(250);

                if (hints.length === 1) {
                    $('span#speech-bubble-close').removeClass('faded');
                    $('span#speech-bubble-prev').addClass('faded');
                    $('span#speech-bubble-next').addClass('faded');
                } else {
                    $('span#speech-bubble-prev').addClass('faded');
                    $('span#speech-bubble-next').removeClass('faded');
                }

                $('div#speech-bubble-text').html($(hints[0]).html());

                $('span#speech-bubble-close').on('click', onBubbleClose);
                $('span#speech-bubble-prev').on('click', onBubblePrev);
                $('span#speech-bubble-next').on('click', onBubbleNext);

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
});
