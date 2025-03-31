import { Entity } from './Entity.js';

export class Rock extends Entity {
    constructor(options = {}) {
        super(options);
        this.type = 'rock';
        
        // Rock specific properties
        this.colors = options.colors || ['#8B4513'];
        this.points = options.points || [];
        
        // Rocks don't move
        this.velocity = { x: 0, y: 0 };

        // Collision boundary is lower than visual height to allow fish to swim over
        this.collisionHeight = this.size.height * 0.7; // 70% of visual height
    }

    update(deltaTime, aquarium) {
        // Rocks don't update or move
        return;
    }

    draw(ctx) {
        ctx.save();
        
        // Translate to rock position
        ctx.translate(this.position.x, this.position.y);
        
        // Draw the rock body
        this.drawBody(ctx);
        
        ctx.restore();
    }

    drawBody(ctx) {
        // Draw the main rock shape using the irregular polygon points
        ctx.fillStyle = this.colors[0];
        
        // Create the path from points
        ctx.beginPath();
        if (this.points.length > 0) {
            ctx.moveTo(this.points[0].x, this.points[0].y);
            for (let i = 1; i < this.points.length; i++) {
                ctx.lineTo(this.points[i].x, this.points[i].y);
            }
            ctx.closePath();
            ctx.fill();
        }
    }

    // Override the collision check to use the reduced height
    checkCollision(other) {
        if (other.type === 'fish') {
            // Use the reduced collision height for fish
            const rockTop = this.position.y - this.collisionHeight;
            const rockBottom = this.position.y;
            const rockLeft = this.position.x - this.size.width / 2;
            const rockRight = this.position.x + this.size.width / 2;

            const fishTop = other.position.y - other.size.height / 2;
            const fishBottom = other.position.y + other.size.height / 2;
            const fishLeft = other.position.x - other.size.width / 2;
            const fishRight = other.position.x + other.size.width / 2;

            return !(fishLeft > rockRight || 
                    fishRight < rockLeft || 
                    fishBottom < rockTop || 
                    fishTop > rockBottom);
        }
        return false;
    }
} 