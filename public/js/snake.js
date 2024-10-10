var intervalID = null

class snakeNode {
    constructor(x, y, next) {
        this.x = x;
        this.y = y;
        this.next = next;
    }
}

class apple {
    constructor(x, y) {
        this.x = x;
        this.y = y
    }
}

function startSnake() {
    var canvas = document.getElementById("snake");
    let apples = [new apple(15, 10)];
    let head = new snakeNode(10, 10, null)
    let snakeHead = head;
    let didSnakeEatApple = false
    var snakeDirection = "None";
    var framesBeforeSnakeMove = 10;
    var frameCounter = 0;
    var gameOver = false
    document.addEventListener('keydown', function(event) {
        switch(event.key)
        {
            case("ArrowLeft"):
            {
                if (snakeDirection == "Right") break;
                snakeDirection = "Left";
                break;
            }
            case("ArrowRight"):
            {
                if (snakeDirection == "Left") break;
                snakeDirection = "Right";
                break;
            }
            case("ArrowUp"):
            {
                if (snakeDirection == "Down") break;
                snakeDirection = "Up";
                break;
            }
            case("ArrowDown"):
            {
                if (snakeDirection == "Up") break;
                snakeDirection = "Down";
                break;
            }
        }
    })
    
    intervalID = setInterval(function() {
        clearScreen();
        drawApples(apples);
        drawSnake(snakeHead);
        if (snakeDirection != "None")
        {
            frameCounter++;
            if (frameCounter == framesBeforeSnakeMove)
            {
                frameCounter = 0;
                let newSnakeHead = null
                // snake should move
                if (!didSnakeEatApple)
                {
                    newSnakeHead = snakeHead;
                    let newTail = newSnakeHead
                    while (newSnakeHead.next != null)
                    {
                        newTail = newSnakeHead
                        newSnakeHead = newSnakeHead.next;
                    }
    
                    newSnakeHead.x = snakeHead.x;
                    newSnakeHead.y = snakeHead.y;
                    newSnakeHead.next = snakeHead;
    
                    newTail.next = null
                    snakeHead = newSnakeHead;
                }
                else
                {
                    // if snake ate apple, add a new head leave tail as is
                    newSnakeHead = new snakeNode(snakeHead.x, snakeHead.y);
                    newSnakeHead.next = snakeHead;
                    snakeHead = newSnakeHead;

                    didSnakeEatApple = false
                }


                    
                switch(snakeDirection)
                {
                    case("Left"):
                    {
                        newSnakeHead.x--;
                        break;
                    }
                    case("Right"):
                    {
                        newSnakeHead.x++;
                        break;
                    }
                    case("Up"):
                    {
                        newSnakeHead.y--;
                        break;
                    }
                    case("Down"):
                    {
                        newSnakeHead.y++;
                        break;
                    }
                }

                for (let apple = 0; apple < apples.length; apple++)
                {
                    // if head has collided with apple
                    if ((snakeHead.x == apples[apple].x) && (snakeHead.y == apples[apple].y))
                    {
                        didSnakeEatApple = true;
                        // move apple
                        apples[apple].x = randInt(0, 19);
                        apples[apple].y = randInt(0, 19);
                        currentNode = snakeHead;
                        let areSnakeAndAppleColliding = true
                        
                        while (areSnakeAndAppleColliding)
                        {
                            let didCollide = false
                            while (currentNode != null)
                            {
                                currentNode = currentNode.next
                                if (currentNode.x == apples[apple].x && currentNode.y == apples[apple].y)
                                {
                                    didCollide = true;
                                    apples[apple].x = randInt(0, 19);
                                    apples[apple].y = randInt(0, 19);
                                }
                            }
                            if (!didCollide)
                            {
                                areSnakeAndAppleColliding = false
                            }
                        }
                    }
                }

                if (isSnakeCollidingWithSelf(snakeHead) || isSnakeCollidingWithWall(snakeHead))
                {
                    clearInterval(intervalID);
                    intervalID = null
                    ctx = canvas.getContext('2d');
                    ctx.fillStyle = "purple"
                    ctx.font = "bold 30px system-ui";
                    ctx.fillText("Game Over", 125, 200)
                }

                if (getSnakeLength(snakeHead) == 400)
                {
                    clearInterval(intervalID);
                    intervalID = null
                    ctx = canvas.getContext('2d');
                    ctx.fillStyle = "purple"
                    ctx.font = "bold 30px system-ui";
                    ctx.fillText("You Won!", 125, 200)
                }
            }
        }
        
    }, 16)
}

function clearScreen() {
    canvas = document.getElementById("snake");
    ctx = canvas.getContext("2d");
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 400, 400);
}

function drawSnake(head) {
    canvas = document.getElementById("snake");
    ctx = canvas.getContext("2d");
    ctx.fillStyle = "white";
    let currentNode = head;
    while (currentNode != null) {
        ctx.fillRect(currentNode.x * 20, currentNode.y * 20, 20, 20);
        currentNode = currentNode.next;
    } 
}

function drawApples(apples) {
    canvas = document.getElementById("snake");
    ctx = canvas.getContext("2d");
    ctx.fillStyle = "red";
    for (let i = 0; i < apples.length; i++) {
        ctx.fillRect(apples[i].x * 20, apples[i].y * 20, 20, 20);
    } 
}

function isSnakeCollidingWithSelf(snakeHead) {
    currentNode = snakeHead.next;
    while (currentNode.next != null)
    {
        currentNode = currentNode.next
        if (snakeHead.x == currentNode.x && snakeHead.y == currentNode.y)
        {
            return true;
        }
    }
    return false;
}

function isSnakeCollidingWithWall(snakeHead) {
    if (snakeHead.x < 0 || snakeHead.x > 19)
        return true

    if (snakeHead.y < 0 || snakeHead.y > 19)
        return true
}

function getSnakeLength(snakeHead) {
    let counter = 0;
    let currentNode = snakeHead
    while (currentNode != null)
    {
        counter++;
        currentNode = currentNode.next;
    }
    return counter
}

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

window.addEventListener("DOMContentLoaded", startSnake)
window.addEventListener("keydown", function(event) {
    // if enter is pressed and a game isnt ongoing, start snake
    console.log(event.key)
    if (event.key == "Enter" && intervalID == null)
    {
        startSnake();
    }
})