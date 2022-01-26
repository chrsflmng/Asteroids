var asteroids = {
  list:[],
  sizes:{
    large: 40,
    medium: 25,
    small: 15
  },
  draw: function(){
    for (var i = 0; i < this.list.length; i++) {
          drawPolygon(this.list[i], false);
    }
  },
  update: function() {
      var l = this.list.length;
      for (var i = 0; i < l; i++) {
          this.list[i].pos[0] += this.list[i].vel[0];
          this.list[i].pos[1] += this.list[i].vel[1];
          boundaryCheck(this.list[i]);
      }
  },
  fragment: function(asteroid){
    if(asteroid.size === "small"){
      score += 100;
    }
    else{
      var newSize;
      if(asteroid.size === "large"){
        newSize = "medium";
        score += 20;
      }
      if(asteroid.size === "medium"){
        newSize = "small";
        score += 50;
      }
      var oldVx = asteroid.vel[0];
      var oldVy = asteroid.vel[1];
      this.generate(newSize, [asteroid.pos[0],asteroid.pos[1]],[oldVx-oldVy,oldVy+oldVx]);
      this.generate(newSize, [asteroid.pos[0],asteroid.pos[1]],[oldVx+oldVy,oldVy-oldVx]);
    }
  },
  generate: function(type, pos, vel){
    var b = asteroids.sizes[type];
    var a = b*0.6;
    var c = a/1.414;
    var d = b/1.414;
    var newOutline = [
      [0,rndBtwn(a,b)],
      [-rndBtwn(c,d),rndBtwn(c,d)],
      [-rndBtwn(a,b),0],
      [-rndBtwn(c,d),-rndBtwn(c,d)],
      [0,-rndBtwn(a,b)],
      [rndBtwn(c,d),-rndBtwn(c,d)],
      [rndBtwn(c,d),0],
      [rndBtwn(c,d),rndBtwn(c,d)]
    ];
    var newPos = pos;
    if(pos === undefined){
      var buffer = 50;
      newPos = [rndBtwn(0,canvas.width - 2*buffer),rndBtwn(0,canvas.height- 2*buffer)];
      if(newPos[0] > ship.pos[0] - buffer){
        newPos[0] += 2*buffer;
      }
      if(newPos[1] > ship.pos[1] - buffer){
        newPos[1] += 2*buffer;
      }
    }
    var speed = 0.8;
    var dx, dy;
    if(vel === undefined){
      var dx = (Math.random() * 2 - 1) * speed;
      var dy = Math.sqrt(speed * speed - dx * dx) * (2 * Math.floor(Math.random() * 2) - 1);
    }
    else{
      dx = vel[0];
      dy = vel[1];
    }
    asteroids.list.push({
      outline: newOutline,
      pos: newPos,
      boundingRadius: b,
      vel: [dx, dy],
      size: type
    })
  },
  reset: function(){
    this.list = [];
  }
}

var explosions = {
  list:[],
  generate: function(centre){
    var debrisAmount = rndBtwn(3,6);
    var debrisPositions = [];
    var debrisVelocities= [];
    for(var i = 0; i < debrisAmount; i++){
      debrisPositions.push([0,0]);
      debrisVelocities.push([Math.random()*2-1,Math.random()*2-1]);
    }
    this.list.push({
          pos: centre,
          debris: debrisPositions,
          velocities:debrisVelocities,
          lifetime: 100
        })
  },
  draw: function(){
    for(var i = this.list.length - 1; i > -1; i--){
      for(var j = this.list[i].debris.length - 1; j > -1;j --){
        var piece = this.list[i]
        var x = piece.pos[0];
        var y = piece.pos[1];
        var xOffset = piece.debris[j][0];
        var yOffset = piece.debris[j][1];
        var x0 = x + xOffset;
        var y0 = y + yOffset;
        ctx.fillStyle = "#00FF00";
        ctx.fillRect(x0,y0,2,2);
      }
    }
  },
  update: function(){
    for(var i = this.list.length - 1; i > -1; i--){
      var piece = this.list[i];
      if(piece.lifetime < 1){
        this.list.splice(i,1);
      }
      else{
        for(var j = piece.debris.length - 1; j > -1;j --){
          piece.debris[j][0] += piece.velocities[j][0];
          piece.debris[j][1] += piece.velocities[j][1];
        }
        piece.lifetime --;
      }
    }
  },
  reset: function(){
    this.list = [];
  }
}
