var bullets = {
    list: [],
    speed: 6,
    size: 3,
    fired: false,
    draw: function() {
        var bL = bullets.list
        var l = bL.length;
        for (i = 0; i < l; i++) {
            var x = bL[i].pos[0];
            var y = bL[i].pos[1];
            var vX = bL[i].vel[0];
            var vY = bL[i].vel[1];
            ctx.beginPath();
            ctx.moveTo(x, y)
            ctx.lineTo(x + vX * bullets.size, y + vY * bullets.size);
            ctx.strokeStyle = "#44ff44";
            ctx.stroke();
        }
    },
    shoot: function() {
        var x = ship.pos[0];
        var y = ship.pos[1];
        var vX = Math.sin(ship.angle * Math.PI / 180) * bullets.speed;
        var vY = -Math.cos(ship.angle * Math.PI / 180) * bullets.speed;
        bullets.list.push({
            pos: [x, y],
            vel: [vX, vY],
            age: 0
        })
    },
    update: function() {
        var bL = bullets.list;
        var l = bL.length;
        var cWidth = canvas.width;
        var cHeight = canvas.height;
        for (var i = 0; i < l; i++) {
            var vX = bL[i].vel[0];
            var vY = bL[i].vel[1];
            bL[i].pos[0] += vX;
            bL[i].pos[1] += vY;
            bL[i].age += 1;
        }
        for (var i = l-1; i > -1; i--) {
            var x = bL[i].pos[0];
            var y = bL[i].pos[1];
            boundaryCheck(bL[i]);
            if (bL[i].age > 100) {
                bL.splice(i, 1);
            }
        }
    },
    reset: function(){
      this.list = [];
    }
};
