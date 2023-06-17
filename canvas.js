let canvas = document.querySelector("canvas");
const pi = Math.PI;

let c = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let mouse = {
  x: undefined,
  y: undefined
};

window.addEventListener('resize',function() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  init();
})

window.addEventListener('mousemove',function(e) {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
})

const colors = ["#73EEDC","#D9BBF9","#E6AF2E","#CE4760"];

function generateRandomColor() {
  let index = Math.floor(Math.random()*colors.length);
  return colors[index];
}

function generateRandomInt(x, y){
  return Math.floor(Math.random()*(y-x+1)) + x;
}

function generateRandomNum(x, y){
  return Math.random()*(y-x+1) + x;
}

function getDistance(x1, y1, x2, y2){
  return Math.sqrt(Math.pow(x2-x1,2) + Math.pow(y2-y1,2));
}

function Particle(x, y, r,opacity, dx, dy){
  this.x = x;
  this.y = y;
  this.r = r;
  this.opacity = opacity;
  this.velocity = {
    x : generateRandomNum(-2,2),
    y : generateRandomNum(-2,2)
  };
  this.color = generateRandomColor();

  this.draw = function(){
    c.beginPath();
    c.arc(this.x,this.y,this.r,0,2*pi,false);
    c.save();
    c.globalAlpha = this.opacity;
    c.fillStyle = this.color;
    c.fill();
    c.restore();
    c.strokeStyle = this.color;
    c.stroke();
    c.closePath();
  };

  this.update = function(particles){

    // detect collision
    particles.forEach(particle => {
      if(this === particle) return;
      let dist = getDistance(this.x + this.velocity.x, this.y + this.velocity.y, particle.x, particle. y);
      if(dist <= 2*r)
      {
        let velocity = this.velocity;
        this.velocity = particle.velocity;
        particle.velocity = velocity;
      }
    });

    // detect mouse interaction
    let dist = getDistance(this.x, this.y, mouse.x, mouse.y);
    if(dist < 150)
      this.opacity = Math.min(0.3,this.opacity + 0.02);
    else
      this.opacity = Math.max(0,this.opacity - 0.02);

    // bouncy on walls
    if(this.x + this.r > innerWidth || this.x - this.r < 0)
      this.velocity.x = -this.velocity.x;
    if(this.y + this.r > innerHeight || this.y - this.r < 0)
      this.velocity.y = -this.velocity.y;

    // update position
    this.x += this.velocity.x;
    this.y += this.velocity.y;

  };

}

let particles = [];
let r = 15;
function init(){
  particles = [];
  numberOfParticles = (innerWidth*innerHeight)/4000;
  for (let i = 0; i < numberOfParticles; i++) {
    let x, y;

    while(true){
      x = generateRandomInt(r,innerWidth-r);
      y = generateRandomInt(r,innerHeight-r);
      let colliding = false;

      particles.forEach(particle => {
        let dist = getDistance(x, y, particle.x, particle.y);
        if(dist <= 2*r)
          colliding = true;
      });

      if(colliding === false)
        break;
    }

    particles.push(new Particle(x, y, r, 0));
  }
}

function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0,0,innerWidth,innerHeight);
  particles.forEach(particle => {
    particle.draw();
    particle.update(particles);
  });
}

init();
animate();