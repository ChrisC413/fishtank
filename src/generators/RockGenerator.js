import { ColorUtils } from '../utils/ColorUtils.js';
import { Rock } from '../core/Rock.js';

export class RockGenerator {
    constructor() {
        this.colorUtils = new ColorUtils();
        this.earthTones = [
            '#8B4513', // Saddle Brown
            '#A0522D', // Sienna
            '#6B4423', // Dark Brown
            '#8B7355', // Burly Wood
            '#A9A9A9', // Dark Gray
            '#808080', // Gray
            '#696969', // Dim Gray
            '#4A4A4A'  // Dark Gray
        ];
        console.log("RockGenerator initialized");
    }

    generateRandomRock(options = {}) {
        // Determine if this is a large rock or pile
        const isLargeRock = Math.random() < 0.3; // 30% chance for large rock
        const isPile = Math.random() < 0.2; // 20% chance for pile

        // Base configuration
        const config = {
            position: options.position || {
                x: Math.random() * 800 + 100, // Keep away from edges
                y: 650 + (Math.random() * 30) // Start below ground line (650)
            },
            size: options.size || this.generateRockSize(isLargeRock, isPile),
            ...options
        };

        // Generate parameters if not provided
        if (!config.colors) {
            config.colors = this.generateColors();
        }

        if (!config.points) {
            config.points = this.generatePoints(config);
        }

        // Create and return a Rock instance
        return new Rock(config);
    }

    generateRockSize(isLargeRock, isPile) {
        if (isPile) {
            return {
                width: Math.random() * 100 + 80,  // 80-180 pixels wide
                height: Math.random() * 60 + 40   // 40-100 pixels high
            };
        } else if (isLargeRock) {
            return {
                width: Math.random() * 60 + 50,   // 50-110 pixels wide
                height: Math.random() * 40 + 30   // 30-70 pixels high
            };
        } else {
            return {
                width: Math.random() * 40 + 30,   // 30-70 pixels wide
                height: Math.random() * 30 + 20   // 20-50 pixels high
            };
        }
    }

    generateColors() {
        // Generate 2-3 earth tones for the rock
        const numColors = Math.floor(Math.random() * 2) + 2; // 2-3 colors
        const colors = [];
        
        // Add base color
        colors.push(this.earthTones[Math.floor(Math.random() * this.earthTones.length)]);
        
        // Add additional colors if needed
        for (let i = 1; i < numColors; i++) {
            let newColor;
            do {
                newColor = this.earthTones[Math.floor(Math.random() * this.earthTones.length)];
            } while (colors.includes(newColor));
            colors.push(newColor);
        }
        
        return colors;
    }

    generatePoints(config) {
        const points = [];
        // More points for larger rocks
        const numPoints = Math.floor(Math.random() * 4) + (config.size.width > 100 ? 8 : 6);
        const centerX = 0;
        const centerY = 0;
        const radiusX = config.size.width / 2;
        const radiusY = config.size.height / 2;

        for (let i = 0; i < numPoints; i++) {
            const angle = (i / numPoints) * Math.PI * 2;
            // Add randomness to the radius for each point
            const randomRadiusX = radiusX * (0.7 + Math.random() * 0.6);
            const randomRadiusY = radiusY * (0.7 + Math.random() * 0.6);
            
            points.push({
                x: centerX + Math.cos(angle) * randomRadiusX,
                y: centerY + Math.sin(angle) * randomRadiusY
            });
        }

        return points;
    }
} 