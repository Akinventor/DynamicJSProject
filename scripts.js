window.onload = function()
{
    canvas = document.getElementById("gcanvas");
    context = canvas.getContext("2d");
    document.addEventListener("keydown", keyPush);
    setInterval(game, 1000/15);
}
// Starts snake off with size of 1
const defaultTailSize = 1;

// Determines gap around the edge of each grid for the snake 
const pixelBorder = 2;

// starts point for snake
var xPosition = 0;
var yPosition = 0;

// grid size is 20 tiles and tile size is 20xp
const gridSize = 20;
const tileCount = 40;

// Randomly places goal
var xApple = randomCoordinate();
var yApple = randomCoordinate();

// velocity
var xVelocity = 0;
var yVelocity = 0;

// Keeps track of all tail elements
trail = [];
var tail = defaultTailSize;

var topScore = 0;

function game()
{
    xPosition += xVelocity;
    yPosition += yVelocity;

    // this group of if statements wraps the snake round the border.
    if (xPosition < 0)
    {
        xPosition = tileCount - 1;
    }
    else if (xPosition > tileCount - 1)
    {
        xPosition = 0;
    }
    if (yPosition < 0)
    {
        yPosition = tileCount - 1;
    }
    else if (yPosition > tileCount - 1)
    {
        yPosition = 0;
    }

    // Fill Background
    context.fillStyle = "#1F3B4D";
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Fill Snake
    context.fillStyle = "#D0FEFE";
    for (var i = 0; i < trail.length; i++)
    {
        context.fillRect(trail[i].x * gridSize, trail[i].y * gridSize, gridSize - pixelBorder, gridSize - pixelBorder);
        if (trail[i].x == xPosition && trail[i].y == yPosition)
        {
            if (tail > topScore)
            {
                topScore = tail;
                document.getElementById("topScore").innerHTML = topScore;
            }
            tail = defaultTailSize;
        }
    }

    trail.push({x:xPosition, y:yPosition});

    while (trail.length > tail)
    {
        trail.shift();
    }

    // Extends length of tail if apple is eaten
    if (xApple == xPosition && yApple == yPosition)
    {
        tail++;
        xApple = randomCoordinate();
        yApple = randomCoordinate();
    }

    // Fill Goal
    context.fillStyle = "#017374";
    context.fillRect(xApple * gridSize, yApple * gridSize, gridSize - pixelBorder, gridSize - pixelBorder);
}

function keyPush(event)
{
    // Switch statement changes velocity / direction of the snake
    //if statements ensure the user does not run over itself
    switch(event.keyCode)
    {
        case 37:
            if (xVelocity != 1)
            {
                xVelocity = -1; yVelocity = 0;
            }
            break;
        case 38:
            if (yVelocity != 1)
            {
                xVelocity = 0; yVelocity = -1;
            }
            break;
        case 39:
            if (xVelocity != -1)
            {
                xVelocity = 1; yVelocity = 0;
            }
            break;
        case 40:
            if (yVelocity != -1)
            {
                xVelocity = 0; yVelocity = 1;
            }
            break;
    }
}

function randomCoordinate()
{
    return Math.floor(Math.random() * tileCount);
}