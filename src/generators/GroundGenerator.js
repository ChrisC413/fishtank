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

    generateGroundTexture(width, height, minHeight = 0) {
        const tempCanvas = this.createCanvas(width, height);
        const tempCtx = tempCanvas.getContext('2d');
        
        // Fill base color and add noise
        this.fillBaseColor(tempCtx, width, height);
        this.addNoise(tempCtx, width, height);
        
        // Create and apply ground edge
        const topEdge = this.generateTopEdge(width, minHeight);
        this.applyTopEdge(tempCtx, topEdge, width, height);
        
        return tempCanvas;
    }

    createCanvas(width, height) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        return canvas;
    }

    fillBaseColor(ctx, width, height) {
        const baseColor = this.earthTones[Math.floor(Math.random() * this.earthTones.length)];
        ctx.fillStyle = baseColor;
        ctx.fillRect(0, 0, width, height);
    }

    addNoise(ctx, width, height) {
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            const noise = (Math.random() - 0.5) * 30;
            data[i] = Math.max(0, Math.min(255, data[i] + noise));     // R
            data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise)); // G
            data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise)); // B
        }
        
        ctx.putImageData(imageData, 0, 0);
    }

    generateTopEdge(width, minHeight) {
        const topEdge = new Array(width);
        for (let x = 0; x < width; x++) {
            const wave = Math.sin(x * 0.02) * 5 + Math.sin(x * 0.05) * 3;
            const randomOffset = (Math.random() - 0.5) * 4;
            topEdge[x] = minHeight + wave + randomOffset;
        }
        return topEdge;
    }

    applyTopEdge(ctx, topEdge, width, height) {
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        
        for (let x = 0; x < width; x++) {
            const y = Math.floor(topEdge[x]);
            // Make everything below the top edge opaque
            for (let i = y * width * 4 + x * 4; i < height * width * 4; i += width * 4) {
                data[i + 3] = 255;
            }
            // Make everything above the top edge transparent
            for (let i = x * 4; i < y * width * 4 + x * 4; i += width * 4) {
                data[i + 3] = 0;
            }
        }
        
        ctx.putImageData(imageData, 0, 0);
    }
} 