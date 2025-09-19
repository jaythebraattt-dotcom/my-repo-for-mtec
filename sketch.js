let raindrops = [];
let cloud;
let numRaindrops = 100;

function setup() {
  createCanvas(800, 600);
  cloud = new Cloud();
  
  // Create the raindrops
  for (let i = 0; i < numRaindrops; i++) {
    raindrops.push(new Raindrop());
  }
}

function draw() {
  background(135, 206, 235); // Light blue sky

  // Draw the grass
  fill(34, 139, 34); // Grass green color
  noStroke();
  rect(0, height - 50, width, 50);
  
  // Update and display the raindrops
  for (let drop of raindrops) {
    drop.update();
    drop.show();
  }

  // Draw the cloud
  cloud.update();
  cloud.show();
}

// Raindrop class
class Raindrop {
  constructor() {
    this.x = random(width);
    this.y = random(-200, -50);
    this.length = random(10, 20);
    this.speed = random(4, 6);
  }

  update() {
    this.y += this.speed;
    if (this.y > height) {
      this.y = random(-200, -50);
      this.x = random(width);
    }
  }

  show() {
    stroke(255);
    line(this.x, this.y, this.x, this.y + this.length);
  }
}

// Cloud class
class Cloud {
  constructor() {
    this.x = width / 2 - 100;
    this.y = 100;
    this.size = 150;
  }

  update() {
    this.x += 1; // Moves the cloud slowly
    if (this.x > width) {
      this.x = -this.size; // Reset cloud position if it goes off-screen
    }
  }

  show() {
    fill(169, 169, 169); // Cloud grey color
    noStroke();
    ellipse(this.x + 50, this.y, this.size, this.size / 2);
    ellipse(this.x + 100, this.y - 20, this.size, this.size / 2);
    ellipse(this.x + 150, this.y, this.size, this.size / 2);

    // Adding an "angry" look with eyes
    fill(0);
    ellipse(this.x + 75, this.y - 20, 10, 10); // Left eye
    ellipse(this.x + 125, this.y - 20, 10, 10); // Right eye

    // Angry brows
    stroke(0);
    line(this.x + 70, this.y - 30, this.x + 80, this.y - 40); // Left brow
    line(this.x + 120, this.y - 30, this.x + 130, this.y - 40); // Right brow
  }
}
