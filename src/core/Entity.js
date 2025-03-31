export class Entity {
    constructor(options = {}) {
        this.id = Math.random().toString(36).substring(2, 15);
        this.position = options.position || { x: 0, y: 0 };
        this.velocity = options.velocity || { x: 0, y: 0 };
        this.size = options.size || { width: 30, height: 20 };
        this.color = options.color || '#FFFFFF';
        this.type = 'entity'; // Base type, should be overridden
    }

    update(deltaTime, aquarium) {
        // Basic physics: update position based on velocity
        this.position.x += this.velocity.x * deltaTime;
        this.position.y += this.velocity.y * deltaTime;

        // Boundary checking (keep within aquarium)
        this.checkBoundaries(aquarium);
    }

    draw(ctx) {
        // Basic drawing, to be overridden by subclasses
        ctx.fillStyle = this.color;
        ctx.fillRect(
            this.position.x - this.size.width / 2,
            this.position.y - this.size.height / 2,
            this.size.width,
            this.size.height
        );
    }

    checkBoundaries(aquarium) {
        // Ensure the entity stays within the aquarium boundaries
        // Left boundary
        if (this.position.x < this.size.width / 2) {
            this.position.x = this.size.width / 2;
            this.velocity.x *= -1; // Reverse direction
        }
        
        // Right boundary
        if (this.position.x > aquarium.width - this.size.width / 2) {
            this.position.x = aquarium.width - this.size.width / 2;
            this.velocity.x *= -1; // Reverse direction
        }
        
        // Top boundary
        if (this.position.y < this.size.height / 2) {
            this.position.y = this.size.height / 2;
            this.velocity.y *= -1; // Reverse direction
        }
        
        // Bottom boundary (above gravel)
        const gravelTop = aquarium.height - 50; // Gravel height is 50
        if (this.position.y > gravelTop - this.size.height / 2) {
            this.position.y = gravelTop - this.size.height / 2;
            this.velocity.y *= -1; // Reverse direction
        }
    }

    // Check collision with another entity
    collidesWith(entity) {
        const dx = this.position.x - entity.position.x;
        const dy = this.position.y - entity.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        return distance < (this.size.width / 2 + entity.size.width / 2);
    }
} 