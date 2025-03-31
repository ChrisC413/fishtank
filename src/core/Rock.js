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
} 