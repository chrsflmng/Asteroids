window.addEventListener('keydown', function(e) {
    e.preventDefault();
    switch (e.keyCode) {
        case 32:
            if(bullets.fired == false){
              bullets.shoot();
              bullets.fired = true;
            }
            break;
        case 37:
            ship.rotation = -1;
            break;
        case 38:
            ship.accelerating = true;
            break;
        case 39:
            ship.rotation = 1;
            break;
        case 82:
            gameReset();
    }
});

window.addEventListener('keyup', function(e) {
    e.preventDefault();
    switch (e.keyCode) {
        case 32:
          bullets.fired = false
          break;
        case 37:
            ship.rotation = 0;
            break;
        case 38:
            ship.accelerating = false;
            break;
        case 39:
            ship.rotation = 0;
    }
});

//Checks for collisions between the ship and asteroid OBS! Currently only works for 1 asteroid
function collisionCheck() {
  if(ship.recoverytime === 0 && ship.deathtime ===0){
    for(var k = 0; k < asteroids.list.length; k++) {
        var x = asteroids.list[k].pos[0] - ship.pos[0];
        var y = asteroids.list[k].pos[1] - ship.pos[1];
        var r = ship.boundingRadius + asteroids.list[k].boundingRadius
        if (x * x + y * y <= r * r) {
            var sOL = [];
            for (var i = 0; i < ship.outline.length; i++) {
                sOL.push([]);
                sOL[i][0] = ship.outline[i][0] + ship.pos[0];
                sOL[i][1] = ship.outline[i][1] + ship.pos[1];
            }
            var aOL = [];
            for (var i = 0; i < asteroids.list[k].outline.length; i++) {
                aOL.push([]);
                aOL[i][0] = asteroids.list[k].outline[i][0] + asteroids.list[k].pos[0];
                aOL[i][1] = asteroids.list[k].outline[i][1] + asteroids.list[k].pos[1];
            }
            shipVertices: //Checks intersections for each vertex of the ship's outline
            for (var i = 0; i < sOL.length; i++) {
                asteroidVertices: //Checks for each vertex of the asteroid
                for (var j = 0; j < aOL.length; j++) {
                    var iNext = i + 1;
                    //The below conditionals for iNext and jNext make sure that intersections involving the last vertices of polygons are also test for
                    if (iNext === sOL.length) {
                        iNext = 0;
                    }
                    var jNext = j + 1;
                    if (jNext === aOL.length) {
                        jNext = 0;
                    }
                    if (intersectTest(sOL[i], sOL[iNext], aOL[j], aOL[jNext])) {
                        ship.explode();
                        break shipVertices;
                    }
                }
            }
        }
    }
  }
}

function hitCheck(){
  for(var k = asteroids.list.length - 1; k > -1; k--){
    var aOL = [];
    for (var i = 0; i < asteroids.list[k].outline.length; i++) {
        aOL.push([]);
        aOL[i][0] = asteroids.list[k].outline[i][0] + asteroids.list[k].pos[0];
        aOL[i][1] = asteroids.list[k].outline[i][1] + asteroids.list[k].pos[1];
    }
    loopBullets:
    for (var h = bullets.list.length - 1; h > -1; h--) {
      var x = asteroids.list[k].pos[0] - bullets.list[h].pos[0];
      var y = asteroids.list[k].pos[1] - bullets.list[h].pos[1];
      var r = asteroids.list[k].boundingRadius + 3;
      if (x * x + y * y <= r * r) {
        var bulletPoint1 = bullets.list[h].pos;
        var bulletPoint2 = [bullets.list[h].pos[0]+bullets.list[h].vel[0]*bullets.size,bullets.list[h].pos[1]+bullets.list[h].vel[1]*bullets.size];
        loopVertices:
        for (var j = 0; j < aOL.length; j++) {
          var jNext = j + 1;
          if (jNext === aOL.length) {
              jNext = 0;
          }
          if (intersectTest(bulletPoint1, bulletPoint2, aOL[j], aOL[jNext])) {
              asteroids.fragment(asteroids.list[k]);
              explosions.generate(asteroids.list[k].pos);
              asteroids.list.splice(k,1);
              if(asteroids.list.length == 0){
                level ++;
                startLevel();
              }
              bullets.list.splice(h, 1);
              break loopBullets;
          }
        }
      }
    }
  }
}

function intersectTest(A, B, C, D) {
    //This function tests whether or not vectors between points AB and CD intersect, and finds the point of intersection
    var xAB = B[0] - A[0];
    var yAB = B[1] - A[1];
    var xCD = D[0] - C[0];
    var yCD = D[1] - C[1];
    var xAC = C[0] - A[0];
    var yAC = C[1] - A[1];
    //The simulateous equations for the x- and y-coordinates of these vectors has been rearranged to find two parametric variables; lambda and mu
    var lambda = (yCD * xAC - xCD * yAC) / (yCD * xAB - yAB * xCD);
    var mu = (yAB * xAC - xAB * yAC) / (yCD * xAB - yAB * xCD);
    //Lambda and mu are substitued back into the vector equations to find the point of intersection
    var intersection1 = [A[0] + lambda * xAB, A[1] + lambda * yAB];
    var intersection2 = [C[0] + mu * xCD, C[1] + mu * yCD];
    //If intersection1 != intersection2 something is wrong with this function!
    //Both lambda and mu must be between 0 and 1 for vectors to be intersecting
    if (lambda <= 1 && lambda >= 0 && mu <= 1 && mu >= 0) {
        return true;
        //console.log("Vectors intersect at: " + intersection1);
        //console.log("Lambda: " + lambda + " Mu: " + mu);
    } else {
        return false;
        //console.log("Vectors do not intersect")
        //console.log("Vectors would intersect at: " + intersection1);
    }
}
