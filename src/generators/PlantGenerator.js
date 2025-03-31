import { Plant } from '../core/Plant.js';
import { ColorUtils } from '../utils/ColorUtils.js';

export class PlantGenerator {
    constructor() {
        this.baseShapes = ['leaf', 'round', 'rectangular'];
        this.colorUtils = new ColorUtils();
    }

    generateRandomPlant(options = {}) {
        // Base configuration
        const config = {
            // Plants are positioned at the bottom of the tank, but not at the very bottom
            position: options.position || { 
                x: Math.random() * 700 + 150, // Keep away from edges
                y: 650 - (Math.random() * 20) // Random height in the ground, but not at the very bottom
            },
            size: options.size || { 
                width: Math.random() * 20 + 20, 
                height: Math.random() * 30 + 30
            },
            ...options
        };
        
        // Generate parameters if not provided
        if (!config.baseShape) {
            config.baseShape = this.getRandomBaseShape();
        }
        
        if (!config.colors) {
            config.colors = this.generateColors();
        }
        
        if (!config.segments) {
            config.segments = this.generateInitialSegments(config);
        }
        
        if (!config.branches) {
            config.branches = []; // Start with no branches, they'll grow over time
        }
        
        // Set growth properties
        config.maxSegments = options.maxSegments || Math.floor(Math.random() * 5) + 5; // 5-10 max segments
        config.growthRate = options.growthRate || Math.random() * 0.05 + 0.02; // 0.02-0.07 growth rate
        config.growthInterval = options.growthInterval || Math.random() * 3 + 3; // 3-6 seconds between growth stages
        config.branchProbability = options.branchProbability || Math.random() * 0.3 + 0.1; // 10-40% chance to branch
        
        // Create and return the plant
        return new Plant(config);
    }

    getRandomBaseShape() {
        return this.baseShapes[Math.floor(Math.random() * this.baseShapes.length)];
    }

    generateColors() {
        // Generate a set of colors for the plant (green-based palette)
        const numColors = Math.floor(Math.random() * 2) + 1; // 1-2 colors
        
        // Base hue in the green range (90-150)
        const baseHue = 90 + Math.random() * 60;
        
        // Generate a palette
        return this.colorUtils.generatePalette(baseHue, numColors, {
            saturation: 0.5 + Math.random() * 0.5, // 0.5-1.0
            lightness: 0.3 + Math.random() * 0.3   // 0.3-0.6
        });
    }

    generateInitialSegments(config) {
        const segments = [];
        const initialSegments = Math.floor(Math.random() * 3) + 1; // 1-3 initial segments
        
        for (let i = 0; i < initialSegments; i++) {
            const segmentHeight = Math.random() * 10 + 20; // 20-30 pixels
            const segmentWidth = Math.random() * 10 + 15;  // 15-25 pixels
            
            segments.push({
                position: {
                    x: 0,
                    y: i > 0 ? segments[i-1].position.y + segmentHeight * 0.7 : 0
                },
                offset: { x: 0, y: 0 },
                size: {
                    width: segmentWidth,
                    height: segmentHeight
                },
                color: config.colors[Math.floor(Math.random() * config.colors.length)],
                rotation: (Math.random() - 0.5) * 0.2 // Slight random rotation
            });
        }
        
        return segments;
    }
} 