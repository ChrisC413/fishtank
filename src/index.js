import './styles.css';
import { Aquarium } from './core/Aquarium.js';
import { FishGenerator } from './generators/FishGenerator.js';
import { PlantGenerator } from './generators/PlantGenerator.js';
import { UIController } from './ui/UIController.js';
import { Fish } from './core/Fish.js';

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM loaded, initializing aquarium");
    
    // Get the canvas element and create the aquarium
    const canvas = document.getElementById('aquarium-canvas');
    if (!canvas) {
        console.error("Canvas element not found!");
        return;
    }
    
    console.log("Canvas found:", canvas);
    const aquarium = new Aquarium(canvas);
    
    // Initialize generators
    const fishGenerator = new FishGenerator();
    const plantGenerator = new PlantGenerator();
    
    // Initialize UI controller with references to other components
    const uiController = new UIController(aquarium, fishGenerator, plantGenerator);
    
    // Start the simulation
    aquarium.start();
    
    // Add a debug fish that's always visible
    const debugFish = new Fish({
        position: { x: 500, y: 350 },
        size: { width: 80, height: 50 },
        colors: ['#FF0000', '#FFFF00'],
        baseShape: 'oval',
        velocity: { x: 20, y: 0 }
    });
    
    aquarium.addFish(debugFish);
    console.log("Added debug fish:", debugFish);
    
    // Add some initial fish and plants
    console.log("Creating initial fish and plants...");
    for (let i = 0; i < 12; i++) {
        const fish = fishGenerator.generateRandomFish();
        aquarium.addFish(fish);
        console.log(`Fish ${i+1} created:`, fish);
    }
    
    for (let i = 0; i < 5; i++) {
        aquarium.addPlant(plantGenerator.generateRandomPlant());
    }
    
    console.log("Total entities:", aquarium.entities.fish.length, "fish,", aquarium.entities.plants.length, "plants");
}); 