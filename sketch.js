let circles = [];
let rects = [];
let halfCircles = [];


let baseWidth = 800;
let baseHeight = 1300;

let scaleFactor, offsetX, offsetY;


let gridSize = 15;
let t = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  rectMode(CENTER);
}



let rawData = [
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

let halfCircleRawData = [
  [185, 1138, 34, [109,173,123], [232, 92, 90], 0],
  [265, 1138, 44, [227, 197, 99], [83, 86, 101], 0],
  [361, 1138, 50, [251,91,99], [83, 86, 101], 0],
  [454.5, 1138, 42, [251,91,99], [83, 86, 101], 0],
  [542, 1138, 43, [227, 197, 99], [83, 86, 101], 0],
  [606.5, 1138, 16, [109,173,123], [83, 86, 101], 0],
];

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
  createCanvas(windowWidth, windowHeight);
  setupTransform();
  setupHalfCircles();
  setupRects();
  setupCircles();
}

function draw() {
  background(245, 240, 210);
  drawDynamicBackground();

  push();
  applyTransform();

  for (let r of rects) r.draw();
  for (let c of circles) c.display();
  for (let h of halfCircles) h.draw();

  pop();
}

function drawDynamicBackground() {
  let bgGridSize = 15;
  let cols = floor(width / bgGridSize);
  let rows = floor(height / bgGridSize);
  let bgTime = millis() * 0.001;
  
  push();
  noStroke();
  rectMode(CENTER);

  let colA = color(38, 91, 119);      // 起始颜色
  let colB = color(67, 107, 161);    // 结束颜色

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = i * bgGridSize + bgGridSize / 2;
      let y = j * bgGridSize + bgGridSize / 2;

      let noiseVal = noise(i * 0.05, j * 0.05, bgTime);
      let squareSize = map(noiseVal, 0.5, 1, bgGridSize, 2);

      let lerpedColor = lerpColor(colA, colB, noiseVal);
      fill(lerpedColor);

      rect(x, y, squareSize, squareSize);
    }
  }
  pop();
}



function setupRects() {
  rects = [];
  for (let [x, y, w, h, fillColor, borderColor, borderWidth] of rectRawData) {
    rects.push(new Rect(x, y, w, h, fillColor, borderColor, borderWidth));
  }
}

function setupHalfCircles() {
  halfCircles = [];
  for (let [x, y, r, fillColor, borderColor, borderWidth] of halfCircleRawData) {
    halfCircles.push(new HalfCircle(x, y, r, fillColor, borderColor, borderWidth));
  }
}

function setupCircles() {
  circles = [];
  for (let [x, y, r] of rawData) {
    let leftRatio = random(0.3, 0.8);
    let angle = random(TWO_PI);
    let c = new SplitCircle(
      x, y, r,
      leftRatio,
      [251, 91, 99],
      [109, 173, 123],
      [62, 58, 47],
      4,
      angle
    );
    circles.push(c);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setupTransform();
}

function setupTransform() {
  let scaleX = width / baseWidth;
  let scaleY = height / baseHeight;
  scaleFactor = min(scaleX, scaleY);
  offsetX = (width - baseWidth * scaleFactor) / 2;
  offsetY = (height - baseHeight * scaleFactor) / 2;
}

function applyTransform() {
  translate(offsetX, offsetY);
  scale(scaleFactor);
}

function keyPressed() {
  if (key === ' ') {
    let newSeed = int(random(10000));
    randomSeed(newSeed);
    noiseSeed(newSeed);
    setupCircles();
  }
}

class SplitCircle {
  constructor(x, y, r, leftRatio, leftColor, rightColor, borderColor, borderWidth, angle = 0) {
    this.originalX = x;
    this.originalY = y;
    this.r = r;
    this.leftRatio = leftRatio;
    this.leftColor = leftColor;
    this.rightColor = rightColor;
    this.borderColor = borderColor;
    this.borderWidth = borderWidth;
    this.angle = angle;

    this.seedOffset = random(100);
    this.noiseX = random(800);
    this.noiseY = random(2000);
    this.noiseSpeed = random(0.0003, 0.001);
    this.noiseAmplitude = random(20, 60);
  }

  display() {
    push();
    let t = millis();

    let offsetX = (noise(this.noiseX + t * this.noiseSpeed) - 0.5) * 2 * this.noiseAmplitude;
    let offsetY = (noise(this.noiseY + t * this.noiseSpeed) - 0.5) * 2 * this.noiseAmplitude;

    let x = this.originalX + offsetX;
    let y = this.originalY + offsetY;

    let noiseVal = noise(this.originalX * 0.01, this.originalY * 0.01, t * 0.0003 + this.seedOffset);
    this.angle = noiseVal * TWO_PI;

    let pulse = sin(t * 0.002 + this.seedOffset) * 1.5;
    let d = (this.r + pulse) * 2;

    fill(...this.rightColor);
    noStroke();
    ellipse(x, y, d, d);

    let normalX = cos(this.angle);
    let normalY = sin(this.angle);
    let threshold = (2 * this.leftRatio - 1) * this.r;

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

    stroke(...this.borderColor);
    strokeWeight(this.borderWidth / scaleFactor);
    noFill();
    ellipse(x, y, d, d);
    pop();
  }
}

class Rect {
  constructor(x, y, width, height, fillColor, borderColor, borderWidth = 1) {
    this.x = x;
    this.y = y;
    this.baseW = width;
    this.baseH = height;
    this.fillColor = fillColor;
    this.borderColor = borderColor;
    this.borderWidth = borderWidth;
    this.phase = random(TWO_PI);  // 每个 Rect 有自己的节奏
    this.speed = random(0.001, 0.005); // 动画节奏
    this.amplitude = random(4, 20); // 变化幅度
  }

  draw() {
    this.drawAnimated(); // 默认使用动画绘制
  }

  drawAnimated() {
    push();
    let t = millis();

    let pulse = sin(t * this.speed + this.phase) * this.amplitude;
    let w = this.baseW + pulse;
    let h = this.baseH + pulse;

    stroke(...this.borderColor);
    strokeWeight(this.borderWidth);
    fill(...this.fillColor);
    rect(this.x, this.y, w, h, 4); // 带圆角效果更柔和
    pop();
  }
}

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
    let floatY = sin(millis() / 600 + this.x * 0.1) * 20;
    stroke(...this.borderColor);
    strokeWeight(this.borderWidth);
    fill(...this.fillColor);
    arc(this.x, this.y + floatY, this.r * 2, this.r * 2, PI, 0, PIE);
  }
}
