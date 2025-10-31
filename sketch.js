
let girlX = 0;
let step = 0;
let jumpOffset = 0;
let isJumping = false;
let jumpProgress = 0;
let girlY = 280;

let skyColors = [
  [255, 0, 0],     // Red
  [255, 255, 255], // White
  [0, 0, 255]      // Blue
];
let currentSky = 0;

let sunAngle = 0;
let sunDirection = 1;

let obstacles = [];

function setup() {
  createCanvas(800, 400);
  frameRate(30);

  // Create some random obstacles (brown blocks)
  for (let i = 0; i < 5; i++) {
    let x = random(200, width * 2); // Spread over wide range
    obstacles.push({ x: x, y: 330, w: 40, h: 20 });
  }
}

function draw() {
  drawBackground();

  // Sun rotation
  sunAngle += 0.01 * sunDirection;
  if (sunAngle > 0.3 || sunAngle < -0.3) {
    sunDirection *= -1;
  }

  drawSun();

  // Handle jumping
  if (isJumping) {
    jumpProgress += 0.1;
    jumpOffset = -sin(jumpProgress) * 50;

    if (jumpProgress >= PI) {
      isJumping = false;
      jumpOffset = 0;
      jumpProgress = 0;
    }
  }

  // Move girl
  girlX += 2;
  step += 1;

  // Loop back
  if (girlX > width + 50) {
    girlX = -50;
  }

  drawObstacles();
  drawGirl(girlX, girlY + jumpOffset);
}

function drawBackground() {
  // Sky
  let c = skyColors[currentSky];
  background(c[0], c[1], c[2]);

  // Lava ground
  noStroke();
  for (let i = 0; i < height / 2; i++) {
    let r = map(i, 0, height / 2, 255, 180);
    let g = map(i, 0, height / 2, 100, 0);
    let b = 0;
    fill(r, g, b);
    rect(0, height / 2 + i, width, 1);
  }
}

function drawSun() {
  push();
  translate(700, 80);
  rotate(sunAngle);
  fill(255, 223, 0);
  noStroke();
  ellipse(0, 0, 80, 80);
  pop();
}

function drawGirl(x, y) {
  push();
  translate(x, y);

  // Hair
  fill(102, 51, 0);
  ellipse(0, -45, 45, 50);

  // Head
  fill(255, 220, 185);
  ellipse(0, -50, 30, 40);

  // Body
  fill(255, 100, 150);
  rect(-10, -30, 20, 40, 5);

  // Legs
  let legMovement = sin(step * 0.2) * 5;

  stroke(0);
  strokeWeight(3);
  line(-5, 10, -5 + legMovement, 30);
  line(5, 10, 5 - legMovement, 30);

  // Arms
  let armMovement = sin(step * 0.2 + PI) * 5;
  line(-10, -25, -20 + armMovement, -5);
  line(10, -25, 20 - armMovement, -5);

  pop();
}

function drawObstacles() {
  fill(139, 69, 19); // brown
  for (let obs of obstacles) {
    let screenX = obs.x - girlX + 100;
    if (screenX > -50 && screenX < width + 50) {
      rect(screenX, obs.y, obs.w, obs.h);
    }
  }
}

// 🔁 Mouse click changes the sky color only
function mousePressed() {
  currentSky = (currentSky + 1) % skyColors.length;
}

// ⌨️ Spacebar triggers jump
function keyPressed() {
  if (key === ' ' && !isJumping) {
    isJumping = true;
    jumpProgress = 0;
  }
}
