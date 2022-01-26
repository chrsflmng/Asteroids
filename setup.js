//Things to improve:
//-Reset function
//-Stop bullets firing
//-Spring clean the code

var canvas = document.getElementById('space');
var ctx = canvas.getContext('2d');
canvas.width = window.innerWidth - 2*document.getElementById('space').offsetLeft;
canvas.height = window.innerHeight - 2*document.getElementById('space').offsetTop;
var colour = "#44ff44" //Colour of lines
var frame = 0;
var score = 0;
var lives = 3;
var level = 1;

function setup(){
  startLevel();
  main();
}

function startLevel(){
  for (var i = 0; i < 4 + level; i++) {
    asteroids.generate("large");
  }
}

function gameReset(){
  ship.reset();
  asteroids.reset();
  explosions.reset();
  bullets.reset();
  frame = 0;
  score = 0;
  lives = 3;
  level = 1;
  startLevel();
}

function main() {
    frame++;
    clearCanvas();
    ship.draw();
    bullets.draw();
    asteroids.draw();
    explosions.draw();
    writeScore();
    collisionCheck();
    hitCheck();
    ship.update();
    bullets.update();
    asteroids.update();
    explosions.update();
    requestAnimationFrame(main);
}

function writeScore(){
  ctx.textBaseline = 'top';
  ctx.font = '18px Roboto Mono';
  ctx.fillStyle = colour;
  ctx.fillText(score, 10, 5);
  for(var i = 0; i < lives; i++){
    drawPolygon({outline: [[6, 9],[-6, 9],[0, -9]],pos:[15 + 20*i,40]}, false)
  }
}

function drawPolygon(polygon, fill) {
    var xOffset = polygon.pos[0];
    var yOffset = polygon.pos[1];
    ctx.beginPath();
    var x0 = polygon.outline[0][0] + xOffset;
    var y0 = polygon.outline[0][1] + yOffset;
    ctx.moveTo(x0, y0);
    for (var i = 1; i < polygon.outline.length; i++) {
        var xi = polygon.outline[i][0] + xOffset;
        var yi = polygon.outline[i][1] + yOffset;
        ctx.lineTo(xi, yi);
    }
    ctx.lineTo(x0, y0);
    if(fill == true){
      ctx.fillStyle = colour;
      ctx.fill();
    }
    else{
      ctx.strokeStyle = colour;
      ctx.stroke();
    }
}

function rotatePolygon(ang, polygon) {
    for (var i = 0; i < polygon.length; i++) {
        var xOld = polygon[i][0];
        var yOld = polygon[i][1];
        //var xNew = xOld * Math.cos(ang * Math.PI / 180) - yOld * Math.sin(ang * Math.PI / 180);
        //var yNew = xOld * Math.sin(ang * Math.PI / 180) + yOld * Math.cos(ang * Math.PI / 180);
        //The code below uses the small angle approximations of sin and cos instead of calling the sin and cose from the Math object each time.
        var xNew = xOld * (1-(ang * Math.PI / 180)**2/2) - yOld * (ang * Math.PI / 180);
        var yNew = xOld * (ang * Math.PI / 180) + yOld * (1-(ang * Math.PI / 180)**2/2);
        polygon[i][0] = xNew;
        polygon[i][1] = yNew;
    }
}

function boundaryCheck(obj){
  if (obj.pos[0] > canvas.width + 20) {
      obj.pos[0] = -19
  };
  if (obj.pos[0] < -20) {
      obj.pos[0] = canvas.width + 19
  };
  if (obj.pos[1] > canvas.height + 20) {
      obj.pos[1] = -19
  };
  if (obj.pos[1] < -20) {
      obj.pos[1] = canvas.height + 19
  };
}

function rndBtwn(a,b){
  return Math.floor(a + Math.random()*(b - a + 1));
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
