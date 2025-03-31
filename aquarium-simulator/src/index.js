import './styles.css';
import { Aquarium } from './core/Aquarium.js';
import { FishGenerator } from './generators/FishGenerator.js';
import { PlantGenerator } from './generators/PlantGenerator.js';
import { UIController } from './ui/UIController.js';

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Get the canvas element and create the aquarium
    const canvas = document.getElementById('aquarium-canvas');
    const aquarium = new Aquarium(canvas);
    
    // Initialize generators
    const fishGenerator = new FishGenerator();
    const plantGenerator = new PlantGenerator();
    
    // Initialize UI controller with references to other components
    const uiController = new UIController(aquarium, fishGenerator, plantGenerator);
    
    // Start the simulation
    aquarium.start();
    
    // Add some initial fish and plants
    for (let i = 0; i < 5; i++) {
        aquarium.addFish(fishGenerator.generateRandomFish());
    }
    
    for (let i = 0; i < 3; i++) {
        aquarium.addPlant(plantGenerator.generateRandomPlant());
    }
}); 