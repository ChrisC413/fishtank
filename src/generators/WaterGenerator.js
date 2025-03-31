export class WaterGenerator {
    constructor() {
        this.waterColor = '#0000CD'; // Darker blue
        console.log("WaterGenerator initialized");
    }

    generateWaterTexture(width, height) {
        // Create a temporary canvas for the water texture
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = width;
        tempCanvas.height = height;
        const tempCtx = tempCanvas.getContext('2d');

        // Fill with base water color
        tempCtx.fillStyle = this.waterColor;
        tempCtx.fillRect(0, 0, width, height);

        // Add noise
        const imageData = tempCtx.getImageData(0, 0, width, height);
        const data = imageData.data;

        // Define water line (top 20% of the canvas)
        const waterLine = height * 0.2;

        // Generate noise only above water line
        for (let i = 0; i < data.length; i += 4) {
            const y = Math.floor((i / 4) / width);
            
            // Only apply effects above water line
            if (y < waterLine) {
                // Add noise
                const noise = (Math.random() - 0.5) * 40;
                
                // Apply to each color channel
                data[i] = Math.max(0, Math.min(255, data[i] + noise));     // R
                data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise)); // G
                data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise)); // B
            }
        }

        tempCtx.putImageData(imageData, 0, 0);
        return tempCanvas;
    }
} 