//playing board
var blockSize = 25;
var row = 20, col = 20;
if(screen.width <= 480){
    blockSize = 15;
    row = col = 20;
}
var board, context;
var setIntervalId;
//snake head
var snakeX = blockSize * 5, snakeY = snakeX;
var speedX = 0, speedY = 0;
var snakeBody = [];

//food
var foodX = blockSize * 10, foodY = foodX;

var scoreElement = document.querySelector(".score");
var highScoreElement = document.querySelector(".high-score");
var score = 0;
var highScore = localStorage.getItem("high-score") || 0;
highScoreElement.textContent = `High Score: ${highScore}`;

var gameOver = false;

//for touch events(mobile version)
var startingX, startingY, endingX, endingY;
var moving = false;

//game audio
var gameOverAudio = new Audio('assets/game audio/game-over.mp3');
var foodAudio = new Audio('assets/game audio/food.mp3');


window.onload = ()=>{
    board = document.querySelector("#board");
    board.height = row * blockSize;
    board.width = col * blockSize;
    context = board.getContext("2d");

    placeFood();
    document.addEventListener("keyup",changeDirection);
    // update();
    setIntervalId = setInterval(update, 100);
}

const handleGameOver = () => {
    gameOverAudio.play();
    clearInterval(setIntervalId);
    alert("Game over! Press OK to play again");
    location.reload();
}

function update(){
    if(gameOver) return handleGameOver();
    context.fillStyle = "black";
    context.fillRect(0,0,board.width,board.height);

    
    //filling the snake food onload position
    context.fillStyle = "red";
    context.fillRect(foodX,foodY,blockSize,blockSize);

    //checking if snake ate food
    if(snakeX == foodX && snakeY == foodY){
        foodAudio.play();
        snakeBody.push([foodX,foodY]);
        placeFood();
        score++;
        highScore = (score > highScore)?score : highScore;
        localStorage.setItem("high-score",highScore);
        scoreElement.textContent = `Score: ${score}`;
        highScoreElement.textContent = `High Score: ${highScore}`;
    }

    for(let i = snakeBody.length-1; i>0; i--){
        snakeBody[i] = snakeBody[i-1];
    }
    if(snakeBody.length){
        snakeBody[0] = [snakeX, snakeY];
    }

    //filling the snake starting position(on loading the page)
    context.fillStyle = "green";
    snakeX += speedX * blockSize;
    snakeY += speedY * blockSize;
    context.fillRect(snakeX, snakeY, blockSize, blockSize);
    for(let i =0; i< snakeBody.length; i++){
        context.fillRect(snakeBody[i][0], snakeBody[i][1],blockSize, blockSize);
    }

    // game over conditions
    if(snakeX < 0 || snakeX >col*blockSize || snakeY < 0 || snakeY > row*blockSize){
        gameOver = true;
    }
    for(let i = 0; i < snakeBody.length; i++){
        if(snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]){
            gameOver = true;
        }
    }
}

//changing the position of food
let placeFood = ()=>{
    foodX = Math.floor(Math.random() * row) * blockSize;
    foodY = Math.floor(Math.random() * col) * blockSize;
}

//touch events (mobile version)
// let handleSwipe = (swipeDir) =>{
//     if()
// }
document.addEventListener("touchstart",(event)=>{
    startingX = event.touches[0].clientX;
    startingY = event.touches[0].clientY;
})
document.addEventListener("touchmove",(event)=>{
    moving = true;
    endingX = event.touches[0].clientX;
    endingY = event.touches[0].clientY;
})
document.addEventListener("touchend",()=>{
    if(!moving) return;
    let touchDirection;
    //if swiped right
    if(Math.abs(endingX - startingX) > Math.abs(endingY - startingY)){
        if(endingX > startingX) touchDirection = "ArrowRight";
        else touchDirection = "ArrowLeft";
    }
    else{
        if(endingY > startingY) touchDirection = "ArrowDown";
        else touchDirection = "ArrowUp";
    }
    // handleSwipe(touchDirection);
    changeDirection(touchDirection);
})

//changing the snake direction
let changeDirection = (e)=>{
    if((e.code == "ArrowUp" || e == "ArrowUp") && speedY != 1){
        speedX = 0;
        speedY = -1;
    }
    else if((e.code == "ArrowDown" || e == "ArrowDown") && speedY != -1){
        speedX = 0;
        speedY = 1;
    }
    else if((e.code == "ArrowRight" || e == "ArrowRight") && speedX != -1){
        speedX = 1;
        speedY = 0;
    }
    else if((e.code == "ArrowLeft" || e == "ArrowLeft") && speedX != 1){
        speedX = -1;
        speedY = 0;
    }
}