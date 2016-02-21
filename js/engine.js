$(function () {
    
    'use strict';
    
    var fps = 30, // Set frame rate.
        cycleLength = Math.round(1000 / fps), // Length of one frame in ms.
        deltaTime = fps / 1000, // Length of one cycle in seconds.
        velocityScaler = 1, // A number to scale velocity with number of pixels.
        jumpVelocity = 6, // Jump velocity.
        moveVelocity = 6, // Walking veloicty.
        colliders_selector = ".collider",
        obstacles_selector = ".obstacle",
        guy_height = guy.css('height'),
        lastColDir = '',
        verticalVelocity = 0,
        horizontalVelocity = 0,
        arrowLeft = 37,
        arrowUp = 38,
        arrowRight = 39,
        arrowDown = 40,
        currentLevel = 0;
 
    /* INPUT SECTION */
    // Keymap is used to keep track of which button currently pressed.
    // This allows for multiple keys to be registered at once.
    var keyMap = {
        up: false,
        left: false,
        right: false
    }

    // Watch for keydown event. Log key as pressed.
    $(document).keydown(function (e) {
        if (e.keyCode === arrowRight) {
            keyMap.right = true;

            if (keyMap.left) {
                keyMap.left = false;
            }
        } else if (e.keyCode === arrowLeft) {
            keyMap.left = true;

            if (keyMap.right) {
                keyMap.right = false;
            }
        } else if (e.keyCode === arrowUp) {
            keyMap.up = true;
        }
    });

    // Watch for keyup event. Log key as no longer pressed.
    $(document).keyup(function (e) {
        if (e.keyCode === arrowRight) {
            keyMap.right = false;
        } else if (e.keyCode === arrowLeft) {
            keyMap.left = false;
        } else if (e.keyCode === arrowUp) {
            keyMap.up = false;
        }
    });
    
    var getHorizontalCollisions = function () {
            return $('#horizontalCollider.collider').collision(obstacles_selector, { 
                    relative: "#horizontalCollider", 
                    obstacleData: "odata", 
                    directionData: "ddata", 
                    as: "<div/>"
                });            
        },
        
        getVerticalCollisions = function () {
            return $('#guy.collider').collision(obstacles_selector, { 
                    relative: "#guy", 
                    obstacleData: "odata", 
                    directionData: "ddata", 
                    as: "<div/>"
                });
        },
    
        // Get collision direction (if any) from both vertical and horizontal colliders. 
        // Returns string including all directions with collisions.
        getCollisionDirections = function (collisionsHorizontal, collisionsVertical) {
            
            var collisionDirections = '';
            
            // Get all vertical collider collisions.
            for (var i = 0; i < collisionsVertical.length; i++) {
                collisionDirections += $(collisionsVertical[i]).data('ddata');
            }

            // Remove left and right direction collisions for vertical collider.
            collisionDirections = collisionDirections.replace("W", "");
            collisionDirections = collisionDirections.replace('E', '');

            // Get all horizontal collider collisions.
            for (var i = 0; i < collisionsHorizontal.length; i++) {
                collisionDirections += $(collisionsHorizontal[i]).data('ddata');
            } 
            
            return collisionDirections;
        },
        
        getCollisionsSimple = function () {
            return $(colliders_selector).collision(obstacles_selector);
        },
        
        resetPlayerPos = function () {
            guy.css('top', $($('.obstacle.platform')[0]).css('top'));
            guy.css('left', '100px');
        };
    

    /* RENDER SECTION */
    // Frames are rendering using setInterval set to interval equal to the cycle length.
    // Set the FPS to set how often a frame is rendered.
    // Rendering is divided into three sections: input constraint, simulation, and update.
    setInterval(function () {
        
        var collisionsHorizontal = getHorizontalCollisions(),
            collisionsVertical = getVerticalCollisions(),
            
            // Simple collisions don't tell us the direction, but this way
            // we can get access to the classname and id of the object which it
            // collided against.
            collisionsSimple = getCollisionsSimple(),
        
            // Input Constraint - in this section, check for collisions and use them to constrain the input.
            // First, get all collision directions.
            collisionDirections = getCollisionDirections(collisionsHorizontal, collisionsVertical),

            oldLeft,
            oldTop;

            //console.log('1: ' + collisionDirections);
            
        // Jump is only allowed if player is standing on some platform (collision at bottom).
        if (keyMap.up && collisionDirections.indexOf('S') != -1) {
            verticalVelocity = jumpVelocity;
            guy.css('top', guy.offset().top + (-1 * velocityScaler * verticalVelocity) + 'px');
        } else {
            // If no up collision below player, continue falling.
            // Gravity calculated using vNew = vOld + (gravity * deltaTime).
            verticalVelocity += -9.81 * deltaTime;
        }

        // Going left or right is allowed as long as no collison on left.
        if (keyMap.left && collisionDirections.indexOf('W') === -1) {
            horizontalVelocity = -1 * moveVelocity;
        } else if (keyMap.right && collisionDirections.indexOf('E') === -1) {
            horizontalVelocity = moveVelocity;
        } else {
            // If there are no left or right arrow key press, then no vertical movement.
            horizontalVelocity = 0;
        }

        // Simulation - Simulate next frame using current velocities to see if collisions will happen.
        // Update trajectory collider. The player object uses two seperate colliders: vertical and horizontal.
        // This is due to the fact that with gravity, the player may eventually accelerate so fast that they can
        // completed pass through an obstacle in a single frame without every colliding with it.
        // The vertical collider is implemented such that it represents trajectory.
        // It extends from the player's current position to its next position (based on velocity).
        // This way, any obstacles passed in between will be detected in collision detection.
        
        // Save old positions in case we need to go back.
        oldLeft = guy.offset().left,
        oldTop = guy.offset().top;
        
        // Set trajectory collider length (height).
        guy.css('height', guy_height + (-1 * verticalVelocity * velocityScaler) + 'px');

        // The horizontal position is slightly simpler, since it does not accelerate. It is highly unlikely,
        // next to impossible, for it to skip over an entire obstacle. Thus, no need for trajectory.

        // Move the player to the next horizontal position.
        guy.css('left', guy.offset().left + (velocityScaler * horizontalVelocity) + 'px');

        // Re-evaluate collision to check for new collisions in the next frame.
        collisionsHorizontal = getHorizontalCollisions();
        collisionsVertical = getVerticalCollisions();
        collisionDirections = getCollisionDirections(collisionsHorizontal, collisionsVertical);
     
        //console.log('2:' + collisionDirections);
        
        // Did the player hit the goal?
        if (collisionsSimple.length > 0) {
            if (collisionsSimple[0].id === 'goal') {
                //document.getElementById('next_level').play();
                resetPlayerPos();
                localStorage.setItem("level", stats.level);
                stats.level++;
                return;
            }
        
            // Did the player ded?
            if (collisionsSimple[0].className.indexOf('deathfield') != -1) {
                //document.getElementById('death').play();
                verticalVelocity = 0;
                resetPlayerPos();
                return;
            }
        }
     
        if (collisionDirections.indexOf('W') != -1 || collisionDirections.indexOf('E') != -1 || collisionDirections.indexOf('Inside') != -1) {
            
            /*
            //console.log(parseFloat($(collisionsHorizontal[0]).css('width')));
            
            var leftLimit = parseFloat($(collisionsHorizontal[0]).css('width').replace('px', ''));
            
            console.log('Left collision');
                
            for (var i = 1; i < collisionsHorizontal.length; i++) {
                if (parseFloat($(collisionsHorizontal[i]).css('width').replace('px', '')) < leftLimit) {
                    leftLimit = parseFloat($(collisionsHorizontal[i]).css('width').replace('px', ''));
                }
            }

            guy.css('left', guy.offset().left + leftLimit + 'px');
            */
            guy.css('left', oldLeft);
        /*
        } else if (collisionDirections.indexOf('E') != -1) {
            
            var leftLimit = guy_height - parseFloat($(collisionsHorizontal[0]).css('left').replace('px', ''));
            
            console.log('Right collision');
            
            for (var i = 1; i < collisionsHorizontal.length; i++) {
                if (guy_height - parseFloat($(collisionsHorizontal[0]).css('left').replace('px', '')) < leftLimit) {
                    leftLimit = guy_height - parseFloat($(collisionsHorizontal[0]).css('left').replace('px', ''));
                }
            }
            
            guy.css('left', guy.offset().left - leftLimit + 'px');
            */
            guy.css('left', oldLeft);
            
        } else if (collisionDirections.indexOf('S') != -1) {

        /*
            var bottomLimit = 0;
        
            console.log('On ground.');
            
            for (var i = 0; i < collisionsVertical.length; i++) {
                if (parseFloat($(collisionsVertical[i]).css('top').replace('px', '')) > bottomLimit) {
                    bottomLimit = parseFloat($(collisionsVertical[i]).css('top').replace('px', ''));
                }
            }

            verticalVelocity = 0;

            guy.css('top', guy.offset().top + bottomLimit - (guy_height - 1) + 'px');
            */
            guy.css('top', oldTop);
            
            
                
        } else {
            guy.css('top', guy.offset().top + (-1 * velocityScaler * verticalVelocity) + 'px');
        }
    }, cycleLength);
});