import { Entity } from './Entity.js';

export class Fish extends Entity {
    constructor(options = {}) {
        super(options);
        this.type = 'fish';
        
        // Fish specific properties
        this.baseShape = options.baseShape || 'oval';
        this.colors = options.colors || ['#FF6347'];
        this.appendages = options.appendages || {
            fins: [],
            tail: null,
            eyes: []
        };
        this.patterns = options.patterns || [];
        
        // Swimming behavior
        this.behavior = options.behavior || 'random';
        this.directionChangeTime = 0;
        this.directionChangeInterval = Math.random() * 2 + 1; // 1-3 seconds
        this.speed = options.speed || (Math.random() * 50 + 20); // 20-70 pixels per second
        this.facingRight = this.velocity.x >= 0;
        
        // Growth properties
        this.growth = options.growth || 0;
        this.maxSize = options.maxSize || { width: 60, height: 40 };
        
        // Increase fish size to ensure visibility
        this.size = options.size || { width: Math.random() * 30 + 40, height: Math.random() * 20 + 30 };
        
        // Generate initial velocity if not provided
        if (!options.velocity) {
            const angle = Math.random() * Math.PI * 2;
            this.velocity = {
                x: Math.cos(angle) * this.speed,
                y: Math.sin(angle) * this.speed * 0.5 // Less vertical movement
            };
        }
        
        console.log(`Fish created at position: ${this.position.x}, ${this.position.y} with size: ${this.size.width}x${this.size.height}`);
    }

    update(deltaTime, aquarium) {
        // Update facing direction based on velocity
        this.facingRight = this.velocity.x >= 0;
        
        // Random direction changes
        this.directionChangeTime += deltaTime;
        if (this.directionChangeTime >= this.directionChangeInterval) {
            this.changeDirection();
            this.directionChangeTime = 0;
            this.directionChangeInterval = Math.random() * 2 + 1; // 1-3 seconds
        }
        
        // Call base update method for physics and boundary checking
        super.update(deltaTime, aquarium);
    }

    draw(ctx) {
        ctx.save();
        
        // Translate to fish position
        ctx.translate(this.position.x, this.position.y);
        
        // Debug: draw a circle to mark the fish position
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(0, 0, 5, 0, Math.PI * 2);
        ctx.fill();
        
        // Flip if facing left
        if (!this.facingRight) {
            ctx.scale(-1, 1);
        }
        
        // Draw the fish body
        this.drawBody(ctx);
        
        // Draw appendages (fins, tail, eyes)
        this.drawAppendages(ctx);
        
        // Draw patterns
        this.drawPatterns(ctx);
        
        ctx.restore();
    }

    drawBody(ctx) {
        // Draw the main body shape
        ctx.fillStyle = this.colors[0];
        
        switch (this.baseShape) {
            case 'oval':
                // Draw oval fish body
                ctx.beginPath();
                ctx.ellipse(0, 0, this.size.width / 2, this.size.height / 2, 0, 0, Math.PI * 2);
                ctx.fill();
                break;
                
            case 'rectangle':
                // Draw rectangular fish body
                ctx.fillRect(-this.size.width / 2, -this.size.height / 2, this.size.width, this.size.height);
                break;
                
            case 'triangle':
                // Draw triangular fish body
                ctx.beginPath();
                ctx.moveTo(this.size.width / 2, 0);
                ctx.lineTo(-this.size.width / 2, -this.size.height / 2);
                ctx.lineTo(-this.size.width / 2, this.size.height / 2);
                ctx.closePath();
                ctx.fill();
                break;
                
            default:
                // Default to oval
                ctx.beginPath();
                ctx.ellipse(0, 0, this.size.width / 2, this.size.height / 2, 0, 0, Math.PI * 2);
                ctx.fill();
        }
    }

    drawAppendages(ctx) {
        // Draw tail
        if (this.appendages.tail) {
            const tail = this.appendages.tail;
            ctx.fillStyle = tail.color || this.colors[0];
            
            // Draw a triangular tail
            ctx.beginPath();
            ctx.moveTo(-this.size.width / 2, 0);
            ctx.lineTo(-this.size.width / 2 - tail.size.width, -tail.size.height / 2);
            ctx.lineTo(-this.size.width / 2 - tail.size.width, tail.size.height / 2);
            ctx.closePath();
            ctx.fill();
        }
        
        // Draw fins
        for (const fin of this.appendages.fins) {
            ctx.fillStyle = fin.color || this.colors[0];
            
            // Draw a triangular fin
            ctx.beginPath();
            ctx.moveTo(fin.position.x, fin.position.y);
            ctx.lineTo(fin.position.x, fin.position.y + fin.size.height);
            ctx.lineTo(fin.position.x - fin.size.width, fin.position.y + fin.size.height / 2);
            ctx.closePath();
            ctx.fill();
        }
        
        // Draw just one eye on the visible side due to perspective
        // Draw only the first eye from the eyes array
        if (this.appendages.eyes && this.appendages.eyes.length > 0) {
            const eye = this.appendages.eyes[0];
            
            // Draw eye outline
            ctx.fillStyle = eye.color || '#FFFFFF';
            ctx.beginPath();
            ctx.arc(eye.position.x, eye.position.y, eye.size, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw pupil
            ctx.fillStyle = '#000000';
            ctx.beginPath();
            ctx.arc(eye.position.x + eye.size * 0.3, eye.position.y, eye.size * 0.4, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    drawPatterns(ctx) {
        // Draw each pattern
        for (const pattern of this.patterns) {
            ctx.fillStyle = pattern.color || this.colors[1] || this.colors[0];
            
            switch (pattern.type) {
                case 'spots':
                    // Draw spots
                    for (const spot of pattern.spots) {
                        ctx.beginPath();
                        ctx.arc(spot.x, spot.y, spot.size, 0, Math.PI * 2);
                        ctx.fill();
                    }
                    break;
                    
                case 'stripes':
                    // Draw stripes
                    for (const stripe of pattern.stripes) {
                        ctx.fillRect(
                            stripe.x - stripe.width / 2,
                            stripe.y - stripe.height / 2,
                            stripe.width,
                            stripe.height
                        );
                    }
                    break;
            }
        }
    }

    changeDirection() {
        // Change fish direction randomly
        const angle = Math.random() * Math.PI * 2;
        this.velocity = {
            x: Math.cos(angle) * this.speed,
            y: Math.sin(angle) * this.speed * 0.5 // Less vertical movement
        };
    }
} 