// Galaxy Jump Race v5 by Jayden Ford
// Full Screen + Twinkling & Drifting Stars + Lava + Timer + Best Score

let players = [];
let blocks = [];
let boosts = [];
let stars = [];
let gameState = "playing";
let winner = "";
let lavaY;
let startTime;
let bestTime = null;
let colorPhase = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100);
  resetGame();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  resetGame();
}

function resetGame() {
  // Stars (with movement + brightness)
  stars = [];
  for (let i = 0; i < 250; i++) {
    stars.push({
      x: random(width),
      y: random(height),
      size: random(1, 3),
      speed: random(0.1, 0.5),
      brightness: random(70, 100),
      flickerSpeed: random(0.02, 0.05)
    });
  }

  lavaY = height - 10;

  // Players
  players = [
    new Player(100, height - 60, color(120, 100, 100), "Player 1"), // Green
    new Player(100, height - 120, color(330, 60, 100), "Player 2")  // Pink
  ];

  // Blocks
  blocks = [];
  let xStart = 100;
  for (let i = 0; i < 10; i++) {
    blocks.push(new Block(xStart, height - 50, 100, 20));
    xStart += 180;
  }
  blocks.push(new Block(xStart, height - 50, 250, 20, true));

  // Boost pads
  boosts = [];
  for (let i = 0; i < 3; i++) {
    boosts.push(new Boost(random(200, xStart - 100), height - 60));
  }

  winner = "";
  gameState = "playing";
  startTime = millis();
}

function draw() {
  drawGalaxy();

  if (gameState === "playing") {
    drawLava();

    for (let block of blocks) block.show();
    for (let b of boosts) b.show();

    for (let p of players) {
      p.applyGravity();
      p.move();
      p.checkBlockCollision(blocks);
      p.checkBoost(boosts);
      p.show();

      // Fell into lava
      if (p.y > lavaY - 5 && !p.fallingInLava) {
        p.fallingInLava = true;
        p.lavaFallStart = millis();
      }

      if (p.fallingInLava) {
        p.fallIntoLava();
      }

      // Win check
      if (p.x > blocks[blocks.length - 1].x + 50) {
        winner = p.name;
        gameState = "won";
        let currentTime = (millis() - startTime) / 1000;
        if (!bestTime || currentTime < bestTime) bestTime = currentTime;
      }
    }

    drawScoreboard();
    drawTimer();
  } else if (gameState === "won") {
    drawWinScreen();
  }
}

function keyPressed() {
  if (gameState === "playing") {
    // Player 1
    if (key === 'W') players[0].jump();
    if (key === 'D') players[0].x += players[0].speed;

    // Player 2
    if (keyCode === UP_ARROW) players[1].jump();
    if (keyCode === RIGHT_ARROW) players[1].x += players[1].speed;
  } else if (gameState === "won" && (key === 'x' || key === 'X')) {
    resetGame();
  }
}

// ======= CLASSES =======

class Player {
  constructor(x, y, c, name) {
    this.x = x;
    this.y = y;
    this.size = 30;
    this.color = c;
    this.name = name;
    this.ySpeed = 0;
    this.onGround = false;
    this.isFalling = false;
    this.speed = 10;
    this.fallingInLava = false;
    this.lavaFallStart = 0;
  }

  applyGravity() {
    this.ySpeed += 0.8;
    this.y += this.ySpeed;

    if (this.y + this.size > height) {
      this.y = height - this.size;
      this.ySpeed = 0;
      this.onGround = true;
    }
  }

  jump() {
    if (this.onGround && !this.fallingInLava) {
      this.ySpeed = -15;
      this.onGround = false;
    }
  }

  move() {
    if (this.isFalling) this.y += 10;
  }

  checkBlockCollision(blocks) {
    this.onGround = false;
    for (let b of blocks) {
      if (
        this.x + this.size > b.x &&
        this.x < b.x + b.w &&
        this.y + this.size > b.y &&
        this.y + this.size < b.y + 20
      ) {
        this.y = b.y - this.size;
        this.ySpeed = 0;
        this.onGround = true;
      }
    }
  }

  checkBoost(boosts) {
    for (let b of boosts) {
      if (dist(this.x, this.y, b.x, b.y) < 30) {
        this.speed = 18;
        setTimeout(() => (this.speed = 10), 1500);
      }
    }
  }

  fallIntoLava() {
    let elapsed = millis() - this.lavaFallStart;
    fill(15, 100, 100, 0.7);
    ellipse(this.x + 15, lavaY - 5, 40, 15);
    this.y += 2;
    if (elapsed > 800) this.y = height + 100;
  }

  show() {
    fill(this.color);
    rect(this.x, this.y, this.size, this.size);
  }
}

class Block {
  constructor(x, y, w, h, finish = false) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.finish = finish;
  }

  show() {
    if (this.finish) {
      fill(200);
      rect(this.x, this.y, this.w, this.h);
      fill("red");
      triangle(this.x + this.w - 20, this.y, this.x + this.w - 5, this.y + 20, this.x + this.w - 20, this.y + 20);
    } else {
      fill(220, 70, 100);
      rect(this.x, this.y, this.w, this.h);
    }
  }
}

class Boost {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  show() {
    fill(60, 100, 100);
    ellipse(this.x, this.y - 10, 20, 10);
  }
}

// ======= VISUALS =======

function drawGalaxy() {
  // Color shifting galaxy
  colorPhase += 0.5;
  if (colorPhase > 360) colorPhase = 0;
  let bgColor = color(colorPhase, 80, 20);
  background(bgColor);

  // Twinkling drifting stars
  noStroke();
  for (let s of stars) {
    s.x -= s.speed;
    s.brightness += sin(frameCount * s.flickerSpeed) * 0.5;
    if (s.x < 0) s.x = width;
    fill(60, 0, s.brightness);
    circle(s.x, s.y, s.size);
  }
}

function drawLava() {
  noStroke();
  for (let i = 0; i < 10; i++) {
    fill(15, 100, 100, 0.6);
    rect(0, lavaY + i * 2, width, 10);
  }
}

function drawScoreboard() {
  fill(0, 0, 100);
  textSize(18);
  textAlign(LEFT);
  text("🏁 Galaxy Jump Race", width - 250, 50);
  textSize(14);
  fill(120, 100, 100);
  text("Player 1 (W/D): Green", width - 250, 80);
  fill(330, 60, 100);
  text("Player 2 (↑/→): Pink", width - 250, 100);
  fill(60, 100, 100);
  text("⚡ Boost Pads = Speed Boost!", width - 250, 130);
}

function drawTimer() {
  fill(0, 0, 100);
  textSize(16);
  let elapsed = (millis() - startTime) / 1000;
  text(`⏱ Time: ${elapsed.toFixed(2)}s`, width - 250, 160);
  if (bestTime) text(`🏆 Best: ${bestTime.toFixed(2)}s`, width - 250, 180);
}

function drawWinScreen() {
  drawGalaxy();
  textAlign(CENTER, CENTER);
  textSize(40);
  fill(0, 0, 100);
  text(`${winner} WON! 🏆`, width / 2, height / 2 - 40);
  textSize(20);
  text("Press 'X' to restart", width / 2, height / 2 + 20);
}
