// TODO: EDGE CASES MAX ROWS

const width = 800;
const lightGray = 'rgb(200, 200, 200)';
const rows = 40;
const rowWidth = width / rows;

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
canvas.width = width;
canvas.height = width;
const context = canvas.getContext('2d') as CanvasRenderingContext2D;

const head = [40, 40];
let food = [20, 20];
let direction = [0, 0];
let previousMoveTime = 0;
const moveTime = 100;
let previousTime = 0;

const handleKey = (e: KeyboardEvent) => {
    switch(e.code) {
        case "ArrowUp":
        case "KeyW":
            direction = [0, -1];
            break;
        case "ArrowLeft":
        case "KeyA":
            direction = [-1, 0];
            break;
        case "ArrowDown":
        case "KeyS":
            direction = [0, 1];
            break;
        case "ArrowRight":
        case "KeyD":
            direction = [1, 0];
            break;
    }
}

document.addEventListener("keydown", handleKey);

const drawGrid = () => {
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
}

const updateHead = (time: number) => {
    if (time - previousMoveTime <= moveTime) {
        return;
    }
    head[0] += direction[0];
    head[1] += direction[1];

    if (head[0] >= rows) {
        head[0] = 0;
    } else if (head[0] < 0) {
        head[0] = rows - 1;
    }

    if (head[1] >= rows) {
        head[1] = 0;
    } else if (head[1] < 0) {
        head[1] = rows - 1;
    }
    previousMoveTime = time;
}

const drawHead = () => {
    context.fillRect(head[0] * rowWidth, head[1] * rowWidth, rowWidth, rowWidth);
}

const drawFood = () => {
    context.fillRect(
        food[0] * rowWidth + rowWidth * 0.25,
        food[1] * rowWidth + rowWidth * 0.25,
        rowWidth * 0.5,
        rowWidth * 0.5
    );
}

const gameLoop = (time: DOMHighResTimeStamp) => {
    context.clearRect(0, 0, width, width);
    updateHead(time);
    drawGrid();
    drawHead();
    drawFood();
    previousTime = time;
    window.requestAnimationFrame(gameLoop);
}

window.requestAnimationFrame(gameLoop);