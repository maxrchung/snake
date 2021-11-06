// TODO: EDGE CASES MAX ROWS

const width = 800;
const lightGray = "rgb(200, 200, 200)";
const rows = 40;
const rowWidth = width / rows;

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
canvas.width = width;
canvas.height = width;
const context = canvas.getContext("2d") as CanvasRenderingContext2D;

const head = [39, 39];
const body: number[][] = [];
let food = [20, 20];
let direction = [0, 0];
let previousMoveTime = 0;
const moveTime = 100;
let previousTime = 0;

document.addEventListener("keydown", (e: KeyboardEvent) => {
  switch (e.code) {
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
});

const updateSnake = (time: number) => {
  if (time - previousMoveTime <= moveTime) {
    return;
  }

  updateBody();
  updateHead();
  previousMoveTime = time;
};

const updateBody = () => {
  for (let i = body.length - 1; i >= 0; --i) {
    if (i === 0) {
      body[0][0] = head[0];
      body[0][1] = head[1];
      break;
    }

    body[i][0] = body[i - 1][0];
    body[i][1] = body[i - 1][1];
  }
};

const updateHead = () => {
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
};

const updateFood = () => {
  if (head[0] !== food[0] || head[1] !== food[1]) {
    return;
  }
  body.push([food[0], food[1]]);
  let newFood = getRandomCoordinate();
  while (newFood[0] === food[0] && newFood[1] === food[1]) {
    newFood = getRandomCoordinate();
  }
  food = newFood;
};

const getRandomCoordinate = () => [
  Math.floor(Math.random() * rows),
  Math.floor(Math.random() * rows),
];

const drawGrid = () => {
  context.beginPath();
  for (let i = 0; i <= width; i += rowWidth) {
    context.moveTo(i, 0);
    context.lineTo(i, width);
    context.moveTo(0, i);
    context.lineTo(width, i);
  }
  context.closePath();
  context.save();
  context.strokeStyle = lightGray;
  context.stroke();
  context.restore();
};

const drawHead = () =>
  context.fillRect(head[0] * rowWidth, head[1] * rowWidth, rowWidth, rowWidth);

const drawFood = () =>
  context.fillRect(
    food[0] * rowWidth + rowWidth * 0.25,
    food[1] * rowWidth + rowWidth * 0.25,
    rowWidth * 0.5,
    rowWidth * 0.5
  );

const drawBody = () =>
  body.map((food) =>
    context.strokeRect(
      food[0] * rowWidth,
      food[1] * rowWidth,
      rowWidth,
      rowWidth
    )
  );

const gameLoop = (time: DOMHighResTimeStamp) => {
  context.clearRect(0, 0, width, width);
  updateSnake(time);
  updateFood();
  drawGrid();
  drawHead();
  drawBody();
  drawFood();
  previousTime = time;
  window.requestAnimationFrame(gameLoop);
};

window.requestAnimationFrame(gameLoop);
