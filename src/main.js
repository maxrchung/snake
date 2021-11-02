"use strict";
var width = 800;
var lightGray = 'rgb(200, 200, 200)';
var rows = 40;
var rowWidth = width / rows;
var canvas = document.getElementById('canvas');
canvas.width = width;
canvas.height = width;
var context = canvas.getContext('2d');
var update = function (timeDelta) {
};
var drawGrid = function () {
    context.beginPath();
    for (var i = 0; i <= width; i += rowWidth) {
        context.moveTo(i, 0);
        context.lineTo(i, width);
        context.moveTo(0, i);
        context.lineTo(width, i);
    }
    context.closePath();
    context.strokeStyle = lightGray;
    context.stroke();
};
var previousTime = 0;
var gameLoop = function (time) {
    var timeDelta = time - previousTime;
    update(timeDelta);
    drawGrid();
    previousTime = time;
    window.requestAnimationFrame(gameLoop);
};
window.requestAnimationFrame(gameLoop);
//# sourceMappingURL=main.js.map