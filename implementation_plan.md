# Aquarium Simulator - Implementation Plan

## Project Overview
A 2D fish tank simulator featuring procedurally generated fish and plants in a 16-bit pixel art style. The simulation will include fish movement, later extending to more complex behaviors and interactions.

## Technical Stack
- **Frontend Framework**: HTML5 Canvas + JavaScript
- **Graphics**: Pixel art sprites (procedurally generated)
- **Asset Management**: Generate and store fish/plant configurations

## Core Components

### 1. Rendering Engine
- Canvas-based rendering system
- Animation loop
- Background rendering (water, gravel)

### 2. Entity System
- Base entity class
- Fish entity
- Plant entity
- Collision detection

### 3. Procedural Generation
- Shape generators
- Color palette management
- Pattern generation (spots, stripes, etc.)
- Appendage generation

### 4. Behavior System
- Movement patterns
- Interaction rules
- Growth mechanics

### 5. User Interface
- Controls panel
- Export/import functionality

## Implementation Phases

### Phase 1: Foundation (2 weeks)
- Set up project structure
- Implement basic canvas rendering
- Create simple rectangular aquarium
- Add static background

### Phase 2: Fish Generation (3 weeks)
- Implement fish base shape selection
- Create appendage generation (fins, tail, eyes)
- Develop coloring algorithms for patterns (spots, stripes)
- Basic fish entity with position data

### Phase 3: Fish Animation & Behavior (2 weeks)
- Implement fish swimming animation
- Add basic movement patterns
- Collision detection with tank boundaries
- Simple AI for fish behavior

### Phase 4: Plants (2 weeks)
- Implement plant generation algorithm
- Create growth mechanics
- Add plant variety and coloration

### Phase 5: Interaction & Polish (3 weeks)
- Implement user controls
- Add feeding mechanism
- Create reproduction system
- Implement export/import functionality
- Add visual effects (bubbles, etc.)

## Data Structures

### Fish Entity
```javascript
{
  id: string,
  position: {x: number, y: number},
  velocity: {x: number, y: number},
  size: {width: number, height: number},
  baseShape: string,
  colors: string[],
  appendages: {
    fins: Appendage[],
    tail: Appendage,
    eyes: Appendage[]
  },
  patterns: Pattern[],
  behavior: BehaviorType,
  growth: number,
  // Additional properties
}
```

### Plant Entity
```javascript
{
  id: string,
  position: {x: number, y: number},
  size: {width: number, height: number},
  baseShape: string,
  colors: string[],
  growth: number,
  segments: PlantSegment[]
  // Additional properties
}
```

## Key Algorithms

### Fish Generation Algorithm
1. Select base shape from predefined templates
2. Determine number of colors (min 2)
3. Generate appendages based on randomized parameters
4. Create markings (stripes, spots) using pattern generators
5. Apply color palette to body, appendages, and patterns

### Plant Generation Algorithm
1. Select base shape from predefined templates
2. Generate colors and patterns
3. Create initial segments
4. Implement growth by adding overlapping segments with slight variations

### Fish Movement Algorithm
1. Implement basic physics (velocity, acceleration)
2. Create behavior patterns (random, directed, following)
3. Add collision avoidance
4. Incorporate fish interaction rules

## Future Enhancements
- Bubble generation
- Variable fish sizes and growth rates
- Fish reproduction with genetic traits
- Feeding mechanics and hunger system
- Expanded user interaction options
- Day/night cycles
- Water quality parameters

## Technical Considerations
- Optimize rendering for multiple entities
- Balance procedural generation complexity with performance
- Consider WebGL for better performance if needed
- Design modular systems for easy extension 