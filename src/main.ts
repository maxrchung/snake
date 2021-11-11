// TODO: Reverse snake
// TODO: States
// TODO: End game shake

const width = 800;
const lightGray = "rgb(200, 200, 200)";
const rows = 40;
const rowWidth = width / rows;
const moveTime = 100;
let previousMoveTime = 0;

const text = "qwhello there test 123";
const fontSize = 14;
const font = `${fontSize}px sans-serif`;

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
canvas.width = width;
canvas.height = width;
const context = canvas.getContext("2d") as CanvasRenderingContext2D;
context.font = font;

let direction: number[];
let head: number[];
let body: number[][];
let food: number[];
let shouldAddFood: boolean;

const reset = () => {
  direction = [0, 0];
  head = [1, 1];
  body = [];
  shouldAddFood = false;
  food = getFoodPosition();
};

const getFoodPosition = () => {
  let position = getRandomPosition();
  while (isExistingPosition(position)) {
    position = getRandomPosition();
  }
  return position;
};

const getRandomPosition = () => [
  Math.floor(Math.random() * (rows - 1)),
  Math.floor(Math.random() * (rows - 1)),
];

const isExistingPosition = (position: number[]) => {
  if (food && position[0] === food[0] && position[1] === food[1]) {
    return true;
  }

  if (position[0] === head[0] && position[1] === head[1]) {
    return true;
  }

  for (const bodyPart of body) {
    if (position[0] === bodyPart[0] && position[1] === bodyPart[1]) {
      return true;
    }
  }

  return false;
};

const gameLoop = (time: DOMHighResTimeStamp) => {
  context.clearRect(0, 0, width, width);
  updateSnake(time);
  updateFood();
  drawGrid();
  drawHead();
  drawBody();
  drawFood();
  window.requestAnimationFrame(gameLoop);
};

const updateSnake = (time: number) => {
  if (time - previousMoveTime <= moveTime) {
    return;
  }

  updateBody();
  updateHead();
  previousMoveTime = time;
};

const updateBody = () => {
  if (shouldAddFood) {
    body.push([-1, -1]);
    shouldAddFood = false;
  }

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

  if (head[0] >= rows || head[0] < 0 || head[1] >= rows || head[1] < 0) {
    reset();
    return;
  }

  for (const bodyPart of body) {
    if (head[0] === bodyPart[0] && head[1] === bodyPart[1]) {
      reset();
      return;
    }
  }
};

const updateFood = () => {
  if (head[0] !== food[0] || head[1] !== food[1]) {
    return;
  }
  shouldAddFood = true;
  const newFood = getFoodPosition();
  food = newFood;
};

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

const drawBody = () =>
  body.map((food, index) => {
    context.strokeRect(
      food[0] * rowWidth,
      food[1] * rowWidth,
      rowWidth,
      rowWidth
    );
    if (index < text.length) {
      const character = text[index];
      const measure = context.measureText(character);
      context.fillText(
        character,
        food[0] * rowWidth + rowWidth / 2 - measure.width / 2,
        food[1] * rowWidth + rowWidth / 2 + fontSize / 2
      );
    }
  });

const drawFood = () =>
  context.fillRect(
    food[0] * rowWidth + rowWidth * 0.25,
    food[1] * rowWidth + rowWidth * 0.25,
    rowWidth * 0.5,
    rowWidth * 0.5
  );

const setDirection = (x: number, y: number) => {
  if (body.length !== 0) {
    const nextPosition = [head[0] + x, head[1] + y];
    if (nextPosition[0] === body[0][0] && nextPosition[1] === body[0][1]) {
      return;
    }
  }

  direction = [x, y];
};

reset();

document.addEventListener("keydown", (e: KeyboardEvent) => {
  switch (e.code) {
    case "ArrowUp":
    case "KeyW":
      setDirection(0, -1);
      break;
    case "ArrowLeft":
    case "KeyA":
      setDirection(-1, 0);
      break;
    case "ArrowDown":
    case "KeyS":
      setDirection(0, 1);
      break;
    case "ArrowRight":
    case "KeyD":
      setDirection(1, 0);
      break;
  }
});

window.requestAnimationFrame(gameLoop);
