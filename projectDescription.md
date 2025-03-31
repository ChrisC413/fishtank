# Aquarium

This is a fish tank simulator

## The aquarium

A simple rectangle representing the water. There is a simple static background of water and gravel

## The Fish

Fish are colorful animated sprites. All fish are in the style of pixel 16bit art.

Fish are procedurally generated

### generating a fish

1. select a base shape
2. select number of colors (likelihood of each additional color should decay) - minimum 2 colors
2. add appendages (fins, tail, eyes)
2. add markings (stripes, spots)
3. choose colors (variable color pallet, set a low colors default similar to 8 bit color)
4. color appendages
5. color body using an algorithm that is likely to create blobs, spots and stripes



Different fish species take after a primitive baes shape for their body.

Fish float around the aquarium

### Fish behavior

Fish swim in the tank
Other features to add later

- fish emit bubbles
- fish have different swim patterns
- fish eat
- fish have variable sizes and growth rate
- fish reproduction - a single fish will slowly create copies with slightly different visual characteristics

### Plants

like fish, plants are made up a base primitive shape.


unlike fish, plants grow by adding partially overlapping copies of their base shape

#### generating a plant
color body using an algorithm that is likely to create blobs, spots and stripes
modify leaf shape so shapes vary slightly

## Future Features

Some interactions with the fish tank will be allowed through a virtual keypad

- feed
- purge - remove a fish or pant and discourage future fish from looking like this fish
- propagates - keep a plant or fish and encourage future 
- spawn fish
- spawn plant
- export - export the fish or plant assets and properties
- import