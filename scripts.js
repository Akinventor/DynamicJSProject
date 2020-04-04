window.onload = function()
{
    canvas = document.getElementById("gcanvas");
    context = canvas.getContext("2d");
    document.addEventListener("keydown", keyPush);
    setInterval(game, 1000/15);
}

// NOTE: This code is a HUGE mess. Don't read it please :))
// Read this ^

// Starts snake off with size of 1
const defaultTailSize = 1;

// Determines gap around the edge of each grid for the snake 
const pixelBorder = 2;

// Colors of the game canvas
var backgroundColor = "#000000";
var snakeColor = "#FFFFFF";
var appleColor = "#FFFFFF";

// color choices
var backgroundColors = ["#1F3B4D", "#6CB6CC", "#381E1E", "#3F35F0", "#F09C35", "#000000", "#FF7A83"];
var snakeColors = ["#D0FEFE", "#4D8292", "#75D875", "#D875D8", "#E3F035", "#20C20E", "#AFDBFF"];
var appleColors = ["#017374", "#CC826C", "#D875D8", "#A135F0", "#9C35F0", "#20C20E", "#AFFFF9"];

// starts point for snake (Top left)
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

    // this group of if statements wraps the snake round the border. Code borrowed from a tutorial I found on wrapping
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
    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Fill Snake
    context.fillStyle = snakeColor;
    for (var i = 0; i < trail.length; i++)
    {
        context.fillRect(trail[i].x * gridSize, trail[i].y * gridSize, gridSize - pixelBorder, gridSize - pixelBorder);
        if (trail[i].x == xPosition && trail[i].y == yPosition)
        {
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

        updateHighScore(tail, topScore)

        changeColors();
    }

    // Fill Goal
    context.fillStyle = appleColor;
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


function changeColors()
{
    var changeColor = Math.floor(Math.random() * backgroundColors.length)
    backgroundColor = backgroundColors[changeColor];
    snakeColor = snakeColors[changeColor];
    appleColor = appleColors[changeColor]

    var RGB = hsvToRGB(computeOppositeHue(rgbToHSV(hexToRGB(backgroundColor))));

    document.getElementById("bodyid").style.backgroundColor = "RGB(" + RGB[0] + "," + RGB[1] + "," + RGB[2] +")";
}

// This complicated mess is so that I can generate a background color on the fly
function hexToRGB(hexColor)
{
    // remove #
    if (hexColor.charAt(0) =="#" )
    {
        hexColor = hexColor.substring(1);
    }
    // convert to RGB
    var R = parseInt((hexColor).substring(0,2),16);
    var G = parseInt((hexColor).substring(2,4),16);
    var B = parseInt((hexColor).substring(4,6),16);

    var RGB = [R, G, B]

    return RGB;
}

function rgbToHSV(RGB)
{
    var R = RGB[0];
    var G = RGB[1];
    var B = RGB[2];

    var computedH = 0;
    var computedS = 0;
    var computedV = 0;

    var HSV;

    R = R / 255;
    G = G / 255;
    B = B / 255;

    var minRGB = Math.min(R,Math.min(G,B));
    var maxRGB = Math.max(R,Math.max(G,B));
   
    // Black-gray-white
    if (minRGB==maxRGB) {
     computedV = minRGB;
     HSV = [0, 0, computedV];
    }

    var D = (R == minRGB) ? G - B : ((B == minRGB) ? R-G : B - R);
    var H = (R == minRGB) ? 3 : ((B == minRGB) ? 1 : 5);
    computedH = 60*(H - D / (maxRGB - minRGB));
    computedS = (maxRGB - minRGB) / maxRGB;
    computedV = maxRGB;
    HSV = [computedH, computedS, computedV];

    return HSV;
}

function computeOppositeHue(HSV)
{
    H = HSV[0];
    H = (H + 180) % 360;
    HSV[0] = H;
    return HSV;
}

function hsvToHSL(HSV)
{
    var HSL;

    H = HSV[0];
    S = HSV[1];
    V = HSV[2];

    var L = (2 - S) * V / 2;

    if (L != 0)
    {
        if (L == 1)
        {
            S = 0;
        }
        else if (L < 0.5)
        {
            S = S * V / (L * 2);
        }
        else
        {
            S = S * V / (2 - L *2)
        }
    }
    HSL = [H, S, L]

    return HSL;
}

// This code is slightly modified, but mostly from stack overflow
function hsvToRGB(HSV)
{
    var R, G, B, i, F, P, Q, T;

    H = HSV[0];
    S = HSV[1];
    V = HSV[2];

    i = Math.floor(H * 6);
    F = H * 6 - i;
    P = V * (1 - S);
    Q = V * (1 - F * S);
    T = V * (1 - (1 - F) * S);
    switch (i % 6)
    {
        case 0: R = V, G = T, B = P; break;
        case 1: R = Q, G = V, B = P; break;
        case 2: R = P, G = V, B = T; break;
        case 3: R = P, G = Q, B = V; break;
        case 4: R = T, G = P, B = V; break;
        case 5: R = V, G = P, B = Q; break;
    }

    RGB = [Math.round(R * 255), Math.round(G * 255), Math.round(B * 255)]
    return RGB;
}


function updateHighScore(tail, topScore)
{
    if (tail - 1 > topScore)
    {
        topScore = tail - 1;
        document.getElementById("topScore").innerHTML = topScore;
    }
}