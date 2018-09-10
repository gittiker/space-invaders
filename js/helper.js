var bulletSpeed;
// helper functions
function AABBIntersect(ax, ay, aw, ah, bx, by, bw, bh) {
    return ax < bx+bw && bx < ax+aw && ay < by+bh && by < ay+ah;
};
// Bullets
function Bullet(x, y, vely, w, h, color) {
    this.x = x;
    this.y = y;
    this.vely = vely;
    this.width = w;
    this.height = h;
    this.color = color;
};

// Update Bullet position
Bullet.prototype.update = function() {
    this.y += this.vely * bulletSpeed;
};

// Display
function Display(width, height) {
    this.canvas = document.createElement("canvas");
    this.canvas.width = this.width = width;
    this.canvas.height = this.height = height;
    //context is a var that gives canvas the ability to draw
    this.ctx = this.canvas.getContext("2d");

    document.body.appendChild(this.canvas);
};

Display.prototype.clear = function() {
    this.ctx.clearRect(0, 0, this.width, this.height);
};

Display.prototype.drawSprite = function(sp, x, y) {
    //from x,y,w,h, in png to x,y,w,h in canvas or screen 
    this.ctx.drawImage(sp.img, sp.x, sp.y, sp.w, sp.h, x, y, sp.w, sp.h);
};

Display.prototype.drawBullet = function (bullet) {
    this.ctx.fillStyle = bullet.color;
    this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
};

// Sprite
function Sprite(img, x, y, w, h) {
    this.img = img;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
};

// InputHandler
function InputHandler() {
    this.down = {};
    this.pressed = {};

    var _this = this;
    //capture key presses 
    document.addEventListener("keydown", function(evt) {
        _this.down[evt.keyCode] = true;
    });
    document.addEventListener("keyup", function (evt) {
        delete _this.down[evt.keyCode];
        delete _this.pressed[evt.keyCode];
    });
};

InputHandler.prototype.isDown = function(code) {
    return this.down[code];
};

InputHandler.prototype.isPressed = function(code) {
    if(this.pressed[code]) {
        return false;
    } else if (this.down[code]) {
        return this.pressed[code] = true;
    }
    return false;
};

function UpdatePoints(points) {
    document.getElementById("punkte").textContent = points;
};

function UpdateLifes(lifes) {
    document.getElementById("leben").textContent = lifes;
    if (lifes == 0) {
        GameOver();
    }
};

function GameOver() {
    isRunning = false;
};

function WinGame() {
    isRunning = false;
};

function StartGame() {
    isRunning = true;
    hideMenuControl();
    PlaySound("startSound");
    main();
};

function EndGame() {
    isRunning = false;
    hideGameControl();
};

function SetDifficulty(setted) {
    switch (setted) {
        case "easy": {
            lvFrame = 60;
            alShootRatio = 0.03;
            bulletSpeed = 1;
            break;
        }
        case "normal": {
            lvFrame = 50;
            alShootRatio = 0.06;
            bulletSpeed = 1.5;
            break;
        }
        case "hard": {
            lvFrame = 40;
            alShootRatio = 0.10;
            bulletSpeed = 2.0;
            break;
        }
        case "hardest": {
            lvFrame = 30;
            alShootRatio = 0.15;
            bulletSpeed = 2.5;
            break;
        }
        default: {
            lvFrame = 60;
            alShootRatio = 0.03;
            bulletSpeed = 1;
            break;
        }
    }
};