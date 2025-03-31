export class ColorUtils {
    constructor() {
        // 8-bit color palettes for retro look
        this.predefinedPalettes = [
            ['#FF6347', '#4682B4', '#FFD700', '#32CD32', '#9370DB'], // Bright
            ['#8B4513', '#556B2F', '#B8860B', '#A0522D', '#CD853F'], // Earth tones
            ['#00CED1', '#20B2AA', '#5F9EA0', '#4682B4', '#87CEEB'], // Ocean
            ['#FF69B4', '#DA70D6', '#BA55D3', '#9370DB', '#8A2BE2'], // Purple-Pink
        ];
    }

    // HSL to RGB conversion
    hslToRgb(h, s, l) {
        let r, g, b;

        if (s === 0) {
            r = g = b = l; // achromatic
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };

            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        return [
            Math.round(r * 255),
            Math.round(g * 255),
            Math.round(b * 255)
        ];
    }

    // Convert RGB to hex
    rgbToHex(r, g, b) {
        return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    // Generate a 8-bit color palette based on a hue
    generatePalette(baseHue, numColors, options = {}) {
        const colors = [];
        
        // Use predefined palettes for better retro look
        if (Math.random() > 0.3) {
            // 70% chance to use a predefined palette for a more cohesive look
            const palette = this.predefinedPalettes[Math.floor(Math.random() * this.predefinedPalettes.length)];
            
            // Select a subset of colors from the palette
            const shuffled = [...palette].sort(() => 0.5 - Math.random());
            return shuffled.slice(0, numColors);
        }
        
        // Initialize with defaults
        const saturation = options.saturation || 0.7;
        const lightness = options.lightness || 0.5;
        const hueVariation = options.hueVariation || 60; // Degree variation around the base hue
        
        // Normalize hue
        baseHue = baseHue % 360;
        baseHue = baseHue < 0 ? baseHue + 360 : baseHue;
        
        // Create colors by varying hue while keeping saturation and lightness similar
        for (let i = 0; i < numColors; i++) {
            // Vary the hue around the base
            const hueOffset = (i * (hueVariation / numColors)) - (hueVariation / 2);
            let hue = (baseHue + hueOffset) % 360;
            hue = hue < 0 ? hue + 360 : hue;
            
            // Add slight variation to saturation and lightness for each color
            const s = Math.min(1, Math.max(0, saturation + (Math.random() * 0.2 - 0.1)));
            const l = Math.min(1, Math.max(0, lightness + (Math.random() * 0.2 - 0.1)));
            
            // Convert to RGB and then to hex
            const [r, g, b] = this.hslToRgb(hue / 360, s, l);
            const hexColor = this.rgbToHex(r, g, b);
            
            colors.push(hexColor);
        }
        
        return colors;
    }
} 