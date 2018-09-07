// Test Start Screen
function buildStartScreen() {
    display = new Display(502, 600);
    input = new InputHandler();
    if (input.isPressed(78)) { //Key n for new game
        main();
    }
};
buildStartScreen();