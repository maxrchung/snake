const width = 800;
const lightGray = 'rgb(200, 200, 200)';
const rows = 40;
const rowWidth = width / rows;

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
canvas.width = width;
canvas.height = width;

const context = canvas.getContext('2d') as CanvasRenderingContext2D;

context.beginPath();
for (let i = 0; i <= width; i += rowWidth) {
    context.moveTo(i, 0);
    context.lineTo(i, width);
    context.moveTo(0, i);
    context.lineTo(width, i);
}
context.closePath();
context.strokeStyle = lightGray;
context.stroke();