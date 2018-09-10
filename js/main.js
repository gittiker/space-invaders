var display, input, frames, spFrame, lvFrame;
var alSprite, taSprite, ciSprite, exSprite;
var aliens, dir, tank, bullets, cities, lifeTank_1, lifeTank_2, lifeTank_3;
var isRunning = false;
var pointCounter, lifeCounter;

// main function
function main() {
    // create game canvas and inputhandler
    display = new Display(502, 600);
    input = new InputHandler();

    var img = new Image();
    var imgExplosion = new Image();
    img.addEventListener("load", function() {
        alSprite = [
            [new Sprite(this, 0, 0, 22, 16), new Sprite(this, 0, 16, 22, 16)], // blue alien
            [new Sprite(this, 22, 0, 16, 16), new Sprite(this, 22, 16, 16, 16)], // pink alien
            [new Sprite(this, 38, 0, 24, 16), new Sprite(this, 38, 16, 24, 16)] // green alien
        ];
        taSprite = new Sprite(this, 62, 0, 22, 16);
        ciSprite = new Sprite(this, 84, 8, 36, 24);
        // explosion png
        imgExplosion.addEventListener("load", function() {
            exSprite = new Sprite (imgExplosion, 0, 0, 100, 100)
        });
        init();
        run();
    });
    img.src = "res/invaders.png";
    imgExplosion.src = "res/explode-1.png";
};
// initializing values and playground
function init() {
    frames = 0;
    spFrame = 0; 
    // lvl difficultly insertable
    lvFrame = 60;
    dir = 1;
    pointCounter = 0;
    UpdatePoints(pointCounter);
    lifeCounter = 3;
    UpdateLifes(lifeCounter);

    // Create tank object
    tank = {
        sprite: taSprite,
        x: (display.width - taSprite.w) / 2,
        y: display.height - (30 + taSprite.h),
        w: taSprite.w,
        h: taSprite.h
    };

    bullets = [];
    cities = {
        canvas: null,
        ctx: null,
        y: tank.y - (30 + ciSprite.h),
        h: ciSprite.h,

        //init 
        init: function() {
            this.canvas = document.createElement("canvas");
            this.canvas.width = display.width;
            this.canvas.height = this.h;
            this.ctx = this.canvas.getContext("2d");

            for (var i = 0; i<4;i++) {
                this.ctx.drawImage(ciSprite.img, ciSprite.x,
                ciSprite.y, ciSprite.w, ciSprite.h,
                68 + 111*i, 0, ciSprite.w, ciSprite.h);
            }
        },
        // Mannipulate the ctites hitbox 
        generateDamage: function(x, y) {
            // round x, y position
            x = Math.floor(x/2) * 2;
            y = Math.floor(y/2) * 2;
            // draw dagame effect to canvas
            this.ctx.clearRect(x-2, y-2, 4, 4);
            this.ctx.clearRect(x+2, y-4, 2, 4);
            this.ctx.clearRect(x+4, y, 2, 2);
            this.ctx.clearRect(x+2, y+2, 2, 2);
            this.ctx.clearRect(x-4, y+2, 2, 2);
            this.ctx.clearRect(x-6, y, 2, 2);
            this.ctx.clearRect(x-4, y-4, 2, 2);
            this.ctx.clearRect(x-2, y-6, 2, 2);
        },
        hits: function(x,y) {
            y -= this.y;
            var data = this.ctx.getImageData(x, y, 1, 1);
            if (data.data[3] !== 0) {
                this.generateDamage(x, y);
                return true;
            }
            return false;
        }
    };
    cities.init();

    // create and populate alien array
    aliens = [];
    // rows = order of aliens in game
    var rows = [1, 0, 0, 2, 2];
    for (var i = 0, len = rows.length; i < len; i++) {
        for (var j = 0; j < 10; j++) {
            var a = rows[i];
            // create right offsetted alien and push alien to array
            aliens.push({
                sprite: alSprite[a],
                // [0, 4, 0] distance to next alien for the pink aliens
                // the pink aliens are smaller then the other aliens
                x: 30 + j*30 + [0, 4, 0][a],
                y: 30 + i*30,
                w: alSprite[a][0].w,
                h: alSprite[a][0].h
            });
        }
    }
};
// run the game
function run() {
    var loop = function() {
        if (!isRunning) {
            return;
        }
        update();
        render();
        //loop is the function-object that need to be runned before rendering
        window.requestAnimationFrame(loop, display.canvas);
    };
    window.requestAnimationFrame(loop, display.canvas);
};
// update game logic
function update() {
    frames++;
    // Update tank postiton by input
    if (input.isDown(37)) { //Left
        tank.x -= 4;
    }
    if (input.isDown(39)) { //Right
        tank.x += 4;
    }
    // Kepp tank in canvas with 30 px distance to borders
    tank.x = Math.max(Math.min(tank.x, display.width - (30 + taSprite.w)), 30);
    
    // Shoot when is down
    if (input.isPressed(83)) {
        bullets.push(new Bullet(tank.x + 10, tank.y, -8, 2, 6, "#fff"));
    }
    // Easter Egg minigun --> add music
    if (input.isDown(192)) {
        bullets.push(new Bullet(tank.x + 10, tank.y, -8, 2, 6, "#fff"));
    }
    
    // let the bullets move
    for (var i = 0, len = bullets.length; i < len; i++) {
        var b = bullets[i];

        b.update();
        
        // remove bullet if its leave the canvas
        if (b.y + b.height < 0 || b.y > screen.height) {
            bullets.splice(i,1);
            i--;
            len--;
            continue;
        }
        
        // remove bullet if its hits a city
        // deals dmg to cities
        var h2 = b.height * 0.5;
        if (cities.y < b.y+h2 && b.y+h2 < cities.y + cities.h) {
            if (cities.hits(b.x, b.y+h2)) {
                bullets.splice(i, 1);
                i--;
                len--;
                continue;
            }
        }

        // loop to check bullethits on aliens
        for (var j = 0, len2 = aliens.length; j < len2; j++) {
            var a = aliens[j];
            if (AABBIntersect(b.x, b.y, b.width, b.height, a.x, a.y, a.w, a.h)) {
                aliens.splice(j, 1);
                j--;
                len2--;
                bullets.splice(i, 1);
                i--;
                len--;
                
                // generate points when aliens got hitted
                if (a.sprite == alSprite[0]) { // blue alien
                    pointCounter += 20;
                } else if (a.sprite == alSprite[1]) { // pink alien
                    pointCounter += 30; 
                } else if (a.sprite == alSprite[2]) { // green alien
                    pointCounter += 10;
                }
                UpdatePoints(pointCounter);

                // when aliens disapear the others get faster
                switch (len2) {
                    case 30: {
                        this.lvFrame = 40;
                        break;
                    }
                    case 10: {
                        this.lvFrame = 20;
                        break;
                    }
                    case 5: {
                        this.lvFrame = 15;
                        break;
                    }
                    case 1: {
                        this.lvFrame = 6;
                        break;
                    }
                }
            }
            
            // when aliens reachs cities game over
            if (a.y >= tank.y + ciSprite.h + 30) {
                GameOver();
            }
        }
        // loop to check hits on tank
        // b == bullets
        // t = tank
        if (AABBIntersect(b.x, b.y, b.width, b.height, tank.x, tank.y, tank.w, tank.h)) {
            lifeCounter--;
            UpdateLifes(lifeCounter);
            bullets.splice(i, 1);
            i--;
            len--;
        }
    }

    // random returns number between 0 and 1
    // difficultly
    // aliens shoot logic
    if (Math.random() < 0.03 && aliens.length > 0) {
        var a = aliens[Math.round(Math.random() * (aliens.length - 1))];
        for (var i = 0, len = aliens.length; i < len; i++) {
            var b = aliens[i];
            //select lower position alien to shoot, no friendly fire
            if (AABBIntersect(a.x, a.y, a.w, 100, b.x, b.y, b.w, b.h)) {
                a = b;
            }
        }
        bullets.push(new Bullet(a.x + a.w*0.5, a.y + a.h, 4, 2, 4, "#fff"));
    }

    // Update at the current movement currency
    if (frames % lvFrame ===0) {
        spFrame = (spFrame + 1) % 2;
        
        var _max = 0, _min = display.width;
        //iterate trough aliens and update positions
        for (var i = 0, len = aliens.length; i < len; i++) {
            var a = aliens[i];
            a.x += 30 * dir;
            
            _max = Math.max(_max, a.x + a.w);
            _min = Math.min(_min, a.x);
        }
        //change move direction of aliens
        if (_max > display.width || _min < 30) {
            dir *= -1;
            for (var i = 0, len = aliens.length; i < len; i++) {
                aliens[i].x += 30 * dir;
                aliens[i].y += 30;
            }
        } 
    }
};
// build screen
function render() {
    display.clear();
    // select the enemy figure
    // display.drawSprite(alSprite[0][0], 10, 10);
    // display.drawSprite(taSprite, 10, 10);
    // display.drawSprite(ciSprite, 10, 10);
    
    // draw all aliens
    for (var i = 0, len = aliens.length; i < len; i++) {
        var a = aliens[i];
        display.drawSprite(a.sprite[spFrame], a.x, a.y);
    }
    
    // draw bullets
    display.ctx.save();
    for (var i = 0, len = bullets.length; i < len; i++) {
        display.drawBullet(bullets[i]);
    }
    display.ctx.restore();
    // draw cities
    display.ctx.drawImage(cities.canvas, 0, cities.y);
    // draw tank sprite
    display.drawSprite(tank.sprite, tank.x, tank.y);
};
//window.location.href='mainMenu.html'

