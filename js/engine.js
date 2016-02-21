$(function () {
    
    'use strict';
    
    var fps = 30, // Set frame rate.
        cycleLength = Math.round(1000 / fps), // Length of one frame in ms.
        deltaTime = fps / 1000, // Length of one cycle in seconds.
        velocityScaler = 1, // A number to scale velocity with number of pixels.
        jumpVelocity = 6, // Jump velocity.
        moveVelocity = 6, // Walking veloicty.
        guy,
        colliders_selector = ".collider",
        obstacles_selector = ".obstacle",
        guy_height,
        lastColDir = '',
        verticalVelocity = 0,
        horizontalVelocity = 0,
        arrowLeft = 37,
        arrowUp = 38,
        arrowRight = 39,
        arrowDown = 40,
        currentLevel = 0;

    $('#level0').css('display', 'block');
        
    // place guy
    $('.game-window').append('<div class="collider" id="guy" style="top: 100px;background-color: rgba(0, 0, 0, 0);"><div class="collider" id="horizontalCollider" style="height: 15px; width: 16px; background-color: blue;"></div></div>');
    guy = $('#guy');
    guy_height = guy.height();

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
        }
        else if (e.keyCode === arrowLeft) {
            keyMap.left = true;

            if (keyMap.right) {
                keyMap.right = false;
            }
        }
        else if (e.keyCode === arrowUp) {
            keyMap.up = true;
        }
    });

    // Watch for keyup event. Log key as no longer pressed.
    $(document).keyup(function (e) {
        if (e.keyCode === arrowRight) {
            keyMap.right = false;
        }
        else if (e.keyCode === arrowLeft) {
            keyMap.left = false;
        }
        else if (e.keyCode === arrowUp) {
            keyMap.up = false;
        }
    });
    
    // Get collision direction (if any) from both vertical and horizontal colliders. 
    // Returns string including all directions with collisions.
    function getCollisionDirections() {
        // Get collider data, specifically the direction of collision and the obstacle collided with.
        var horizontalCollider = $('#horizontalCollider.collider').collision(obstacles_selector, { 
            relative: "#horizontalCollider", 
            obstacleData: "odata", 
            directionData: "ddata", 
            as: "<div/>"
        }),
        verticalCollider = $('#guy.collider').collision(obstacles_selector, { 
            relative: "#guy", 
            obstacleData: "odata", 
            directionData: "ddata", 
            as: "<div/>"
        }),
        collisions = '';

        // Get all vertical collider collisions.
        for (var i = 0; i < verticalCollider.length; i++) {
            collisions += $(verticalCollider[i]).data('ddata');
        }

        // Remove left and right direction collisions for vertical collider.
        collisions = collisions.replace("W", "");
        collisions = collisions.replace('E', '');

        // Get all horizontal collider collisions.
        for (var i = 0; i < horizontalCollider.length; i++) {
            collisions += $(horizontalCollider[i]).data('ddata');
        } 
        
        return collisions;
    }

    /* RENDER SECTION */
    // Frames are rendering using setInterval set to interval equal to the cycle length.
    // Set the FPS to set how often a frame is rendered.
    // Rendering is divided into three sections: input constraint, simulation, and update.
    setInterval(function () {
        // Input Constraint - in this section, check for collisions and use them to constrain the input.
        // First, get all collision directions.
        var collisions = getCollisionDirections();

        // Jump is only allowed if player is standing on some platform (collision at bottom).
        if (keyMap.up && collisions.indexOf('S') != -1) {
            verticalVelocity = jumpVelocity;
        }
        else {
            // If no up collision below player, continue falling.
            // Gravity calculated using vNew = vOld + (gravity * deltaTime).
            verticalVelocity += -9.81 * deltaTime;
        }

        // Going left or right is allowed as long as no collison on left.
        if (keyMap.left && collisions.indexOf('W') === -1) {
            horizontalVelocity = -1 * moveVelocity;
        }
        else if (keyMap.right && collisions.indexOf('E') === -1) {
            horizontalVelocity = moveVelocity;
        }
        else {
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

        // Set trajectory collider length (height).
        guy.css('height', guy_height + (-1 * verticalVelocity * velocityScaler) + 'px');

        // The horiontal position is slightly simpler, since it does not accelerate. It is highly unlikely,
        // next to impossible, for it to skip over an entire obstacle. Thus, no need for trajectory.

        // Move the player to the next horizontal position.
        guy.css('left', guy.offset().left + (velocityScaler * horizontalVelocity) + 'px');

        // Reevaluate collision to check for new collisions in the next frame.
        collisions = getCollisionDirections();

        // If there is a bottom collision.
        if (collisions.indexOf('S') != -1) {
            // Get collided obstacle using vertical collider.
            var collData = $('#guy.collider').collision(obstacles_selector, { 
                relative: "#guy", 
                obstacleData: "odata", 
                directionData: "ddata", 
                as: "<div/>"
            });

            var bottomLimit = 0;
            for (var i = 0; i < collData.length; i++) {
                if (parseFloat($(collData[i]).css('top').replace('px', '')) > bottomLimit) {
                    bottomLimit = parseFloat($(collData[i]).css('top').replace('px', ''));
                }
            }

            // No more downwards velocity.
            verticalVelocity = 0;

            // Set player position.
            guy.css('top', guy.offset().top + bottomLimit - (guy_height - 1) + 'px');
        }
        else {
            // If there is no bottom collision, just set player position based on velocity.
            guy.css('top', guy.offset().top + (-1 * velocityScaler * verticalVelocity) + 'px');
        }

        // For left and right collisions.
        if (collisions.indexOf('W') != -1) {
            var collData = $('#horizontalCollider.collider').collision(obstacles_selector, { 
                relative: "#horizontalCollider", 
                obstacleData: "odata", 
                directionData: "ddata", 
                as: "<div/>"
            });

      
                var leftLimit = parseFloat($(collData[0]).css('width').replace('px', ''));
                for (var i = 1; i < collData.length; i++) {
                    if (parseFloat($(collData[i]).css('width').replace('px', '')) < leftLimit) {
                        leftLimit = parseFloat($(collData[i]).css('width').replace('px', ''));
                    }
                }

                guy.css('left', guy.offset().left + leftLimit + 'px');
            
        }
        else if (collisions.indexOf('E') != -1) {
            var collData = $('#horizontalCollider.collider').collision(obstacles_selector, { 
                relative: "#horizontalCollider", 
                obstacleData: "odata", 
                directionData: "ddata", 
                as: "<div/>"
            });

            if (collData[0]) {
                var leftLimit = guy_height - parseFloat($(collData[0]).css('left').replace('px', ''));
                for (var i = 1; i < collData.length; i++) {
                    if (guy_height - parseFloat($(collData[0]).css('left').replace('px', '')) < leftLimit) {
                        leftLimit = guy_height - parseFloat($(collData[0]).css('left').replace('px', ''));
                    }
                }
            }
            
            guy.css('left', guy.offset().left - leftLimit + 'px');
        }
    }, cycleLength);
});
