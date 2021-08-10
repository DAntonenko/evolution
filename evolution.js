let world = [];
const worldHeight = 15;
const worldWidth = 15;

function putInitialOrganic(min = 0, max = 10) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function putInitialOccupant() {
  let result;
  Math.random() > 0.9 ? result = true : result = false;
  return result;
}

function fillWorld() {
  for(let y = 0; y < worldHeight; y++) {
    for(let x = 0; x < worldWidth; x++) {
      world.push(new Tile(y, x, putInitialOrganic(), putInitialOccupant()));
    }
  }
}

class Tile {
  constructor(y, x, organicLevel = this.getOrganicLevel(y, x), occupant = this.getOccupant(y, x)) {
    this.y = y;
    this.x = x;
    this.organicLevel = organicLevel;
    this.occupant = occupant;
  }

  setOrganicLevel(y, x) {
    const serialNumber = Number(String(y) + String(x));
    world[serialNumber].organicLevel;
  }

  setOccupant(y, x) {
    const serialNumber = Number(String(y) + String(x));
    world[serialNumber].occupant;
  }

  getOrganicLevel(y, x) {
    const serialNumber = Number(String(y) + String(x));
    return world[serialNumber].organicLevel;
  }

  getOccupant(y, x) {
    const serialNumber = Number(String(y) + String(x));
    return world[serialNumber].occupant;
  }

  // Returns Moore neighborhood of received size for the tile.
  // If the neighborhood goes beyond the world's border, it continues on the opposite side of the world.
  // So the world is toroidal.
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

const tileSize = (document.documentElement.clientHeight - 10) / worldHeight;
canvas.height = worldHeight * tileSize;
canvas.width = worldWidth * tileSize;

//Set the shift relative to the origin of the window coordinates
const canvasMargin = 4;
canvas.style.setProperty('--canvasMargin', `${canvasMargin}px`);
const canvasBorderWidth = 1;
canvas.style.setProperty('--canvasBorderWidth', `${canvasBorderWidth}px`);
const canvasTotalShift = canvasMargin + canvasBorderWidth;

document.body.appendChild(canvas);

function drawGrid() {
  ctx.strokeStyle = 'rgba(5, 5, 5, .4)';
  world.forEach(element => {
    ctx.strokeRect(element.x * tileSize, element.y * tileSize, tileSize, tileSize);
  });
}

function drawTile() {
  world.forEach(tile => {
    ctx.fillStyle = `rgba(255, 255, 0, ${tile.organicLevel/10})`;
    ctx.fillRect(tile.x * tileSize, tile.y * tileSize, tileSize, tileSize);
  });

  world.forEach(tile => {
    if (tile.occupant) {
      ctx.beginPath();
      ctx.arc(tile.x * tileSize + tileSize / 2, tile.y * tileSize + tileSize / 2, tileSize / 2 - 1, 0, 2 * Math.PI, true);
      ctx.fillStyle = 'rgb(0, 100, 0)';
      ctx.fill();
    }
  });
}

function showTileInfo(y, x) {
  y -= canvasTotalShift;
  x -= canvasTotalShift;
  
  const tooltip = document.querySelector('.tile-info-tooltip');

  if ((y >= 0 && y <= canvas.height) && (x >= 0 && x <= canvas.width)) {
    const tile = world.find(tile => ((y >= tile.y * tileSize && y <= tile.y * tileSize + tileSize) && (x >= tile.x * tileSize && x <= tile.x * tileSize + tileSize)));
    const tileInfo = `tile: ${tile.y}, ${tile.x}; organic level: ${tile.organicLevel}; occupant: ${tile.occupant}`;
    body.style.setProperty('--tooltipY', `${y}px`);
    body.style.setProperty('--tooltipX', `${x}px`);
    if (tooltip.classList.contains('tile-info-tooltip--hidden')) tooltip.classList.remove('tile-info-tooltip--hidden');
    tooltip.innerHTML = tileInfo;
  }

  else {
    tooltip.classList.add('tile-info-tooltip--hidden');
  }
}

window.onload = function() {
  drawTile();
  // drawGrid();
  const tooltip = document.createElement('div');
  tooltip.className = 'tile-info-tooltip';
  document.body.append(tooltip);
  body.addEventListener('pointermove', (event) => showTileInfo(event.clientY, event.clientX));
};
