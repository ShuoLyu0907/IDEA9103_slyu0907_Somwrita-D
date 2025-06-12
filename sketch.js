// Global Variables
let circles = [];
let rects = [];
let halfCircles = [];

// Design reference canvas size
let baseWidth = 800;
let baseHeight = 1300;

let scaleFactor, offsetX, offsetY; // For scaling and centering the canvas

// Background grid unit size
let gridSize = 15;
// Global time variable (not used directly)
let t = 0;

function setup() {
  createCanvas(windowWidth, windowHeight); // Create responsive canvas
  noStroke();
  rectMode(CENTER);
}

// Raw Data Definitions
// Graphic data for each element type extracted for easy tuning

// SplitCircle format: [x, y, radius]
let splitCircleRawData = [
  [104, 4, 50], [74, 100, 50], [84, 185, 35], [144, 220, 35], [179, 275, 30],
  [170, 350, 45], [175, 445, 50], [251, 483, 35], [319, 497, 35],
  [384, 490, 30], [495, 305, 20], [467, 340, 25], [320, 303, 20],
  [305, 340, 20], [355, 340, 30], [414, 380, 40], [414, 445, 25],

  [825, 97, 20], [798, 140, 30], [727, 132, 40], [666, 135, 20],
  [628, 160, 25], [639, 235, 50], [635, 320, 35], [626, 400, 45],
  [594, 478, 40], [524, 484, 30], [454, 498, 40], [425, 588, 55],

  [400, 710, 70], [414, 830, 50], [426, 910, 30], [387, 975, 45],
  [335, 1020, 25], [265, 1020, 45], [462, 1006, 35], [542, 1020, 45],
];

// Half-circle format: [x, y, radius, fillColor, borderColor, borderWidth]
let halfCircleRawData = [
  [185, 1138, 34, [109,173,123], [232, 92, 90], 0],
  [265, 1138, 44, [227, 197, 99], [83, 86, 101], 0],
  [361, 1138, 50, [251,91,99], [83, 86, 101], 0],
  [454.5, 1138, 42, [251,91,99], [83, 86, 101], 0],
  [542, 1138, 43, [227, 197, 99], [83, 86, 101], 0],
  [606.5, 1138, 16, [109,173,123], [83, 86, 101], 0],
];

// Rect format: [x, y, width, height, fillColor, borderColor, borderWidth]
let rectRawData = [
  [95, 1040, 655, 120, [109, 173, 123], [62, 58, 47], 5],
  [146, 1020, 480, 120, [227, 197, 99], [62, 58, 47], 5],
  [150, 1023, 90, 115, [227, 197, 99], [0, 0, 0], 0],
  [220, 1023, 90, 115, [251,91,99], [0, 0, 0], 0],
  [310, 1023, 102, 115, [109,173,123], [0, 0, 0], 0],
  [412, 1023, 80, 115, [227, 197, 99], [0, 0, 0], 0],
  [497, 1023, 90, 115, [109,173,123], [0, 0, 0], 0],
  [0, 1040, 100, 120, [109, 173, 123], [62, 58, 47], 5],
  [750, 1040, 100, 120, [109, 173, 123], [62, 58, 47], 5],
];

function setup() {
  // Create canvas based on window size
  createCanvas(windowWidth, windowHeight);
  // Calculate scaling and translation
  setupTransform();
  // Initialize half-circle objects
  setupHalfCircles();
  // Initialize rectangle objects
  setupRects();
  // Initialize split-circle objects
  setupCircles();
}

// Main draw loop
// This function is called repeatedly to render the scene
function draw() {
   // Set background color
  background(245, 240, 210);
  // Animate grid background
  drawDynamicBackground();

  push();
  // Apply zoom and centering
  applyTransform();
  // Draw each visual object
  for (let r of rects) r.draw();
  for (let c of circles) c.display();
  for (let h of halfCircles) h.draw();

  pop();
}

// Dynamic background animation
// Draws a smooth animated noise-based color grid in the background
// This is a technique used outside of the course, from Youtube tutorial 
// Reference: https://www.youtube.com/watch?v=XevTlomtG3g
function drawDynamicBackground() {
  let bgGridSize = 15;
  let cols = floor(width / bgGridSize);
  let rows = floor(height / bgGridSize);
  let bgTime = millis() * 0.001;
  
  push();
  noStroke();
  rectMode(CENTER);

  let colA = color(38, 91, 119);      // Starting color
  let colB = color(67, 107, 161);    // Ending color

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = i * bgGridSize + bgGridSize / 2;
      let y = j * bgGridSize + bgGridSize / 2;
      // Get noise value for position and time
      let noiseVal = noise(i * 0.05, j * 0.05, bgTime);
      // Smaller squares = darker areas
      let squareSize = map(noiseVal, 0.5, 1, bgGridSize, 2);
      // Interpolate color
      let lerpedColor = lerpColor(colA, colB, noiseVal);
      fill(lerpedColor);
      // Draw grid square
      rect(x, y, squareSize, squareSize);
    }
  }
  pop();
}

// Handle window resize events
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setupTransform();
}

// Compute scale factor and offset to fit base canvas into actual window
function setupTransform() {
  let scaleX = width / baseWidth;
  let scaleY = height / baseHeight;
  scaleFactor = min(scaleX, scaleY);
  offsetX = (width - baseWidth * scaleFactor) / 2;
  offsetY = (height - baseHeight * scaleFactor) / 2;
}

// Apply computed transform to the canvas
function applyTransform() {
  translate(offsetX, offsetY);
  scale(scaleFactor);
}

// Initialize rectangle objects
function setupRects() {
  rects = [];
  for (let [x, y, w, h, fillColor, borderColor, borderWidth] of rectRawData) {
    rects.push(new Rect(x, y, w, h, fillColor, borderColor, borderWidth));
  }
}

// Initialize half-circle objects
function setupHalfCircles() {
  halfCircles = [];
  for (let [x, y, r, fillColor, borderColor, borderWidth] of halfCircleRawData) {
    halfCircles.push(new HalfCircle(x, y, r, fillColor, borderColor, borderWidth));
  }
}

// Initialize split-circle objects
function setupCircles() {
  circles = [];
  for (let [x, y, r] of splitCircleRawData) {
    // How much of the circle is left-colored
    let leftRatio = random(0.3, 0.8);
    // Random initial split angle
    let angle = random(TWO_PI);
    let c = new SplitCircle(
       // Position of the circle and radius
      x, y, r,
      // Ratio of left color area to total area
      leftRatio,
       // Left color
      [251, 91, 99],
      // Right color
      [109, 173, 123],
      // Border color
      [62, 58, 47],
      // Border width
      4,
      // The angle of the dividing line
      angle
    );
    circles.push(c);
  }
}

// When spacebar is pressed, generate a new random seed
function keyPressed() {
  if (key === ' ') {
    let newSeed = int(random(10000));
    randomSeed(newSeed);
    noiseSeed(newSeed);
    // Regenerate split circles with new randomness
    setupCircles();
  }
}

// A circle that is visually split into two color segments
// with animated movement, rotation, and pulsing
// Some of these techniques were not derived from the course, but were learned from Chatgpt.
class SplitCircle {
  constructor(x, y, r, leftRatio, leftColor, rightColor, borderColor, borderWidth, angle = 0) {
    this.originalX = x;
    this.originalY = y;
    this.r = r;
    this.leftRatio = leftRatio;      // Proportion of the circle filled with leftColor
    this.leftColor = leftColor;      // Color for left segment
    this.rightColor = rightColor;    // Color for right segment
    this.borderColor = borderColor;  // Stroke color around the circle
    this.borderWidth = borderWidth;  
    this.angle = angle;              // Initial division angle (in radians)
    
    // Animation parameters for position noise and motion
    this.seedOffset = random(100);
    this.noiseX = random(800);
    this.noiseY = random(2000);
    this.noiseSpeed = random(0.0003, 0.001);
    this.noiseAmplitude = random(20, 60);
  }
  // Draws the split circle with animation
  display() {
    push();
    let t = millis();
    
    // Calculate animated offset using noise
    let offsetX = (noise(this.noiseX + t * this.noiseSpeed) - 0.5) * 2 * this.noiseAmplitude;
    let offsetY = (noise(this.noiseY + t * this.noiseSpeed) - 0.5) * 2 * this.noiseAmplitude;

    let x = this.originalX + offsetX;
    let y = this.originalY + offsetY;
    
    // Update the division angle over time
    let noiseVal = noise(this.originalX * 0.01, this.originalY * 0.01, t * 0.0003 + this.seedOffset);
    this.angle = noiseVal * TWO_PI;
    // Apply pulsing effect to radius
    let pulse = sin(t * 0.002 + this.seedOffset) * 1.5;
    let d = (this.r + pulse) * 2;

    // Draw base circle (right color)
    fill(...this.rightColor);
    noStroke();
    ellipse(x, y, d, d);
   
    // Compute division vector based on angle
    let normalX = cos(this.angle);
    let normalY = sin(this.angle);
    let threshold = (2 * this.leftRatio - 1) * this.r;
    
    // Draw left-colored segment
    fill(...this.leftColor);
    beginShape();
    let step = 0.05;
    for (let a = 0; a <= TWO_PI + step; a += step) {
      let dx = cos(a) * this.r;
      let dy = sin(a) * this.r;
      let dot = dx * normalX + dy * normalY;
      if (dot < threshold) {
        vertex(x + dx, y + dy);
      }
    }
    endShape(CLOSE);
    
    // Draw border
    stroke(...this.borderColor);
    strokeWeight(this.borderWidth / scaleFactor);
    noFill();
    ellipse(x, y, d, d);
    pop();
  }
}

// Represents a rectangle that gently pulses in size over time
class Rect {
  constructor(x, y, width, height, fillColor, borderColor, borderWidth = 1) {
    this.x = x;
    this.y = y;
    this.baseW = width;
    this.baseH = height;
    this.fillColor = fillColor;
    this.borderColor = borderColor;
    this.borderWidth = borderWidth;
    
    // Animation parameters for pulsing effect
    this.phase = random(TWO_PI);        // Phase offset
    this.speed = random(0.001, 0.005);  // Speed of oscillation
    this.amplitude = random(4, 20);     // Amount of size change

  }

  draw() {
    this.drawAnimated();   // Draw with animated size
  }

  drawAnimated() {
    push();
    let t = millis();
    
    // Calculate pulsing width and height using sine wave
    let pulse = sin(t * this.speed + this.phase) * this.amplitude;
    let w = this.baseW + pulse;
    let h = this.baseH + pulse;

    stroke(...this.borderColor);
    strokeWeight(this.borderWidth);
    fill(...this.fillColor);
    rect(this.x, this.y, w, h, 4);  
    pop();
  }
}

// Represents a half-circle that gently floats up and down
class HalfCircle {
  constructor(x, y, r, fillColor, borderColor, borderWidth = 1) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.fillColor = fillColor;
    this.borderColor = borderColor;
    this.borderWidth = borderWidth;
  }

  draw() {
    // Add vertical floating motion using sine wave
    let floatY = sin(millis() / 600 + this.x * 0.1) * 20;
    stroke(...this.borderColor);
    strokeWeight(this.borderWidth);
    fill(...this.fillColor);
    arc(this.x, this.y + floatY, this.r * 2, this.r * 2, PI, 0, PIE);
  }
}
