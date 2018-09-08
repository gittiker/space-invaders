function startscreen() {
    console.log("start");
    startGame();
}

function hideMenuControl() {
    document.getElementById("buttonStart").className= "hidden";
    document.getElementById("buttonEnd").className= "button";
}

function hideGameControl() {
    document.getElementById("buttonEnd").className= "hidden";
    document.getElementById("buttonStart").className= "button";
}

function disableSpacebar() {
    window.addEventListener('keydown', function(event) {  
        if (event.which === 32) {
            event.preventDefault();
        }})
}

disableSpacebar();