var x = 0;
var y = 0;

var drawCircle = true;

const ACCELERATION = 9.8;
const MU = 0.23;
var ivX;
var ivY;

var bouncePercent = 30;

var normalFR = 60;
var time = 1/normalFR;

var sign = "";

var mass = 5;
var height;
var velocity;
var energy;
var pe;
var ke;

const circleList = [];
var index = 0;
var colorIndex = 0;

var mode = 1;

var click = 1;
var thisCircle;

function setup() {
  createCanvas(windowWidth, windowHeight);
  smooth();
  textSize(20);
  textAlign(20, 20);
  frameRate(normalFR);

  colorMode(HSB);
}

function draw() {
  background(173,91,72);
  for (i = 0; i < circleList.length; i++) {
    if (circleList[i].drawCircle) {
    circleList[i].display();
    circleList[i].move();
  }
  }
  
}

function mousePressed() {
  if (click == 1) {
  circleList[index] = new PhysicsObject(20,drawCircle,mass,colorIndex);
  colorIndex += 10;
  if (colorIndex >= 360) colorIndex = 0;
  index++;
  }
  if (click == 2) {
    for (i = 0; i < circleList.length; i++) {
      thisCircle = circleList[i];
      if (thisCircle.x + 10 >= mouseX && thisCircle.x - 10 <= mouseX && thisCircle.y + 10 >= mouseY && thisCircle.y - 10 <= mouseY) {
        thisCircle.showText = !thisCircle.showText;
      }
    }
  }
}

function keyTyped() {
  if (key == "s") {
    if (mode == 1) {frameRate(30); mode++;}
    else if (mode == 2)  {frameRate(15); mode++;}
    else if (mode == 3) {frameRate(1); mode++;}
    else if (mode == 4) {frameRate(60); mode = 1;}
  }
  if (key == "1") {
    click = 1;
  }
  if (key == "2") {
    click = 2;
  }
}








class PhysicsObject {
  constructor(size,drawCircle,mass,color) {
    this.size = size;
    this.mass = mass;

    this.x = mouseX;
    this.y = mouseY;
    this.vX = pmouseX - mouseX;
    this.vY = mouseY - pmouseY;
    this.pY = this.y;


    if (this.vX == 0) {
      this.angle = (Math.PI / 2);
    }
    else {
      this.angle = Math.atan((this.vY) / (this.vX));
    }
    if (this.angle != 0) {
      this.velocity = this.vY / (Math.sin(this.angle));
    }
    else {
      this.velocity = this.vX / (Math.cos(this.angle));
    }

    this.drawCircle = drawCircle;

    this.height = (windowHeight - this.y) / normalFR;
    this.maxHeight;

    this.gpe = this.getPE(this.mass, this.height);
    this.ke = this.getKE(this.mass, this.velocity);
    this.energy = this.getE(this.gpe, this.ke);
    this.maxGPE = this.energy - this.getKE(this.mass, this.vX);

    this.color = color;

    this.fF;
    this.fG;
    this.fN;

    this.showText = false;
    this.sign;

    this.momentum;
  }

  move() {

    //calculations
    this.pY = this.y;
    this.y = (this.y + (this.vY) + (0.5 * ACCELERATION * time * time));
    this.x = this.x - this.vX;
    this.vY = this.vY + (ACCELERATION * time);

    if (this.y > windowHeight) {
      this.y = windowHeight;
    }

    this.height = (windowHeight - this.y) / normalFR;

    this.gpe = this.getPE(this.mass, this.height);
    this.ke = this.getKE(this.mass, this.velocity);
    this.energy = this.getE(this.gpe, this.ke);

    //boundaries
    if (this.x >= windowWidth) {
      this.x = 0;
    }
    else if (this.x <= 0) {
      this.x = windowWidth;
    }

    //energy & ff calculation
    if (this.y >= windowHeight) {
      this.maxGPE *= (bouncePercent / 100);
      
      this.maxHeight = (this.maxGPE) / (this.mass * ACCELERATION);
      this.vY = 0 - Math.sqrt(2 * ACCELERATION * this.maxHeight);
      
      if (Math.round(this.vX) != 0) {
        if (this.vX > 0)
          this.vX = this.vX - (MU * ACCELERATION * time);
        else if (this.vX < 0)
        this.vX = this.vX + (MU * ACCELERATION * time);
      }
      else {
        this.vX = 0;
        this.angle = 0;
      }

    }

  }


  display() {
    let c = color(this.color, 100, 100);
    fill(c);
    circle(this.x, this.y, this.size);
    noStroke();
    if (this.showText) {
      fill(0, 0, 0)
      text("Index: " + (i + 1) + "\nMass: " + this.mass + "\nAngle: " + (this.angle * (180 / Math.PI)) +  "\nHeight: " + Math.round(this.height), this.x + 15, this.y - 80)
    }
  }  

  getKE(m, v) {
    return 0.5 * m * v * v;
  }

  getPE(m, h) {
    return m * ACCELERATION * h;
  }

  getE(pe, ke) {
    return pe + ke;
  }

}



  

