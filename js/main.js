// Helper Functions

// Screen
function Display(width, height) {
    // create canvas and grab 2d context
    this.canvas = document.createElement("canvas");
    this.canvas.width = this.width = width;
    this.canvas.height = this.height = height;
    this.ctx = this.canvas.getContext("2d")     

    // append canvas to body of document
    document.body.appendChild(this.canvas);
};

Display.prototype.drawSprite = function(sp, x, y) {
    // draw part of spritesheet to canvas
    this.ctx.drawImage(sp.img, sp.x, sp.y, sp.w, sp.h, x, y, sp.w, sp.h);
};


// Sprite
function Sprite(img, x, y, w, h) {

};

// InputHandeler
function InputHandeler() {};

InputHandeler.prototype.isDown = function(code) {

};

InputHandeler.prototype.isPressed = function(code) {
    
};