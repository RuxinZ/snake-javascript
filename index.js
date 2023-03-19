const board_border = 'black';
const board_background = "white";
const snake_col = 'lightblue';
const snake_border = 'darkblue';

let snake = [  
  {x: 200, y: 200},  
  {x: 190, y: 200},  
  {x: 180, y: 200},  
  {x: 170, y: 200},  
  {x: 160, y: 200},
];

let score = 0;
let changing_direction = false;
let dx = 10;
let dy = 0;

let food_x;
let food_y;

const snakeboard = document.getElementById("snakeboard")
const snakeboard_ctx = snakeboard.getContext("2d"); // Return a two dimensional drawing context (ctx)
// start game
main();

gen_food();

document.addEventListener("keydown", change_direction)

// main function called repeatedly to keep the game running
function main() {

  if (has_game_ended()) return;
  changing_direction = false;

  setTimeout(function onTick() {
    clearCanvas();
    drawFood();
    move_snake();
    drawSnake();
    // Call itself again
    main();
  }, 100)
}


function clearCanvas() {
  //  Select the colour to fill the drawing
  snakeboard_ctx.fillStyle = board_background;
  //  Select the colour for the border of the canvas
  snakeboard_ctx.strokestyle = board_border;
  // Draw a "filled" rectangle to cover the entire canvas
  snakeboard_ctx.fillRect(0, 0, snakeboard.width, snakeboard.height);
  // Draw a "border" around the entire canvas
  snakeboard_ctx.strokeRect(0, 0, snakeboard.width, snakeboard.height);
}


function drawFood(){
  snakeboard_ctx.fillStyle = 'lightgreen';
  snakeboard_ctx.strokestyle = 'darkgreen';
  snakeboard_ctx.fillRect(food_x, food_y, 10, 10);
  snakeboard_ctx.strokeRect(food_x, food_y, 10, 10);
}

/* Draw the snake*/
function drawSnake() 
{  
  snake.forEach(drawSnakePart);
}

function drawSnakePart(snakePart) {
  snakeboard_ctx.fillStyle = 'lightblue';  
  snakeboard_ctx.strokestyle = 'darkblue';
  snakeboard_ctx.fillRect(snakePart.x, snakePart.y, 10, 10);  
  snakeboard_ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
}



function has_game_ended() {
  // case 1: The head of the snake collides with its body.
  for (let i = 4; i < snake.length; i++) { // Dont need to check the first 3
    const has_collided = (snake[i].x === snake[0].x && 
      snake[i].y === snake[0].y)
    if (has_collided) return true
   }

   // case 2: The head of the snake collides with the canvas boundary.
  const hitLeftWall = snake[0].x < 0;  
  const hitRightWall = snake[0].x > snakeboard.width - 10;
  const hitToptWall = snake[0].y < 0;
  const hitBottomWall = snake[0].y > snakeboard.height - 10;

  return hitLeftWall ||  hitRightWall || hitToptWall || hitBottomWall
}

function random_food(min, max) {
  return Math.round((Math.random() * (max - min ) + min) / 10) * 10;
}

function gen_food() {
  food_x = random_food(0, snakeboard.width - 10);
  food_y = random_food(0, snakeboard.width - 10);
  // console.log("food x, y: " ,food_x,food_y)
  snake.forEach(function has_snake_eaten_food(part) {
    const has_eaten = part.x == food_x && part.y == food_y;
    if (has_eaten) gen_food();
  });

}



function change_direction(event) {
  const LEFT_KEY = 37;
  const RIGHT_KEY = 39;
  const UP_KEY = 38;
  const DOWN_KEY = 40;

  if (changing_direction) return;
  changing_direction = true;
  // get current direction
  const keyPressed = event.keyCode;
  const goingUp = dy === -10;
  const goingDown = dy === 10;
  const goingRight = dx === 10;
  const goingLeft = dx === -10;

  if (keyPressed === LEFT_KEY && !goingRight) {
    dx = -10;
    dy = 0;
  }
  if (keyPressed === RIGHT_KEY && !goingLeft) {
    dx = 10;
    dy = 0;
  }
  if (keyPressed === UP_KEY && !goingDown) {
    dx = 0;
    dy = -10;
  }
  if (keyPressed === DOWN_KEY && !goingUp) {
    dx = 0;
    dy = 10;
  }
}

function move_snake() {
  const newHead = { x: snake[0].x + dx, y: snake[0].y + dy};
  snake.unshift(newHead);
  const has_eaten_food = snake[0].x === food_x && snake[0].y === food_y;
  if (has_eaten_food) {
    gen_food();
    score += 10
    document.getElementById('score').innerHTML = score;
  } else {
    snake.pop();
  }
}


