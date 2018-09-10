var alienKill = new Audio("./sounds/invaderkilled.wav");
var startSound = new Audio("./sounds/mysteryentered.wav");
var tankHit = new Audio("./sounds/shipexplosion.wav");
var alienShoot = new Audio("./sounds/shoot.wav");
var tankShoot = new Audio("./sounds/shoot2.wav");
var gameOver = new Audio("./sounds/gameOver.wav");
var soundsVolume = 0.7;

function PlaySound(source) {
    switch (source) {
        case "alienKill": {
            alienKill.volume = soundsVolume;
            alienKill.play();
            break;
        }
        case "startSound": {
            startSound.volume = soundsVolume;
            startSound.play();
            break;
        }
        case "tankHit": {
            tankHit.volume = soundsVolume;
            tankHit.play();
            break;
        }
        case "alienShoot": {
            alienShoot.volume = soundsVolume;
            alienShoot.play();
            break;
        }
        case "tankShoot": {
            tankShoot.volume = soundsVolume;
            tankShoot.play();
            break;
        }
        case "gameOver": {
            if (soundsVolume > 0) {
                gameOver.volume = 1;
            }
            else 
            {
                gameOver.volume = 0;
            }
            
            gameOver.play();
            break;
        }
    }
};

function SetSoundsVolume(value) {
    soundsVolume = value;
};