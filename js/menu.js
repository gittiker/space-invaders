var v_setDifficulty = 0;

function startscreen() {
    console.log("start");
    startGame();
}

function hideMenuControl() {
    document.getElementById("statusBar").className = "";
    document.getElementById("buttonStart").className= "hidden";
    document.getElementById("buttonEnd").className= "button";
    document.getElementById("endScreen").className= "hidden";
    
    document.getElementById("l1").className= "lives";
    document.getElementById("l2").className= "lives";
    document.getElementById("l3").className= "lives";
    
}

function hideGameControl() {
    document.getElementById("buttonEnd").className= "hidden";
    document.getElementById("buttonStart").className= "button";
    document.getElementById("endScreen").className= "";
}

function toggleDifficulty() {
    
    if (v_setDifficulty == 3) v_setDifficulty = -1;
    v_setDifficulty++;

    switch (v_setDifficulty) {
        case 0: {
            document.getElementById('difficulty').textContent = "easy";
            break;
        };
        case 1: {
            document.getElementById('difficulty').textContent = "normal";
            break;
        };
        case 2: {
            document.getElementById('difficulty').textContent = "hard";
            break;
        };
        case 3: {
            document.getElementById('difficulty').textContent = "hardest";
            break;
        };
    }
}

function muteAudio() {
    switch (document.getElementById("muteAudio").className) {
        case ("muteButton mute"): 
            SetSoundsVolume(0.7);
            document.getElementById("muteAudio").className = "muteButton sound";
            break;

        case ("muteButton sound"): 
            document.getElementById("muteAudio").className = "muteButton mute";
            SetSoundsVolume(0);
            break;
    } 
    
}

function disableSpacebar() {
    window.addEventListener('keydown', function(event) {  
        if (event.which === 32) {
            event.preventDefault();
        }})
}

disableSpacebar();