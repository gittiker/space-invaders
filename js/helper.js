// Helper Functions
function AABBIntersect(ax, ay, aw, ah, bx, by, bw, bh) {
    return ax < bx+bw && by < ax+aw && ay < by+bh && by < ay+ah;
};

// Bullet
function Bullet(x, y, vely, w, h, color) {
    this.x = x;
    this.y = y;
    this.vely = vely;
    this.width = w;
    this.height = h;
    this.color = color;
}
// Updates bullet velocity
Bullet.prototype.update = function() {
    this.y += this.vely;
}

// Screen
function Display(width, height) {
    // create canvas and grab 2d context
    this.canvas = document.createElement("canvas");
    this.canvas.width = this.width = width;
    this.canvas.height = this.height = height;
    this.ctx = this.canvas.getContext("2d");  

    // append canvas to body of document
    document.body.appendChild(this.canvas);
};

Display.prototype.drawSprite = function(sp, x, y) {
    // draw part of spritesheet to canvas
    this.ctx.drawImage(sp.img, sp.x, sp.y, sp.w, sp.h, x, y, sp.w, sp.h);
};

Display.prototype.drawBullet = function(bullet) {
    this.ctx.fillStyle = bullet.color;
    this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
}

Display.prototype.clear = function() {
    this.ctx.clearRect(0, 0, this.width, this.height);
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

    // capture key presses
    var _this = this;
    document.addEventListener("keydown", function(evt) {
        _this.down[evt.keyCode] = true;
    });
    document.addEventListener("keyup", function(evt) {
        delete _this.down[evt.keyCode];
        delete _this.pressed[evt.keyCode];
    });
};

InputHandler.prototype.isDown = function(code) {
    return this.down[code];
};

InputHandler.prototype.isPressed = function(code) {
    // if key is registred as pressed return false else if
	// key down for first time return true else return false
    if (this.pressed[code]) {
        return false;
    } else if (this.down[code]) {
        return this.pressed[code] = true;
    }
    return false;
};