import { fishArts } from './art.js';

// Function to set the height of the aquarium dynamically
function setAquariumHeight() {
  const aquarium = document.getElementById('aquarium');
  aquarium.style.height = window.innerHeight + 'px';
  aquarium.style.width = window.innerWidth + 'px';
  aquarium.style.position = 'relative'; // Ensure the container is positioned
  aquarium.style.overflow = 'hidden'; // Hide overflow
  aquarium.style.backgroundColor = 'rgb(0, 0, 30)'; // Set background color with a darker blue tone
  // Add sand lines at the bottom
  for (let i = 0; i < 8; i++) {
    const sandLine = document.createElement('div');
    sandLine.className = 'sand';
    sandLine.style.position = 'absolute';
    sandLine.style.bottom = `${i * 10}px`;
    sandLine.style.width = '100%';
    sandLine.style.height = '10px';
    const colorIntensity = 100 - (i * 10);
    const blueIntensity = 50 + (i * 10);
    sandLine.style.backgroundColor = `rgb(${colorIntensity}, ${colorIntensity - 30}, ${blueIntensity})`;
    aquarium.appendChild(sandLine);
  }
  // Add sky at the top (heaven)
  for (let i = 0; i < 4; i++) {
    const skyLine = document.createElement('div');
    skyLine.className = 'sky';
    skyLine.style.position = 'absolute';
    skyLine.style.top = `${i * 20}px`;
    skyLine.style.width = '100%';
    skyLine.style.height = '20px';
    skyLine.style.backgroundColor = 'rgb(70, 130, 180)'; // Darker sky color
    aquarium.appendChild(skyLine);
  }
  updateSkyColor();
}

// Function to update sky color and adjust sky height based on time of day
function updateSkyColor() {
  const skyElements = document.getElementsByClassName('sky');
  const colors = ['rgb(70, 130, 180)', 'rgb(255, 140, 0)', 'rgb(25, 25, 112)', 'rgb(139, 0, 0)']; // Day, evening, night, sunrise
  let currentColorIndex = 0;
  const stepDuration = 15000; // 15 seconds per color
  const steps = 100;
  let step = 0;

  setInterval(() => {
    const startColor = colors[currentColorIndex];
    const endColor = colors[(currentColorIndex + 1) % colors.length];
    const interpolatedColor = interpolateColor(startColor, endColor, step / steps);

    for (let skyElement of skyElements) {
      skyElement.style.backgroundColor = interpolatedColor;
    }

    // Adjust sky height to simulate sea level change
    const amplitude = 5; // Keep amplitude the same
    const verticalShift = -20; // Shift down by 20 pixels (2 characters)
    const skyHeight = 20 + (Math.sin((step / steps) * Math.PI * 2) * amplitude);

    for (let i = 0; i < skyElements.length; i++) {
      skyElements[i].style.height = `${skyHeight}px`;
      // Apply vertical shift to move sea level down
      skyElements[i].style.top = `${i * skyHeight + verticalShift}px`;
    }

    // Store the current sea level Y position globally
    window.currentSeaLevelY = (skyHeight * skyElements.length) + verticalShift;

    // Adjust wave position to be 1 character above the new sea level
    entities.waves.forEach((wave, index) => {
      wave.y = window.currentSeaLevelY + index * 10 - 10;
      wave.updatePosition();
    });

    step++;
    if (step > steps) {
      step = 0;
      currentColorIndex = (currentColorIndex + 1) % colors.length;
    }
  }, stepDuration / steps);
}

// Function to interpolate between two RGB colors
function interpolateColor(startColor, endColor, factor) {
  const start = startColor.match(/\d+/g).map(Number);
  const end = endColor.match(/\d+/g).map(Number);
  const result = start.map((val, index) => Math.round(val + factor * (end[index] - val)));
  return `rgb(${result[0]}, ${result[1]}, ${result[2]})`;
}

// Optimize entity creation and management
const entities = {
  fish: [],
  bubbles: [],
  seaweed: [],
  waves: []
};

// Optimize animation loop
let lastTime = 0;
const targetFPS = 60; // Changed to 1 FPS
const frameInterval = 1000 / targetFPS;

function animate(currentTime) {
  requestAnimationFrame(animate);

  const deltaTime = currentTime - lastTime;
  if (deltaTime < frameInterval) return;

  lastTime = currentTime - (deltaTime % frameInterval);

  // Update fish
  entities.fish.forEach(fish => fish.move());

  // Update bubbles
  entities.bubbles.forEach(bubble => bubble.move());

  // Update seaweed
  entities.seaweed.forEach(seaweed => seaweed.move());

  // Update waves
  entities.waves.forEach(wave => wave.move());
}

// Optimize entity creation functions
function createFish() {
  const fishMultiplier = Math.floor(Math.random() * 2) + 1;
  const fishCount = 10 * fishMultiplier;
  
  for (let i = 0; i < fishCount; i++) {
    const artIndex = Math.floor(Math.random() * fishArts.length);
    const art = fishArts[artIndex];
    const x = Math.random() * window.innerWidth;

    // Calculate Y within lines 2 to 8 at the bottom
    const aquariumHeight = window.innerHeight;
    const lineHeight = aquariumHeight / 10; // Assuming 10 lines of height
    const y = aquariumHeight - (Math.floor(Math.random() * 7) + 2) * lineHeight;

    const speed = 0.5 + Math.random() * 1.5;
    const direction = Math.random() < 0.5 ? 1 : -1; // Random direction
    const fish = new Fish(art, x, y, speed * direction);
    entities.fish.push(fish);
  }
}

function createBubbles() {
  const bubbleCount = 40;
  
  for (let i = 0; i < bubbleCount; i++) {
    const x = Math.random() * window.innerWidth;

    // Calculate Y within lines 2 to 8 from the bottom
    const aquariumHeight = window.innerHeight;
    const lineHeight = aquariumHeight / 10; // Assuming 10 lines of height
    const y = aquariumHeight - (Math.floor(Math.random() * 7) + 2) * lineHeight;

    const speedY = 0.5 + Math.random();
    const bubble = new Bubble(x, y, speedY);
    entities.bubbles.push(bubble);
  }
}

// Function to create seaweed entities
function createSeaweed() {
  const seaweedCount = 30;
  const aquariumWidth = window.innerWidth;
  const aquariumHeight = window.innerHeight;
  
  for (let i = 0; i < seaweedCount; i++) {
    const height = Math.floor(Math.random() * 8) + 1; // Random height between 1 and 8
    let art = '';
    for (let j = 0; j < height; j++) {
      art += (j % 2 === 0 ? '(' : ')') + '\n';
    } // Create seaweed with multiple lines of parentheses
    
    // Distribute seaweed across the width of the aquarium
    const x = Math.random() * aquariumWidth;
    
    // Place seaweed at the bottom of the aquarium
    // Use a small value for y to ensure it's close to the bottom
    const y = 10 + Math.random() * 20; // Random height between 10 and 30 pixels from the bottom
    
    const seaweed = new Seaweed(art, x, y);
    entities.seaweed.push(seaweed);
  }
}

function createWaves() {
  const mainWaveArt = Array(Math.floor(window.innerWidth / 10)).fill('~ ').join('').padEnd(window.innerWidth, ' '); // Create a wave distributed through the line
  const wave = new Wave(mainWaveArt, 0, 70); // Start waves 7 chars down from the top
  entities.waves.push(wave);

  // Create additional waves with fewer wave characters
  const waveArt60 = Array(Math.floor(window.innerWidth / 10 * 0.4)).fill('~ ').join('').padEnd(window.innerWidth, ' ');
  const wave60 = new Wave(waveArt60, 0, 80); // One line down from the main wave
  entities.waves.push(wave60);

  const waveArt90 = Array(Math.floor(window.innerWidth / 10 * 0.1)).fill('~ ').join('').padEnd(window.innerWidth, ' ');
  const wave90 = new Wave(waveArt90, 0, 90); // Two lines down from the main wave
  entities.waves.push(wave90);
}

// Use more efficient DOM manipulation
class Entity {
  constructor(art, x, y, speedX = 0, speedY = 0, className = '') {
    this.originalArt = art; // Store the original art
    this.art = art;
    this.x = x;
    this.y = y;
    this.speedX = speedX;
    this.speedY = speedY;
    this.className = className;
    this.createElement();
  }

  createElement() {
    this.element = document.createElement('div');
    this.element.className = `entity ${this.className}`;
    this.updateContent();
    this.updatePosition();
    document.getElementById('aquarium').appendChild(this.element);
  }

  updateContent() {
    this.element.textContent = this.art;
  }

  updatePosition() {
    this.element.style.transform = `translate(${this.x}px, ${this.y}px)`;
  }

  move() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.updatePosition();
  }

  isOffScreen() {
    return (
      this.x > window.innerWidth ||
      this.x < -this.element.offsetWidth ||
      this.y > window.innerHeight ||
      this.y < -this.element.offsetHeight
    );
  }
}

function flipArtHorizontally(art) {
  const lines = art.split('\n');
  const flippedLines = lines.map(line =>
    line
      .split('')
      .reverse()
      .join('')
      .replace(/\\/, 'TEMP_BACKSLASH')
      .replace(/\//g, '\\')
      .replace(/TEMP_BACKSLASH/g, '/')
      .replace(/</g, 'TEMP_LESS_THAN')
      .replace(/>/g, '<')
      .replace(/TEMP_LESS_THAN/g, '>')
      .replace(/\(/g, 'TEMP_OPEN_PAREN')
      .replace(/\)/g, '(')
      .replace(/TEMP_OPEN_PAREN/g, ')')
  );
  return flippedLines.join('\n');
}

// Fish class extending Entity
class Fish extends Entity {
  constructor(art, x, y, speedX) {
    // Flip art if moving left
    const adjustedArt = speedX < 0 ? flipArtHorizontally(art) : art;
    super(adjustedArt, x, y, speedX, 0, 'fish');
    this.speedX = speedX;
    this.originalArt = art;
    this.setRandomColor();
  }

  setRandomColor() {
    const colors = [
      'rgb(255, 69, 0)',  // Red-Orange
      'rgb(255, 215, 0)', // Gold
      'rgb(50, 205, 50)', // Lime Green
      'rgb(30, 144, 255)', // Dodger Blue
      'rgb(148, 0, 211)', // Dark Violet
      'rgb(255, 20, 147)', // Deep Pink
      'rgb(255, 165, 0)', // Orange
      'rgb(0, 255, 255)'  // Aqua
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    this.element.style.color = randomColor;
  }

  move() {
    super.move();

    // Flip art if direction changes
    if (this.speedX < 0 && this.art === this.originalArt) {
      this.art = flipArtHorizontally(this.originalArt);
      this.element.textContent = this.art;
    } else if (this.speedX > 0 && this.art !== this.originalArt) {
      this.art = this.originalArt;
      this.element.textContent = this.art;
    }

    // Wrap around horizontally
    if (this.speedX > 0 && this.x > window.innerWidth) {
      this.x = -this.element.offsetWidth;
    } else if (this.speedX < 0 && this.x < -this.element.offsetWidth) {
      this.x = window.innerWidth;
    }
    this.updatePosition();
  }
}

// Optimize color updates
const colorCache = new Map();

function getCachedColor(key, fallback) {
  if (!colorCache.has(key)) {
    colorCache.set(key, fallback());
  }
  return colorCache.get(key);
}

// Bubble class extending Entity
class Bubble extends Entity {
  constructor(x, y, speedY) {
    const bubbleChars = ['o', 'O', '.', 'º'];
    const randomChar = bubbleChars[Math.floor(Math.random() * bubbleChars.length)];
    speedY *= (1 + Math.random() * 0.5);
    super(randomChar, x, y, 0, -speedY, 'bubble');
    this.setColor();
  }

  setColor() {
    const depthLevel = Math.floor((this.y / window.innerHeight) * 8); // Determine depth level (0-7)
    this.element.style.color = getCachedColor(`bubble-${depthLevel}`, () => {
      const blueShades = [
        'rgb(200, 200, 255)',
        'rgb(180, 180, 240)',
        'rgb(160, 160, 230)',
        'rgb(140, 140, 220)',
        'rgb(120, 120, 210)',
        'rgb(100, 100, 200)',
        'rgb(80, 80, 190)',
        'rgb(60, 60, 180)'
      ];
      return blueShades[depthLevel];
    });
  }

  move() {
    super.move();

    // Reset bubble to bottom if it reaches the top waves
    const bubbleTopY = this.y;
    const waveTopY = window.currentSeaLevelY - 10; // Waves are positioned just below sea level
    if (bubbleTopY <= waveTopY) {
      this.y = window.innerHeight;
      this.x = Math.random() * window.innerWidth;
      this.setColor(); // Update color based on new position
    }
    this.updatePosition();
  }
}

// Seaweed class extending Entity
class Seaweed extends Entity {
  constructor(art, x, y) {
    super(art, x, y, 0, 0, 'seaweed');
    this.setAnimation();
    this.setColor();
  }

  createElement() {
    super.createElement();
    // Ensure the seaweed is positioned absolutely
    this.element.style.position = 'absolute';
    this.updatePosition();
  }

  updatePosition() {
    // Use left and bottom for positioning instead of transform
    this.element.style.left = `${this.x}px`;
    this.element.style.bottom = `${this.y}px`;
  }

  setAnimation() {
    this.element.style.animation = 'sway 10s ease-in-out infinite';
    this.element.style.transformOrigin = 'bottom center';
  }

  setColor() {
    this.element.style.color = 'rgb(0, 100, 0)'; // Set seaweed color with a greenish-blue tone
  }

  move() {
    // Animate seaweed by slightly modifying the parentheses to simulate movement
    if (!this.lastUpdateTime || Date.now() - this.lastUpdateTime > 500) {
      let newArt = '';
      for (let i = 0; i < this.art.length; i++) {
        if (this.art[i] === '(') {
          newArt += Math.random() < 0.5 ? '(' : ')';
        } else if (this.art[i] === ')') {
          newArt += Math.random() < 0.5 ? ')' : '(';
        } else {
          newArt += this.art[i];
        }
      }
      this.art = newArt;
      this.updateContent();
      this.lastUpdateTime = Date.now();
    }
  }
}

// Wave class extending Entity
class Wave extends Entity {
  constructor(art, x, y) {
    super(art, x, y, 0, 0, 'wave');
  }

  move() {
    // Randomly add or remove spaces in the wave to simulate movement
    const waveArray = this.art.split('');
    if (Math.random() < 0.5) {
      const randomIndex = Math.floor(Math.random() * waveArray.length);
      waveArray[randomIndex] = waveArray[randomIndex] === ' ' ? '~' : ' ';
    }
    this.art = waveArray.join('');
    this.element.textContent = this.art;
  }
}

// Call the function to set aquarium height
setAquariumHeight();

// Create all entities
createFish();
createBubbles();
createSeaweed();
createWaves();

// Start the animation with the optimized loop
requestAnimationFrame(animate);