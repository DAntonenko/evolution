let world = [];
const worldHeight = 100;
const worldWidth = 100;

function putOrganic() { return null };
function putOccupant() {
  let result;
  Math.random() > 0.8 ? result = true : result = false;
  return result;
};

function fillWorld() {
  for(let y = 0; y < worldHeight; y++) {
    for(let x = 0; x < worldWidth; x++) {
      world.push(new Tile(y, x, putOrganic(), putOccupant()));
    }
  }
}

class Tile {
  constructor(y, x, initialOrganicLevel = this.getOrganicLevel(y, x), initialOccupant = this.getOccupant(y, x)) {
    this.y = y;
    this.x = x;
    this.organicLevel = initialOrganicLevel;
    this.occupant = initialOccupant;
  }

  getOrganicLevel(y, x) { // Returns current organicLevel of the tile for a case when another value isn't received
    const serialNumber = Number(String(y) + String(x));
    return world[serialNumber].organicLevel;
  }

  getOccupant(y, x) { // Returns current occupant of the tile for a case when another one isn't received
    const serialNumber = Number(String(y) + String(x));
    return world[serialNumber].occupant;
  }

  // Returns Moore neighborhood of received size for the tile.
  // If the neighborhood goes beyond the world's border, it continues on the opposite side of the world.
  // So the world is spherical.
  getNeighborhood(size) {
    let neighborhood = [];
    for(let i = 0; i < size * 2 + 1; i++) {
      let y = this.y - size + i;
      if (y < 0) y = worldHeight + y; // Makes the world vertically borderless

      for(let i = 0; i < size * 2 + 1; i++) {
        let x = this.x - size + i;
        if (x < 0) x = worldWidth + x; // Makes the world horizontally borderless

        if (!(y === this.y && x === this.x)) { // Excludes the tile itself from is's neighborhood
          neighborhood.push(new Tile(y, x));
        }
      }
    }
    return neighborhood;
  }
}

fillWorld();
console.log(world);
// console.log(world[0].getNeighborhood(1));
// console.log(world[55].getNeighborhood(2));

// Visualization
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

const tileSize = 8;
canvas.width = worldWidth * tileSize;
canvas.height = worldHeight * tileSize;

document.body.appendChild(canvas);

function drawGrid() {
  ctx.strokeStyle = 'rgba(5, 5, 5, 0.4)';
  world.forEach(element => {
    ctx.strokeRect(element.x * tileSize, element.y * tileSize, tileSize, tileSize);
  });
}

function drawTile() {
  world.forEach(element => {
    if (element.occupant === true) {
      ctx.beginPath();
      ctx.arc(element.x * tileSize + tileSize / 2, element.y * tileSize + tileSize / 2, tileSize / 2 - 1, 0, 2 * Math.PI, true);
      ctx.fillStyle = 'rgb(200, 0, 0)';
      ctx.fill();
    }
  });
}

window.onload = function() {
  // drawGrid();
  drawTile();
};