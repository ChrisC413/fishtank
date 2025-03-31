import './styles.css';
import { Aquarium } from './core/Aquarium.js';
import { FishGenerator } from './generators/FishGenerator.js';
import { PlantGenerator } from './generators/PlantGenerator.js';
import { RockGenerator } from './generators/RockGenerator.js';
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
    const rockGenerator = new RockGenerator();
    
    // Initialize UI controller with references to other components
    const uiController = new UIController(aquarium, fishGenerator, plantGenerator);
    
    // Start the simulation
    aquarium.start();
    
    // Add some initial fish and plants
    console.log("Creating initial fish and plants...");
    for (let i = 0; i < 12; i++) {
        const fish = fishGenerator.generateRandomFish();
        aquarium.addFish(fish);
        console.log(`Fish ${i+1} created:`, fish);
    }
    
    for (let i = 0; i < 5; i++) {
        const plant = plantGenerator.generateRandomPlant();
        aquarium.addPlant(plant);
    }
    
    // Add initial rocks
    for (let i = 0; i < 8; i++) {
        const rock = rockGenerator.generateRandomRock();
        aquarium.addRock(rock);
    }
    
    console.log("Total entities:", aquarium.entities.fish.length, "fish,", aquarium.entities.plants.length, "plants");
}); 