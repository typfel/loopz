define(["jquery", "underscore", "backbone"], function ($, _, Backbone) {
    
    var ANGLE_SPEED = 0.8;
    var THROTTLE_ANGLE_SPEED = 1.1;
    var TAIL_LENGTH = 20;
    
    var bullet = function (sprite, x, y) {
        sprite.removeSegments();
        this.sprite = sprite;
        this.angle = 0;
        this.path = [];
        
        this.position = {
            x: x,
            y: y
        };
        
        this.velocity = {
            x: 10,
            y: 0
        };
    }
    
    _.extend(bullet.prototype, Backbone.Events, {
        
        update: function (dt) {
            if (this.throttle) {
                if (this.angle > -Math.PI / 2)
                    this.angle -= THROTTLE_ANGLE_SPEED * dt;
            } else {
                if (this.angle < Math.PI / 2)
                    this.angle += ANGLE_SPEED * dt;
            }
            
            this.throttling = false;
            
            this.velocity.x = 100 * Math.cos(this.angle);
            this.velocity.y = 100 * Math.sin(this.angle);
            
            this.position.x += this.velocity.x * dt;
            this.position.y += this.velocity.y * dt;
            
            this.updateTail();
            /*
            this.sprite.position = new paper.Point(this.position.x, this.position.y);
            */
            
            this.path.push({ x: this.position.x, y: this.position.y });
            
            if (this.position.x > 1024) {
                this.trigger("reachedRightSide", this);
            }
            
            if (this.position.y < 0 || this.position.y > 320) {
                this.trigger("reachedLongSide", this);
            }
        },
        
        updateTail: function () {
            this.sprite.add(new paper.Point(this.position.x, this.position.y));
            if (this.sprite.segments.length > TAIL_LENGTH) {
                this.sprite.removeSegment(0);
            }
        }
    });
    
    return bullet;
});