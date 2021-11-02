"use strict";
var width = 800;
var lightGray = 'rgb(200, 200, 200)';
var rows = 40;
var rowWidth = width / rows;
var canvas = document.getElementById('canvas');
canvas.width = width;
canvas.height = width;
var context = canvas.getContext('2d');
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
//# sourceMappingURL=main.js.map