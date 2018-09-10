var alienKill = new Audio("./sounds/invaderkilled.wav");
var startSound = new Audio("./sounds/mysteryentered.wav");
var tankHit = new Audio("./sounds/shipexplosion.wav");
var alienShoot = new Audio("./sounds/shoot.wav");
var tankShoot = new Audio("./sounds/shoot2.wav");
var soundsVolume = 0.7;

function PlaySound(source) {
    switch (source) {
        case "alienKill": {
            alienKill.play();
            alienKill.volume = soundsVolume;
            break;
        }
        case "startSound": {
            startSound.play();
            startSound.volume = soundsVolume;
            break;
        }
        case "tankHit": {
            tankHit.play();
            tankHit.volume = soundsVolume;
            break;
        }
        case "alienShoot": {
            alienShoot.play();
            alienShoot.volume = soundsVolume;
            break;
        }
        case "tankShoot": {
            tankShoot.play();
            tankShoot.volume = soundsVolume;
            break;
        }
    }
};

function SetSoundsVolume(value) {
    soundsVolume = value;
};