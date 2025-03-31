# Aquarium Simulator

A fish tank simulator featuring procedurally generated fish and plants in a 16-bit pixel art style.

## Features

- Procedurally generated fish with unique:
  - Body shapes
  - Colors
  - Appendages (fins, tails, eyes)
  - Patterns (spots, stripes)
- Procedurally generated plants with:
  - Various shapes
  - Growth over time
  - Natural swaying motion
- Interactive controls:
  - Feed the fish
  - Spawn new fish
  - Spawn new plants
  - Export/import tank configuration
  
## How to Run

1. Open the project folder in your terminal
2. Open `index.html` in your browser

## Controls

- **Feed**: Drops food particles into the tank
- **Spawn Fish**: Adds a new randomly generated fish
- **Spawn Plant**: Adds a new randomly generated plant
- **Export**: Save the current aquarium state to a JSON file
- **Import**: Load a previously saved aquarium state

## Development

This project uses vanilla JavaScript with HTML5 Canvas for rendering.

## Project Structure

```
aquarium/
├── index.html          # Main HTML file
├── README.md           # Project documentation
└── src/                # Source code
    ├── index.js        # Main entry point
    ├── styles.css      # CSS styles
    ├── core/           # Core simulation classes
    │   ├── Aquarium.js # Main simulation container
    │   ├── Entity.js   # Base class for all entities
    │   ├── Fish.js     # Fish implementation
    │   └── Plant.js    # Plant implementation
    ├── generators/     # Procedural generation
    │   ├── FishGenerator.js  # Fish generation
    │   └── PlantGenerator.js # Plant generation
    ├── ui/             # User interface
    │   └── UIController.js   # Button controls
    └── utils/          # Utility functions
        └── ColorUtils.js     # Color generation
``` 