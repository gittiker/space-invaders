function startscreen() {
    console.log("start");
}

function hideMenuControl() {
    document.getElementById("menuItem").className= "hidden";
    document.getElementById("gameItem").className= "";
}

function hideGameControl() {
    document.getElementById("gameItem").className= "hidden";
    document.getElementById("menuItem").className= "";
}