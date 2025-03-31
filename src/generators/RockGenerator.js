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
        // Base configuration
        const config = {
            position: options.position || {
                x: Math.random() * 800 + 100, // Keep away from edges
                y: 650 + (Math.random() * 30) // Start below ground line (650)
            },
            size: options.size || {
                width: Math.random() * 40 + 30,  // 30-70 pixels wide
                height: Math.random() * 30 + 20  // 20-50 pixels high
            },
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
        const numPoints = Math.floor(Math.random() * 4) + 6; // 6-9 points for irregular shape
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