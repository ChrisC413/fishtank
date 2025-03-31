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
        
        // Generate eyes with rare variations
        const eyeSize = config.size.height * (Math.random() * 0.1 + 0.08);
        appendages.eyes = [];
        
        // Determine number of eyes (rare variations)
        const eyeRoll = Math.random();
        let numEyes;
        if (eyeRoll < 0.01) { // 1% chance for 0 eyes
            numEyes = 0;
        } else if (eyeRoll < 0.02) { // 1% chance for 2 eyes
            numEyes = 2;
        } else if (eyeRoll < 0.03) { // 1% chance for 3 eyes
            numEyes = 3;
        } else { // 97% chance for 1 eye
            numEyes = 1;
        }
        
        // Generate eye positions based on count
        for (let i = 0; i < numEyes; i++) {
            let xOffset, yOffset;
            if (numEyes === 1) {
                // Single eye on the side
                xOffset = config.size.width * 0.3;
                yOffset = -config.size.height * 0.15;
            } else if (numEyes === 2) {
                // Two eyes side by side
                xOffset = config.size.width * (0.3 + (i - 0.5) * 0.1);
                yOffset = -config.size.height * 0.15;
            } else if (numEyes === 3) {
                // Three eyes in a triangle pattern
                const angle = (i * 2 * Math.PI) / 3;
                xOffset = config.size.width * (0.3 + Math.cos(angle) * 0.1);
                yOffset = config.size.height * (-0.15 + Math.sin(angle) * 0.1);
            }
            
            appendages.eyes.push({
                position: {
                    x: xOffset,
                    y: yOffset
                },
                size: eyeSize,
                color: '#FFFFFF'
            });
        }
        
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
                    // Generate spot position within fish body bounds
                    let x, y;
                    let spotSize;
                    
                    // Keep trying until we get a valid position
                    do {
                        x = (Math.random() * 0.8 - 0.4) * config.size.width;
                        y = (Math.random() * 0.8 - 0.4) * config.size.height;
                        spotSize = Math.random() * 3 + 2;
                        
                        // Check if spot is within fish body bounds
                        const isWithinBounds = this.isPointInFishBody(x, y, config);
                    } while (!this.isPointInFishBody(x, y, config));
                    
                    spots.push({
                        x,
                        y,
                        size: spotSize
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
                    // Generate stripe position within fish body bounds
                    let x, y, width, height;
                    
                    // Keep trying until we get a valid stripe
                    do {
                        x = (Math.random() * 0.4 - 0.2) * config.size.width;
                        y = (Math.random() * 0.8 - 0.4) * config.size.height;
                        width = config.size.width * (Math.random() * 0.4 + 0.3);
                        height = config.size.height * (Math.random() * 0.2 + 0.1);
                        
                        // Check if stripe corners are within fish body bounds
                        const corners = [
                            { x: x - width/2, y: y - height/2 },
                            { x: x + width/2, y: y - height/2 },
                            { x: x - width/2, y: y + height/2 },
                            { x: x + width/2, y: y + height/2 }
                        ];
                        
                        const allCornersInBounds = corners.every(corner => 
                            this.isPointInFishBody(corner.x, corner.y, config)
                        );
                        
                        if (allCornersInBounds) {
                            stripes.push({
                                x,
                                y,
                                width,
                                height
                            });
                            break;
                        }
                    } while (true);
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

    // Helper method to check if a point is within the fish's body
    isPointInFishBody(x, y, config) {
        const halfWidth = config.size.width / 2;
        const halfHeight = config.size.height / 2;
        
        switch (config.baseShape) {
            case 'oval':
                // Check if point is within ellipse
                return (x * x) / (halfWidth * halfWidth) + (y * y) / (halfHeight * halfHeight) <= 1;
                
            case 'rectangle':
                // Check if point is within rectangle
                return Math.abs(x) <= halfWidth && Math.abs(y) <= halfHeight;
                
            case 'triangle':
                // Check if point is within triangle
                const isAboveBottom = y >= -halfHeight;
                const isBelowTop = y <= halfHeight;
                const isWithinSides = Math.abs(x) <= halfWidth * (1 - (y + halfHeight) / (2 * halfHeight));
                return isAboveBottom && isBelowTop && isWithinSides;
                
            default:
                // Default to oval check
                return (x * x) / (halfWidth * halfWidth) + (y * y) / (halfHeight * halfHeight) <= 1;
        }
    }
} 