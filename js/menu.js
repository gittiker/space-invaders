function startscreen() {
    console.log("start");
    startGame();
}

function hideMenuControl() {
    document.getElementById("statusBar").className = "";
    document.getElementById("buttonStart").className= "hidden";
    document.getElementById("buttonEnd").className= "button";
    document.getElementById("endScreen").className= "hidden";
}

function hideGameControl() {
    document.getElementById("buttonEnd").className= "hidden";
    document.getElementById("buttonStart").className= "button";
    document.getElementById("endScreen").className= "";
}

function muteAudio() {
    switch (document.getElementById("muteAudio").className) {
        case ("muteButton mute"): 
            document.getElementById("muteAudio").className = "muteButton sound";
            break;

        case ("muteButton sound"): 
            document.getElementById("muteAudio").className = "muteButton mute";
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