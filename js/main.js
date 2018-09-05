//Display
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

//Sprite
function Sprite(img, x, y, w, h) {
    this.img = img;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
};

//InputHandler
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