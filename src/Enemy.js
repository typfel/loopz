define(["jquery", "underscore", "backbone"], function ($, _, Backbone) {
    
    var TAIL_LENGTH = 40;
    
    var enemy = function (sprite, path) {
        this.sprite = sprite;
        this.path = path;
        this.steps = path.length;
        this.reset();
    }
    
    _.extend(enemy.prototype, Backbone.Events, {
        
        update: function (dt) {
            if (this.step == this.steps + TAIL_LENGTH) {
                this.reset();
            }
            
            this.step += 1;
            
            if (this.step < this.steps) {
                this.position.x = 1024 - this.path[this.step].x;
                this.position.y = this.path[this.step].y;            
                this.sprite.add(new paper.Point(this.position.x, this.position.y));
            }
            
            if (this.sprite.segments.length > TAIL_LENGTH || this.step >= this.steps) {
                this.sprite.removeSegment(0);
            }
        },
        
        reset: function () {
            this.step = 0;
            this.sprite.removeSegments();
            this.position = { x: 1024 - this.path[this.step].x, y: this.path[this.step].y };
            this.sprite.add(new paper.Point(this.position.x, this.position.y));
        }
    });
    
    return enemy;
});