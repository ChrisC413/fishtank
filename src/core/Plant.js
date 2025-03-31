import { Entity } from './Entity.js';

export class Plant extends Entity {
    constructor(options = {}) {
        super(options);
        this.type = 'plant';
        
        // Plant specific properties
        this.baseShape = options.baseShape || 'leaf';
        this.colors = options.colors || ['#228B22'];
        this.segments = options.segments || [];
        this.branches = options.branches || [];
        
        // Override velocity (plants don't move)
        this.velocity = { x: 0, y: 0 };
        
        // Growth properties
        this.growth = options.growth || 0;
        this.growthRate = options.growthRate || 0.05;
        this.maxSegments = options.maxSegments || 10;
        this.growthTimer = 0;
        this.growthInterval = options.growthInterval || 5; // Seconds between growth stages
        this.branchProbability = options.branchProbability || 0.3; // 30% chance to create a branch when growing
        
        // Ensure plant is positioned at the bottom of the tank
        this.position.y = options.position?.y || 650; // Always on the ground
        
        // Generate initial segments if not provided
        if (this.segments.length === 0) {
            this.addSegment();
        }
    }

    update(deltaTime, aquarium) {
        // Plants don't move but they can grow over time
        this.growthTimer += deltaTime;
        
        if (this.growthTimer >= this.growthInterval && this.segments.length < this.maxSegments) {
            this.grow();
            this.growthTimer = 0;
        }
        
        // Apply swaying effect to simulate water currents
        for (const segment of this.segments) {
            segment.offset.x = Math.sin(aquarium.frameCount * 0.02 + segment.position.y * 0.1) * 2;
        }
        
        // Apply swaying to branches too
        for (const branch of this.branches) {
            for (const segment of branch.segments) {
                segment.offset.x = Math.sin(aquarium.frameCount * 0.02 + segment.position.y * 0.1 + branch.offset) * 2;
            }
        }
        
        // Call base update method for any other behaviors
        super.update(deltaTime, aquarium);
    }

    draw(ctx) {
        // Draw each segment from bottom to top
        for (let i = 0; i < this.segments.length; i++) {
            const segment = this.segments[i];
            
            ctx.save();
            
            // Apply position and offset
            ctx.translate(
                this.position.x + segment.position.x + segment.offset.x,
                this.position.y - segment.position.y
            );
            
            // Draw segment based on shape
            ctx.fillStyle = segment.color || this.colors[0];
            
            switch (this.baseShape) {
                case 'leaf':
                    // Draw leaf shape
                    this.drawLeaf(ctx, segment);
                    break;
                    
                case 'round':
                    // Draw round shape
                    this.drawRound(ctx, segment);
                    break;
                    
                case 'rectangular':
                    // Draw rectangle shape
                    this.drawRectangular(ctx, segment);
                    break;
                    
                default:
                    // Default to leaf
                    this.drawLeaf(ctx, segment);
            }
            
            ctx.restore();
        }
        
        // Draw branches
        for (const branch of this.branches) {
            for (const segment of branch.segments) {
                ctx.save();
                
                // Apply position and offset relative to the branch's start point
                ctx.translate(
                    this.position.x + branch.position.x + segment.position.x + segment.offset.x,
                    this.position.y - branch.position.y - segment.position.y
                );
                
                // Apply branch angle
                ctx.rotate(branch.angle);
                
                // Draw segment based on shape
                ctx.fillStyle = segment.color || this.colors[0];
                
                switch (this.baseShape) {
                    case 'leaf':
                        this.drawLeaf(ctx, segment, 0.8); // Slightly smaller leaves for branches
                        break;
                    case 'round':
                        this.drawRound(ctx, segment, 0.8);
                        break;
                    case 'rectangular':
                        this.drawRectangular(ctx, segment, 0.8);
                        break;
                    default:
                        this.drawLeaf(ctx, segment, 0.8);
                }
                
                ctx.restore();
            }
        }
    }
    
    drawLeaf(ctx, segment, scale = 1) {
        const width = segment.size.width * scale;
        const height = segment.size.height * scale;
        
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(
            width * 0.4, -height * 0.5,
            width * 0.8, -height * 0.3,
            0, -height
        );
        ctx.bezierCurveTo(
            -width * 0.8, -height * 0.3,
            -width * 0.4, -height * 0.5,
            0, 0
        );
        ctx.fill();
    }
    
    drawRound(ctx, segment, scale = 1) {
        const radius = segment.size.width / 2 * scale;
        
        ctx.beginPath();
        ctx.arc(0, -segment.size.height / 2 * scale, radius, 0, Math.PI * 2);
        ctx.fill();
    }
    
    drawRectangular(ctx, segment, scale = 1) {
        const width = segment.size.width * scale;
        const height = segment.size.height * scale;
        
        ctx.fillRect(-width / 2, -height, width, height);
    }

    grow() {
        // Add a new segment to the plant
        this.addSegment();
        this.growth++;
        
        // Chance to create a branch
        if (Math.random() < this.branchProbability && this.segments.length > 2) {
            this.createBranch();
        }
    }
    
    addSegment() {
        const lastSegment = this.segments[this.segments.length - 1];
        const segmentHeight = Math.random() * 10 + 20; // 20-30 pixels
        const segmentWidth = Math.random() * 10 + 15;  // 15-25 pixels
        
        const segment = {
            position: {
                x: 0,
                y: lastSegment ? lastSegment.position.y + segmentHeight * 0.7 : 0
            },
            offset: { x: 0, y: 0 },
            size: {
                width: segmentWidth,
                height: segmentHeight
            },
            color: this.getSegmentColor(),
            rotation: (Math.random() - 0.5) * 0.2 // Slight random rotation
        };
        
        this.segments.push(segment);
        return segment;
    }
    
    createBranch() {
        // Select a random segment to branch from (not the newest one)
        const branchIndex = Math.floor(Math.random() * (this.segments.length - 1));
        const branchSegment = this.segments[branchIndex];
        
        // Create a new branch
        const branch = {
            position: {
                x: branchSegment.position.x,
                y: branchSegment.position.y
            },
            segments: [],
            angle: Math.random() > 0.5 ? Math.PI * 0.2 : -Math.PI * 0.2, // Branch to left or right
            offset: Math.random() * 5 // For varied swaying
        };
        
        // Add 2-4 segments to the branch
        const branchLength = Math.floor(Math.random() * 3) + 2;
        for (let i = 0; i < branchLength; i++) {
            const segmentHeight = Math.random() * 8 + 15; // Smaller than main stem
            const segmentWidth = Math.random() * 8 + 10;
            
            const segment = {
                position: {
                    x: i > 0 ? branch.segments[i-1].position.x + segmentWidth * 0.5 : 0,
                    y: i > 0 ? branch.segments[i-1].position.y + segmentHeight * 0.6 : 0
                },
                offset: { x: 0, y: 0 },
                size: {
                    width: segmentWidth,
                    height: segmentHeight
                },
                color: this.getSegmentColor(),
                rotation: (Math.random() - 0.5) * 0.2
            };
            
            branch.segments.push(segment);
        }
        
        this.branches.push(branch);
        return branch;
    }
    
    getSegmentColor() {
        // Return a color from the plant's color array or slightly vary the base color
        if (this.colors.length > 1) {
            return this.colors[Math.floor(Math.random() * this.colors.length)];
        } else {
            // Slightly vary the base color for a more natural look
            const baseColor = this.colors[0];
            const r = parseInt(baseColor.slice(1, 3), 16);
            const g = parseInt(baseColor.slice(3, 5), 16);
            const b = parseInt(baseColor.slice(5, 7), 16);
            
            // Add a small variation to the green component
            const variation = Math.floor((Math.random() - 0.5) * 30);
            const newG = Math.max(0, Math.min(255, g + variation));
            
            return `#${r.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
        }
    }
} 