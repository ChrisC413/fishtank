export class GroundGenerator {
    constructor() {
        this.earthTones = [
            '#8B4513', // Saddle Brown
            '#A0522D', // Sienna
            '#6B4423', // Dark Brown
            '#8B7355', // Burly Wood
            '#A9A9A9'  // Dark Gray
        ];
        console.log("GroundGenerator initialized");
    }

    generateGroundTexture(width, height) {
        // Create a temporary canvas for the ground texture
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = width;
        tempCanvas.height = height;
        const tempCtx = tempCanvas.getContext('2d');

        // Choose a random earth tone base color
        const baseColor = this.earthTones[Math.floor(Math.random() * this.earthTones.length)];
        
        // Fill with base color
        tempCtx.fillStyle = baseColor;
        tempCtx.fillRect(0, 0, width, height);

        // Add noise
        const imageData = tempCtx.getImageData(0, 0, width, height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            // Add random noise to each color channel
            const noise = (Math.random() - 0.5) * 30;
            data[i] = Math.max(0, Math.min(255, data[i] + noise));     // R
            data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise)); // G
            data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise)); // B
        }

        // Create uneven top edge
        const topEdge = new Array(width);
        for (let x = 0; x < width; x++) {
            // Generate a smooth wave-like pattern
            const baseHeight = 50;
            const wave = Math.sin(x * 0.02) * 5 + Math.sin(x * 0.05) * 3;
            const randomOffset = (Math.random() - 0.5) * 4;
            topEdge[x] = baseHeight + wave + randomOffset;
        }

        // Apply the uneven top edge
        for (let x = 0; x < width; x++) {
            const y = Math.floor(topEdge[x]);
            // Make everything below the top edge opaque
            for (let i = y * width * 4 + x * 4; i < height * width * 4; i += width * 4) {
                data[i + 3] = 255; // Set alpha to 255 (fully opaque)
            }
            // Make everything above the top edge transparent
            for (let i = x * 4; i < y * width * 4 + x * 4; i += width * 4) {
                data[i + 3] = 0; // Set alpha to 0 (transparent)
            }
        }

        tempCtx.putImageData(imageData, 0, 0);
        return tempCanvas;
    }
} 