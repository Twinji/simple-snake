const WIDTH = 1027, HEIGHT = 768;
var canvas, c;
var cs = 12, cg = 2;

var cWidth = WIDTH / cs;
var cHeight = HEIGHT / cs;

var snakes = new Array();
var targets = new Array();

var up = 38, down = 40, right = 39, left = 37;
var key = new Array();
document.addEventListener("keydown", function(e) {
    key[e.keyCode] = true;
});

document.addEventListener("keyup", function(e) {
    key[e.keyCode] = false;
});

var Snake = function(x, y, speed, trailLength) {
    snakes.push(this);
    this.x = x;
    this.y = y;
    this.velX = speed;
    this.velY = 0;
    this.speed = speed;
    this.trailLength = trailLength;
    this.trail = new Array();

    this.update = function() {
        this.trail.push([this.x, this.y]);

        if (this.trail.length > this.trailLength) {
            this.trail.shift();
        }

        for (var i = 0; i < targets.length; i++) {
            var t = targets[i];
            if (t.x == this.x && t.y == this.y) {
                this.trailLength += t.size;
                targets.splice(i, 1);
            }
        }

        if (key[up]) {
            this.velY = this.velY == speed ? this.velY : -speed;
            this.velX = 0;
        }
        if (key[down]) {
            this.velY = this.velY == -speed ? this.velY : speed;
            this.velX = 0;
        }
        if (key[left]) {
            this.velY = 0;
            this.velX = this.velX == speed ? this.velX : -speed;
        }
        if (key[right]) {
            this.velY = 0;
            this.velX = this.velX == -speed ? this.velX : speed;
        }

        this.x += this.velX;
        this.y += this.velY;

        if (this.x >= cWidth) this.x -= cWidth;
        if (this.y >= cHeight) this.y -= cHeight;
        if (this.x < 0) this.x += cWidth;
        if (this.y < 0) this.y += cHeight;

        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);

        for (var i = 0; i < this.trail.length; i++) {
            var t = this.trail[i];
            if (t[0] == this.x && t[1] == this.y) {
                alert("You died.");
                location.reload();
            }
        }
    }
    this.render = function() {
        c.fillStyle = "red";
        c.fillRect(this.x * cs + cg, this.y * cs + cg, cs - cg, cs - cg);

        c.fillStyle = "orange";
        for (var i = 0; i < this.trail.length; i++) {
            var t = this.trail[i];
            c.fillRect(t[0] * cs + cg, t[1] * cs + cg, cs - cg, cs - cg);
        }
    }
}

var Target = function(x, y, size) {
    targets.push(this);
    this.x = x;
    this.y = y;
    this.size = size;
    this.render = function() {
        c.fillStyle = "pink";
        c.fillRect(this.x * cs + cg, this.y * cs + cg, cs - cg, cs - cg);
    }
}

function main() {
    canvas = document.getElementById("canvas");
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    c = canvas.getContext('2d');

    new Snake(10, 10, 1, 10);

    for (var i = 0; i < 60; i++) {
        new Target(
            Math.floor(Math.random() * cWidth),
            Math.floor(Math.random() * cHeight),
            2
        );
    }

    window.setInterval(function() {
        update();
        render();
    }, 1000 / 30);
}

function update() {
    for (var i = 0; i < snakes.length; i++) snakes[i].update();
    if (targets.length == 0) {
        alert("You win!");
        location.reload();
    }
}

function render() {
    c.fillStyle = "black";
    c.globalAlpha = 0.2;
    c.fillRect(0, 0, WIDTH, HEIGHT);
    c.globalAlpha = 1;
    for (var i = 0; i < snakes.length; i++) snakes[i].render();
    for (var i = 0; i < targets.length; i++) targets[i].render();
}
