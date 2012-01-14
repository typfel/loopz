define(["underscore", "backbone", "Bullet", "Enemy"], function (_, Backbone, Bullet, Enemy) {
    
    var REFRESH_RATE = 5;
    
    var requestAnimFrame = (function () {
        return  window.requestAnimationFrame       ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame    ||
                window.oRequestAnimationFrame      ||
                window.msRequestAnimationFrame     ||
                function(callback, element) {
                    return window.setTimeout(callback, REFRESH_RATE);
                };
    })();
    
    var cancelRequestAnimFrame = (function () {
        return  window.cancelRequestAnimationFrame       ||
                window.webkitCancelRequestAnimationFrame ||
                window.mozCancelRequestAnimationFrame    ||
                window.oCancelRequestAnimationFrame      ||
                window.msCancelRequestAnimationFrame     ||
                function(handle) {
                    window.clearTimeout(handle);
                }
    })();
    
    var gameController = function(renderer) {
        this.renderer = renderer;
        this._lastTime = new Date().getTime();
        
        var tool = new paper.Tool();
        tool.onMouseDown = $.proxy(this.onMouseDown, this);
        tool.onMouseUp = $.proxy(this.onMouseUp, this);
        
        this.startGame();
        this.gameLoop();
    }
    
    _.extend(gameController.prototype, Backbone.Events, {
        
        gameLoop: function () {
            this._animHandle = requestAnimFrame($.proxy(this.gameLoop, this));
            var currentTime = new Date().getTime();
            var dt =  (currentTime - this._lastTime) / 1000.0;
            this._lastTime = currentTime;
            
            this.player.update(dt);
            
            this.enemies.forEach(function (enemy) {
                enemy.update(dt);
            });
            
            this.checkCollisions();
            
            this.renderer.draw();
        },
        
        startGame: function () {
            this.renderer.clear();
            this.counter = 0;
            $('#score-counter').html(this.counter);
            
            if (this.player) {
                this.player.unbind();
            }
            
            this.player = new Bullet(this.renderer.createTail(), 0, 160);
            this.player.bind('reachedRightSide', this.onPlayerReachedRightSide, this);
            this.player.bind('reachedLongSide', this.onPlayerReachedLongSide, this);
            this.enemies = [];
        },
        
        checkCollisions: function () {
            this.enemies.forEach(function (enemy) {
                var dx = this.player.position.x - enemy.position.x;
                var dy = this.player.position.y - enemy.position.y;
                var dst = Math.sqrt(dx * dx + dy * dy);
                
                if (dst < 10) {
                    this.onCollisionWithEnemy(enemy);
                } 
            }, this);
        },
        
        onCollisionWithEnemy: function (enemy) {
            this.startGame();
        },
        
        onPlayerReachedLongSide: function (player) {
            this.startGame();
        },
        
        onPlayerReachedRightSide: function (player) {
            this.counter += 1;
            $('#score-counter').html(this.counter);
            player.unbind();
            var enemy = new Enemy(this.renderer.createTail(), player.path);
            this.enemies.push(enemy);
            this.player = new Bullet(player.sprite, 0, this.player.position.y);
            this.player.bind('reachedRightSide', this.onPlayerReachedRightSide, this);
            this.player.bind('reachedLongSide', this.onPlayerReachedLongSide, this);
        },
        
        onMouseDown: function () {
            this.player.throttle = true;
        },
        
        onMouseUp: function () {
            this.player.throttle = false;
        }
        
    });
    
    return gameController;
});
