var display, input, frames, spFrame, lvFrame;
var alSprite, taSprite, ciSprite;
var aliens, dir, tank, bullets, cities;
var running = false;


/* Main functions */
function main() {
    // create game canvas and inputhandler
    if (!display) display = new Display(502, 600); // value:30
    input = new InputHandler();

    // create all sprites from asset image
    var img = new Image();
    img.addEventListener("load", function() {

        alSprite = [
            [new Sprite(this,  0, 0, 22, 16), new Sprite(this,  0, 16, 22, 16)], // this == img
            [new Sprite(this, 22, 0, 16, 16), new Sprite(this, 22, 16, 16, 16)],
            [new Sprite(this, 38, 0, 24, 16), new Sprite(this, 38, 16, 24, 16)]
        ];
        taSprite = new Sprite(this, 62, 0, 22, 16);
        ciSprite = new Sprite(this, 84, 8, 36, 24);

        // init and run the game
        init();
        run();

    });
    img.src = "res/invaders.png";
};

/* Initializing values and playground */
function init() {
    // set start settings
    frames = 0;
    spFrame = 0;
    lvFrame = 60; // level difficulty
    dir = 1;

    bullets = [];

    // create tank object
    tank = {
        sprite: taSprite,
        x: (display.width - taSprite.w) / 2,
        y: (display.height - (30 + taSprite.h))
    };

    // create the cities object (and canvas)
    cities = {
        canvas: null,
        ctx: null,
        y: tank.y - (30 + ciSprite.h),
        h: ciSprite.h,

        // Create canvas and game graphic context
        init: function() {
            this.canvas = document.createElement("canvas");
            this.canvas.width = display.width;
            this.canvas.height = this.h;
            this.ctx = this.canvas.getContext("2d");

            for (var i = 0; i < 4; i++) {
                this.ctx.drawImage(ciSprite.img, ciSprite.x, ciSprite.y, ciSprite.w, ciSprite.h, 68 + 111*i, 0, ciSprite.w, ciSprite.h);
            }
        },

        // create damage effect on city-canvas (x: x-Coord, y: y-Coord)
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

        // Check if pixel at (x, y) is tansparent
        hits: function(x, y) {
            // transform y value to local coordinate system
            y -= this.y;
            // get imagedata and check if transparent
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
    var rows = [1, 0, 0, 2, 2]; // sprite distance control: sprite 1 is 4px smaller

    for (var i = 0, len = rows.length; i < len; i++) {
        for (var j = 0; j < 10; j++) {
            var a = rows[i];
            // create right offseted alien and push to alien array
            aliens.push({
                sprite: alSprite[a],
                x: 30 + j*30 + [0, 4, 0][a], // 4px distance to next alien
                y: 30 + i*30,
                w: alSprite[a][0].w,
                h: alSprite[a][0].h
            });
        }
    }
};

/* Wrapper around the game loop function, updates and renders the game */
function run() {

    var loop = function(){

        if (!running) {
            return;
        }

        update();
        render();

        window.requestAnimationFrame(loop, display.canvas);
    };
    window.requestAnimationFrame(loop, display.canvas);
};

/* Update game logic */
function update() {
    // update frame count
    frames++;

    // update tank postition based on pressed key
    if (input.isDown(37)) { //left
        tank.x -= 4;
    }
    if (input.isDown(39)) { //right
        tank.x += 4;   
    }
    // keep tank sprite inside of canvas
    tank.x = Math.max(Math.min(tank.x, display.width - (30 + taSprite.w)), 30);

    // create new bullet when 's' is pressed
    if (input.isPressed(83)) { // 's' 83 // spacebar 32
        bullets.push(new Bullet(tank.x + 10 , tank.y, -8, 2, 6, "#fff"));
    }

    // if (input.isPressed(78)) { //Key n for new game
    //     endGame();
    //     frames = 0;
    //     startGame();
    // }

    // godmode
    // if (input.isDown(192) || input.isDown(221)) { //find out yourself b*tch
    //     bullets.push(new Bullet(tank.x + 10 , tank.y, -8, 2, 6, "#fff"));
    // }

    // bullet logic
    // update all bullets position and checks
    for (var i=0, len = bullets.length; i < len; i++) {
        var b = bullets[i];

        b.update();
        
        // remove bullet if it goes outside of canvas
        if (b.y + b.height < 0 || b.y > display.height) {
            bullets.splice(i, 1);
            i--;
            len--;
            continue;
        }
        // check if bullet hits any city
        var h2 = b.height*0.5; // half hight used for simplicity
        if (cities.y < b.y + h2 && b.y + h2 < cities.y + cities.h) {
            if (cities.hits(b.x, b.y + h2)) {
                bullets.splice(i, 1);
                i--;
                len--;
                continue;
            }
        }
        // check if bullet hit any alien
        for (var j = 0, len2 = aliens.length; j < len2; j++) {
            var a = aliens[j];

            if (AABBIntersect(b.x, b.y, b.width, b.height, a.x, a.y, a.w, a.h)) {
                aliens.splice(j, 1);
                j--;
                len2--;
                bullets.splice(i, 1);
                i--;
                len--;

                // increases movement frequence of aliens when there are less of them
                switch (len2) {
                    case 30: {
                        this.lvFrame = 40;
                        break;
                    }
                    case 10: {
                        this.lvFrame = 30;
                        break;
                    }
                    case 5: {
                        this.lvFrame = 20;
                        break;
                    }
                    case 1: {
                        this.lvFrame = 10;
                        break;
                    }
                }
            }
        }

    }

    // makes the alien shoot in an random fashion 
    if (Math.random() < 0.03 && aliens.length > 0) {
        var a = aliens[Math.round(Math.random() * (aliens.length -1))];

        // iterate through aliens and check collision to make sure only shoot from front line
        for (var i = 0, len = aliens.length; i < len; i++) {
            var b = aliens[i];
            
            if (AABBIntersect(a.x, a.y, a.w, 100, b.x, b.y, b.w, b.h)) {
                a = b;
            }
        }
        bullets.push(new Bullet(a.x + a.w*0.5, a.y + a.h, 4, 2, 4, "#fff"));
    }

    // update aliens at current movement frequency
    if (frames % lvFrame === 0) {
        spFrame = (spFrame + 1) % 2;

        var _max = 0,_min = display.width;
        // iterate through aliens and update postition
        for (var i = 0, len = aliens.length; i < len; i++) {
            var a = aliens[i];
            a.x += 30 * dir;
            
            // find min/max values of all aliens for direction change
            _max = Math.max(_max, a.x + a.w);
            _min = Math.min(_min, a.x);
        }
        // mirror direction of alien movement
        if (_max > display.width || _min < 30) {
            dir *= -1;
            for (var i = 0, len = aliens.length; i < len; i++) {
                aliens[i].x += 30 * dir;
                aliens[i].y += 30;
            }
        }
    }
};

/* Draws sprites */
function render() {
    display.clear(); // clear the game canvas

    // draw all aliens
    for (var i=0, len = aliens.length; i < len; i++) {
        var a = aliens[i];
        display.drawSprite(a.sprite[spFrame], a.x, a.y);
    }

    // push new bullet
    display.ctx.save();
    for (var i=0, len = bullets.length; i < len; i++) {
        display.drawBullet(bullets[i]);
    }
    display.ctx.restore();

    // draw the city graphics to the canvas
    display.ctx.drawImage(cities.canvas, 0, cities.y)
    // draw the tank sprite
    display.drawSprite(tank.sprite, tank.x, tank.y);
};

function startGame() {
    hideMenuControl();
    running = true;
    main();
};

function endGame() {
    hideGameControl();
    running = false;
}