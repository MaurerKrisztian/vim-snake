const settings = {
    speed: 100,
    foodColor: "red",
    backgroundColor: "black",
    snakeColor: "green"
}
let canvas = document.getElementById('snake');
let context = canvas.getContext('2d');
let box = 32;
let snake = [];

snake[0] = {
    x: 8 * box,
    y: 8 * box
}

let direction = "right";

let food = {
    x: Math.floor(Math.random() * 15 + 1) * box,
    y: Math.floor(Math.random() * 15 + 1) * box
}

function updateScore(newScore) {
    const scoreElemet = document.getElementById("score");
    scoreElemet.innerText = newScore;
}

function criarBG(){
    // Definindo a cor. | fillstyle trabalha com o estilo do canvas.
    context.fillStyle = settings.backgroundColor;
    // Desenha onde vai acontecer o jogo e trabalha com 4 parâmetros.
    context.fillRect(0, 0, 16 * box, 16 * box);
}

function criarCobrinha(){
    for(i=0; i < snake.length; i++){
        context.fillStyle = settings.snakeColor;
        context.fillRect(snake[i].x, snake[i].y, box-2, box-2);
    }
    updateScore(snake.length)
}

function drawFood(){
    context.fillStyle = settings.foodColor;
    context.fillRect(food.x, food.y, box, box)
}

document.addEventListener('keydown', update);
document.addEventListener("touchstart", startTouch, false);
document.addEventListener("touchmove", moveTouch, false);

var swipeInitialX = null;
var swipeInitialY = null;

function startTouch(e) {
    swipeInitialX = e.touches[0].clientX;
    swipeInitialY = e.touches[0].clientY;
};

function moveTouch(e) {

  if(isSnakeOffScreen()) return;

  if (swipeInitialX === null) {
    return;
  }
  
  if (swipeInitialY === null) {
    return;
  }
  
  var currentX = e.touches[0].clientX;
  var currentY = e.touches[0].clientY;
  
  var diffX = swipeInitialX - currentX;
  var diffY = swipeInitialY - currentY;
  
  if (Math.abs(diffX) > Math.abs(diffY)) {
    if (diffX > 0) {
      console.log("swiped left");
      direction = "left";
    } else {
      console.log("swiped right");
      direction = "right";
    }  
  } else {
    if (diffY > 0) {
      console.log("swiped up");
      direction = "up";
    } else {
      console.log("swiped down");
      direction = "down";
    }  
  }
  
  swipeInitialX = null;
  swipeInitialY = null;

  e.preventDefault();
};


function update (event){
    updateKeyDisplay(event.key)
    if(isSnakeOffScreen()) return;
    if(event.key === "h" && direction !== "right") direction = "left";
    if(event.key === "k" && direction !== "down") direction = "up";
    if(event.key === "l" && direction !== "left") direction = "right";
    if(event.key === "j" && direction !== "up") direction = "down";
}

function updateKeyDisplay(key){
    const displayElement= document.getElementById("key-press-display-box")
    if (!['h','j','k','l'].includes(key)){
        displayElement.innerHTML = '<span style="color:red;" >'+key+'</span>'
        return
    }
    displayElement.innerText = key
}

function isSnakeOffScreen() {
    return (snake[0].x > 15 * box 
        || snake[0].x < 0 
        || snake[0].y > 15 * box 
        || snake[0].y < 0)
}

function iniciarJogo(){
    for(i = 1; i < snake.length; i++){
        if(snake[0].x == snake[i].x && snake[0].y == snake[i].y){
            clearInterval(jogo);
            alert(`GAME OVER! Score: ${snake.length}`);
        }
    }

    if (isSnakeOffScreen()) {
        if(direction == "right") snake[0].x = 0;
        if(direction == "left") snake[0].x = 16 * box;
        if(direction == "down") snake[0].y = 0;
        if(direction == "up") snake[0].y = 16 * box;
    }

    criarBG();
    criarCobrinha();
    drawFood();

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if(direction == "right") snakeX += box;
    if(direction == "left") snakeX -= box;
    if(direction == "up") snakeY -= box;
    if(direction == "down") snakeY += box;

    if(snakeX != food.x || snakeY != food.y){
        // Retirando o último elemento do array.
        snake.pop();
    }else{food.x = Math.floor(Math.random() * 15 + 1) * box;
        food.y = Math.floor(Math.random() * 15 + 1) * box;
    }

    let newHead = {
        x: snakeX,
        y: snakeY
    }

    snake.unshift(newHead);
}

let jogo = setInterval(iniciarJogo, settings.speed);

function applySpeed(){
    const speedInput = document.getElementById("speed");
    settings.speed = (Number.parseInt(speedInput.max) + Number.parseInt(speedInput.min)) - Number.parseInt(speedInput.value);
    setSpeed(settings.speed);
}

function setSpeed(speed){
    clearInterval(jogo);
    jogo = setInterval(iniciarJogo, speed);
}
