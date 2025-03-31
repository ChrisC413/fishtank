import { Entity } from './Entity.js';
import { WaterGenerator } from '../generators/WaterGenerator.js';
import { GroundGenerator } from '../generators/GroundGenerator.js';
import { Rock } from './Rock.js';

export class Aquarium {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width = 1000;
        this.height = canvas.height = 700;
        this.entities = {
            fish: [],
            plants: [],
            rocks: []
        };
        this.frameCount = 0;
        this.isRunning = false;
        this.lastFrameTime = 0;
        this.showGrid = false; // Grid is hidden by default
        
        // Initialize generators
        this.waterGenerator = new WaterGenerator();
        this.groundGenerator = new GroundGenerator();
        
        // Generate textures
        this.waterTexture = this.waterGenerator.generateWaterTexture(this.width, this.height);
        this.groundTexture = this.groundGenerator.generateGroundTexture(this.width, 100);
        
        console.log(`Aquarium initialized with dimensions: ${this.width}x${this.height}`);
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.lastFrameTime = performance.now();
            console.log("Animation loop started");
            requestAnimationFrame(this.update.bind(this));
        }
    }

    stop() {
        this.isRunning = false;
        console.log("Animation loop stopped");
    }

    update(currentTime) {
        if (!this.isRunning) return;

        // Calculate delta time for frame-rate independent motion
        const deltaTime = (currentTime - this.lastFrameTime) / 1000;
        this.lastFrameTime = currentTime;

        // Clear the canvas
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Draw background (water and gravel)
        this.drawBackground();

        // Update and draw all entities
        this.updateEntities(deltaTime);
        
        // Debug information every 100 frames
        if (this.frameCount % 100 === 0) {
            console.log(`Frame: ${this.frameCount}, Entities: ${this.entities.fish.length} fish, ${this.entities.plants.length} plants`);
        }

        // Increment frame counter
        this.frameCount++;

        // Request next frame
        requestAnimationFrame(this.update.bind(this));
    }

    drawBackground() {
        // Draw water texture
        this.ctx.drawImage(this.waterTexture, 0, 0);

        // Draw ground texture
        this.ctx.drawImage(this.groundTexture, 0, this.height - 100);
        
        // Draw grid lines for debugging, but only if the grid is enabled
        if (this.showGrid) {
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            this.ctx.lineWidth = 1;
            
            // Vertical grid lines
            for (let x = 0; x <= this.width; x += 100) {
                this.ctx.beginPath();
                this.ctx.moveTo(x, 0);
                this.ctx.lineTo(x, this.height);
                this.ctx.stroke();
                
                // Add coordinate labels
                if (x > 0) {
                    this.ctx.fillStyle = 'white';
                    this.ctx.font = '12px Arial';
                    this.ctx.fillText(x.toString(), x + 5, 15);
                }
            }
            
            // Horizontal grid lines
            for (let y = 0; y <= this.height; y += 100) {
                this.ctx.beginPath();
                this.ctx.moveTo(0, y);
                this.ctx.lineTo(this.width, y);
                this.ctx.stroke();
                
                // Add coordinate labels
                if (y > 0) {
                    this.ctx.fillStyle = 'white';
                    this.ctx.font = '12px Arial';
                    this.ctx.fillText(y.toString(), 5, y + 15);
                }
            }
        }
    }

    updateEntities(deltaTime) {
        // Update and draw rocks first (they're in the background)
        for (const rock of this.entities.rocks) {
            rock.update(deltaTime, this);
            rock.draw(this.ctx);
        }

        // Update and draw plants
        for (const plant of this.entities.plants) {
            plant.update(deltaTime, this);
            plant.draw(this.ctx);
        }

        // Update and draw fish last (they're in the foreground)
        for (const fish of this.entities.fish) {
            fish.update(deltaTime, this);
            fish.draw(this.ctx);
        }
    }

    addFish(fish) {
        this.entities.fish.push(fish);
        return fish;
    }

    addPlant(plant) {
        this.entities.plants.push(plant);
        console.log(`Added plant at position: ${plant.position.x}, ${plant.position.y}`);
    }

    addRock(rock) {
        this.entities.rocks.push(rock);
        console.log(`Added rock at position: ${rock.position.x}, ${rock.position.y}`);
    }

    removeEntity(entity) {
        if (entity.type === 'fish') {
            const index = this.entities.fish.indexOf(entity);
            if (index !== -1) {
                this.entities.fish.splice(index, 1);
            }
        } else if (entity.type === 'plant') {
            const index = this.entities.plants.indexOf(entity);
            if (index !== -1) {
                this.entities.plants.splice(index, 1);
            }
        } else if (entity.type === 'rock') {
            const index = this.entities.rocks.indexOf(entity);
            if (index !== -1) {
                this.entities.rocks.splice(index, 1);
            }
        }
    }

    getEntities() {
        return {
            fish: [...this.entities.fish],
            plants: [...this.entities.plants],
            rocks: [...this.entities.rocks]
        };
    }

    // Helper method to generate a random position within the aquarium
    getRandomPosition() {
        return {
            x: Math.random() * this.width,
            y: Math.random() * (this.height - 70) // Avoid spawning in the gravel
        };
    }

    // New method to toggle grid visibility
    toggleGrid() {
        this.showGrid = !this.showGrid;
        return this.showGrid;
    }

    clearFish() {
        this.entities.fish = [];
        console.log("All fish cleared from aquarium");
    }
} 