import { Fish } from '../core/Fish.js';
import { ColorUtils } from '../utils/ColorUtils.js';

export class FishGenerator {
    constructor() {
        this.baseShapes = ['oval', 'rectangle', 'triangle'];
        this.colorUtils = new ColorUtils();
        console.log("FishGenerator initialized");
    }

    generateRandomFish(options = {}) {
        // Base configuration with explicit position if not provided
        const config = {
            position: options.position || { 
                x: Math.random() * 700 + 150, // Ensure fish are not too close to the edge
                y: Math.random() * 500 + 100  // Keep fish away from the bottom
            },
            size: options.size || { width: Math.random() * 30 + 40, height: Math.random() * 20 + 30 },
            ...options
        };
        
        console.log(`Generating fish at position ${config.position.x}, ${config.position.y} with size ${config.size.width}x${config.size.height}`);
        
        // Generate parameters if not provided
        if (!config.baseShape) {
            config.baseShape = this.getRandomBaseShape();
        }
        
        if (!config.colors) {
            config.colors = this.generateColors();
        }
        
        if (!config.appendages) {
            config.appendages = this.generateAppendages(config);
        }
        
        if (!config.patterns) {
            config.patterns = this.generatePatterns(config);
        }
        
        // Create and return the fish
        return new Fish(config);
    }

    getRandomBaseShape() {
        return this.baseShapes[Math.floor(Math.random() * this.baseShapes.length)];
    }

    generateColors() {
        // Generate a set of colors for the fish
        const numColors = Math.floor(Math.random() * 3) + 2; // 2-4 colors
        const baseHue = Math.random() * 360;
        
        // Generate a palette
        return this.colorUtils.generatePalette(baseHue, numColors);
    }

    generateAppendages(config) {
        const appendages = {
            fins: [],
            tail: null,
            eyes: []
        };
        
        // Generate tail
        appendages.tail = {
            size: {
                width: config.size.width * (Math.random() * 0.3 + 0.2),
                height: config.size.height * (Math.random() * 0.3 + 0.6)
            },
            color: config.colors[Math.floor(Math.random() * config.colors.length)]
        };
        
        // Generate fins (1-3 fins)
        const numFins = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < numFins; i++) {
            appendages.fins.push({
                position: {
                    x: (Math.random() * 0.6 - 0.3) * config.size.width,
                    y: (Math.random() * 0.6 - 0.3) * config.size.height
                },
                size: {
                    width: config.size.width * (Math.random() * 0.2 + 0.1),
                    height: config.size.height * (Math.random() * 0.3 + 0.2)
                },
                color: config.colors[Math.floor(Math.random() * config.colors.length)]
            });
        }
        
        // Generate one eye only (for side perspective)
        const eyeSize = config.size.height * (Math.random() * 0.1 + 0.08);
        appendages.eyes = [
            {
                position: {
                    x: config.size.width * 0.3,
                    y: -config.size.height * 0.15
                },
                size: eyeSize,
                color: '#FFFFFF'
            }
        ];
        
        return appendages;
    }

    generatePatterns(config) {
        const patterns = [];
        
        // 50% chance to add patterns
        if (Math.random() > 0.5) {
            // Determine pattern type
            const patternType = Math.random() > 0.5 ? 'spots' : 'stripes';
            
            if (patternType === 'spots') {
                const numSpots = Math.floor(Math.random() * 8) + 3; // 3-10 spots
                const spots = [];
                
                for (let i = 0; i < numSpots; i++) {
                    spots.push({
                        x: (Math.random() * 0.8 - 0.4) * config.size.width,
                        y: (Math.random() * 0.8 - 0.4) * config.size.height,
                        size: Math.random() * 3 + 2
                    });
                }
                
                patterns.push({
                    type: 'spots',
                    spots,
                    color: config.colors[1] || config.colors[0]
                });
            } else {
                const numStripes = Math.floor(Math.random() * 4) + 2; // 2-5 stripes
                const stripes = [];
                
                for (let i = 0; i < numStripes; i++) {
                    const stripeHeight = config.size.height * (Math.random() * 0.2 + 0.1);
                    stripes.push({
                        x: (Math.random() * 0.4 - 0.2) * config.size.width,
                        y: (Math.random() * 0.8 - 0.4) * config.size.height,
                        width: config.size.width * (Math.random() * 0.4 + 0.3),
                        height: stripeHeight
                    });
                }
                
                patterns.push({
                    type: 'stripes',
                    stripes,
                    color: config.colors[1] || config.colors[0]
                });
            }
        }
        
        return patterns;
    }
} 