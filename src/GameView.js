define(["jquery", "underscore", "backbone"], function ($, _, Backbone) {
    
    
    var gameView = function (container) {
        $(container).append('<canvas id="game-canvas" width="1024" height="320"></canvas>');
        paper.setup(document.getElementById('game-canvas'));
        this.view = paper.view;
        this.objects = [];
    }
    
    _.extend(gameView.prototype, Backbone.Events, {
        
        draw: function () {
            this.view.draw();
        },
        
        clear: function () {
            this.objects.forEach(function (object) {
                object.remove();
            });
            this.objects = [];
        },
        
        createBullet: function() {
            var bullet = new paper.Path.Circle([0,0], 3);
            bullet.fillColor = 'yellow';
            return bullet;
        },
        
        createEnemy: function () {
            var enemy = new paper.Path.Circle([0,0], 3);
            enemy.fillColor = 'red';
            return enemy;
        },
        
        createTail: function () {
            var tail = new paper.Path();
            tail.strokeColor = 'red';
            this.objects.push(tail);
            return tail;
        }
        
    });
    
    return gameView;
});