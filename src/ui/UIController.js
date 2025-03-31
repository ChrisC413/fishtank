export class UIController {
    constructor(aquarium, fishGenerator, plantGenerator) {
        this.aquarium = aquarium;
        this.fishGenerator = fishGenerator;
        this.plantGenerator = plantGenerator;
        
        // Set up event listeners
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Feed button
        const feedButton = document.getElementById('feed-btn');
        if (feedButton) {
            feedButton.addEventListener('click', this.handleFeed.bind(this));
        }
        
        // Spawn fish button
        const spawnFishButton = document.getElementById('spawn-fish-btn');
        if (spawnFishButton) {
            spawnFishButton.addEventListener('click', this.handleSpawnFish.bind(this));
        }
        
        // Spawn plant button
        const spawnPlantButton = document.getElementById('spawn-plant-btn');
        if (spawnPlantButton) {
            spawnPlantButton.addEventListener('click', this.handleSpawnPlant.bind(this));
        }
        
        // Export button
        const exportButton = document.getElementById('export-btn');
        if (exportButton) {
            exportButton.addEventListener('click', this.handleExport.bind(this));
        }
        
        // Import button
        const importButton = document.getElementById('import-btn');
        if (importButton) {
            importButton.addEventListener('click', this.handleImport.bind(this));
        }
        
        // Toggle grid button
        const toggleGridButton = document.getElementById('toggle-grid-btn');
        if (toggleGridButton) {
            toggleGridButton.addEventListener('click', this.handleToggleGrid.bind(this));
        }
        
        // Canvas click events
        this.aquarium.canvas.addEventListener('click', this.handleCanvasClick.bind(this));
    }

    handleFeed() {
        // Simulate feeding with food particles that float down
        const foodCount = Math.floor(Math.random() * 5) + 5; // 5-10 food particles
        
        for (let i = 0; i < foodCount; i++) {
            setTimeout(() => {
                const x = Math.random() * this.aquarium.width;
                const y = 20; // Start at the top
                
                this.createFoodParticle(x, y);
            }, i * 100); // Stagger the food drops
        }
    }

    createFoodParticle(x, y) {
        // Simple food particle that slowly sinks
        const ctx = this.aquarium.ctx;
        const size = Math.random() * 3 + 2;
        
        let yPos = y;
        const fallInterval = setInterval(() => {
            if (!this.aquarium.isRunning) {
                clearInterval(fallInterval);
                return;
            }
            
            // Add a bit of sideways drift
            x += (Math.random() - 0.5) * 2;
            
            // Move downwards
            yPos += 1;
            
            // Stop if reaches the bottom
            if (yPos > this.aquarium.height - 50) {
                clearInterval(fallInterval);
            }
        }, 50);
    }

    handleSpawnFish() {
        // Generate a new random fish
        const fish = this.fishGenerator.generateRandomFish();
        this.aquarium.addFish(fish);
    }

    handleSpawnPlant() {
        // Generate a new random plant at a random x position
        const x = Math.random() * (this.aquarium.width - 200) + 100; // Keep away from edges
        const plant = this.plantGenerator.generateRandomPlant({
            position: { x, y: 650 } // Position at the bottom
        });
        this.aquarium.addPlant(plant);
    }

    handleExport() {
        // Get current state of aquarium
        const exportData = {
            fish: this.aquarium.entities.fish.map(fish => ({
                baseShape: fish.baseShape,
                colors: fish.colors,
                appendages: fish.appendages,
                patterns: fish.patterns,
                size: fish.size
            })),
            plants: this.aquarium.entities.plants.map(plant => ({
                baseShape: plant.baseShape,
                colors: plant.colors,
                segments: plant.segments,
                position: { x: plant.position.x, y: plant.position.y }
            }))
        };
        
        // Convert to JSON and create download link
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "aquarium_export.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }

    handleImport() {
        // Create file input element
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json';
        fileInput.style.display = 'none';
        document.body.appendChild(fileInput);
        
        fileInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const importData = JSON.parse(e.target.result);
                    this.importAquariumData(importData);
                } catch (error) {
                    console.error("Error importing aquarium data:", error);
                    alert("Failed to import aquarium data. Invalid format.");
                }
            };
            reader.readAsText(file);
            fileInput.remove();
        });
        
        fileInput.click();
    }

    importAquariumData(data) {
        // Clear current aquarium
        this.aquarium.entities.fish = [];
        this.aquarium.entities.plants = [];
        
        // Import fish
        if (data.fish && Array.isArray(data.fish)) {
            data.fish.forEach(fishData => {
                const fish = this.fishGenerator.generateRandomFish(fishData);
                this.aquarium.addFish(fish);
            });
        }
        
        // Import plants
        if (data.plants && Array.isArray(data.plants)) {
            data.plants.forEach(plantData => {
                const plant = this.plantGenerator.generateRandomPlant(plantData);
                this.aquarium.addPlant(plant);
            });
        }
    }

    handleCanvasClick(event) {
        // Get click coordinates relative to canvas
        const rect = this.aquarium.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        // Check if clicked on any entity
        const allEntities = [
            ...this.aquarium.entities.fish,
            ...this.aquarium.entities.plants
        ];
        
        // Check if clicked on an entity
        for (const entity of allEntities) {
            const dx = entity.position.x - x;
            const dy = entity.position.y - y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < entity.size.width / 2) {
                // If it's a fish, make it change direction
                if (entity.type === 'fish') {
                    entity.changeDirection();
                }
                
                break;
            }
        }
    }

    handleToggleGrid() {
        const isVisible = this.aquarium.toggleGrid();
        const toggleGridButton = document.getElementById('toggle-grid-btn');
        
        if (toggleGridButton) {
            toggleGridButton.textContent = isVisible ? 'Hide Grid' : 'Show Grid';
        }
    }
} 