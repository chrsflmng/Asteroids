var ship = {
    outline: [
        [10, 15],
        [-10, 15],
        [0, -15]
    ],
    boundingRadius: 15,
    pos: [canvas.width / 2, canvas.height / 2],
    angle: 0,
    thrust: 0.04,
    accelerating: false,
    rotation: 0,
    vel: [0, 0],
    dying: false,
    flare: [[-7,15],[7,15],[0,30]],
    draw: function(){
      if(!this.dying){
        if(this.recoverytime > 0){
          if(frame % 20 > 10){
            drawPolygon(ship, false);
          }
        }
        else{
          drawPolygon(ship, false);
        }
        if(ship.accelerating == true){
          if(frame % 4 == 0){
            drawPolygon({outline: ship.flare, pos: ship.pos}, true);
          }
        }
      }
      else{
        for(var i = this.fragments.length -1; i > -1; i--){
          var xOffset = this.fragPos[i][0];
          var yOffset = this.fragPos[i][1];
          ctx.beginPath();
          var x0 = this.fragments[i][0][0] + xOffset;
          var y0 = this.fragments[i][0][1] + yOffset;
          ctx.moveTo(x0, y0);
          var x1 = this.fragments[i][1][0] + xOffset;
          var y1 = this.fragments[i][1][1] + yOffset;
          ctx.lineTo(x1, y1);
          ctx.stroke();
          }
        }
      },
    update: function(){
      if(!this.dying){
        var degrees = 4 * ship.rotation;
        ship.angle += degrees;
        rotatePolygon(degrees, ship.outline);
        rotatePolygon(degrees, ship.flare);
        ship.pos[0] += ship.vel[0];
        ship.pos[1] += ship.vel[1];
        if (ship.accelerating == true) {
            ship.vel[0] += ship.thrust * Math.sin(ship.angle * Math.PI / 180)
            ship.vel[1] += -ship.thrust * Math.cos(ship.angle * Math.PI / 180)
        }
        boundaryCheck(ship);
        if(this.recoverytime > 0){
          this.recoverytime --;
        }
      }
      else{
        for(var i = this.fragPos.length - 1; i > -1; i--){
          this.fragPos[i][0] += this.fragVel[i][0];
          this.fragPos[i][1] += this.fragVel[i][1];
        }
        if(this.deathtime < 1 && lives > 0){
          this.dying = false;
          this.fragments = [];
          this.fragPos = [],
          this.recoverytime = 100;
          this.reset();
        }
        else{
          this.deathtime --;
        }
      }
    },
    reset: function(){
      this.outline = [[10, 15],[-10, 15],[0, -15]];
      this.pos = [canvas.width / 2, canvas.height / 2];
      this.angle = 0;
      this.vel = [0, 0];
      this.flare =[[-7,15],[7,15],[0,30]];
    },
    fragments: [],
    fragVel: [[-1.5,-1],[1,-1.5],[0,2]],
    fragPos: [],
    deathtime: 0,
    recoverytime: 0,
    explode: function(){
      if(!this.dying){
        lives -= 1;
        this.dying = true;
        this.deathtime = 50;
        var outline = this.outline;
        var l = this.outline.length;
        for(var i =  0; i < l; i ++){
          var pieceA = [outline[i][0],outline[i][1]];
          var j = i + 1;
          if(j + 1 > l - 1){
            j = 0;
          }
          var pieceB = [outline[j][0],outline[j][1]];
          this.fragments.push([pieceA,pieceB]);
          this.fragPos.push([this.pos[0],this.pos[1]]);
        }
      }
    }
}
