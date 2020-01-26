import { collisionDetection } from "./physics.js";

let character;
let mainLevel;

function main() {
    gameArea.start();
    character = new characterCreator(10, 250);
    levelCreator.start();
    collisionDetection.start(levelCreator);
}

function updateGameArea() {
    gameArea.clear();
    characterController();
    character.update();
    levelCreator.update();
}

let gameArea = {
    canvas: document.createElement("canvas"),
    start: function() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.context = this.canvas.getContext("2d");
        window.addEventListener("keydown", handleKeyPress);
        window.addEventListener("keyup", handleKeyRelease);
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 30);
    },
    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
};

function characterCreator(x, y) {
    this.x = x;
    this.y = y;
    this.width = 100;
    this.height = 250;
    this.originalHeight = this.height;
    this.weight = 1;
    this.gravity = 0;
    this.isCrouching = false;
    this.isAirborne = false;
    this.isRunning = false;
    this.hasJumped = false;
    this.collided = false;
    this.collisionDetection = collisionDetection.applyColliosionDetection(this);
    this.speed = 12;
    this.originalSpeed = this.speed;
    this.jumpHeight = 36;
    this.force = 0;
    this.friction = 1.5;
    this.update = function() {
        if (this.isAirborne) {
            this.friction = 0.5;
        } else {
            this.friction = 1.5;
        }

        if (this.force > 0.5) {
            this.force -= this.friction;
        } else if (this.force < -0.5) {
            this.force += this.friction;
        } else {
            this.force = 0;
            this.friction = 1.5;
        }

        if (!this.collided) {
            this.x += this.force;
        }
        applyGravity(this);
        groundCheck(this);

        // GRAPHICS
        this.context = gameArea.context;
        this.context.fillStyle = "red";
        this.context.fillRect(this.x, this.y, this.width, this.height);
    };
}

let level = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 0, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 1],
    [0, 0, 0, 0, 0, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1]
];
let levelCreator = {
    start: function() {
        for (let a in level) {
            for (let b in level[a]) {
                if (level[a][b] === 1) {
                    let block = new blockCreator(
                        (gameArea.canvas.width / level[0].length) * b,
                        (gameArea.canvas.height / level.length) * a,
                        gameArea.canvas.width / level[0].length,
                        gameArea.canvas.height / level.length
                    );
                    level[a][b] = block;
                } else {
                    level[a][b] = new blockCreator(0, 0, 0, 0);
                }
            }
        }
    },
    update: function() {
        for (let i = 0; i < level.length; i++) {
            for (let j = 0; j < level[i].length; j++) {
                level[i][j].update();
            }
        }
    }
};

function blockCreator(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.update = function() {
        this.context = gameArea.context;
        this.context.fillStyle = "green";
        this.context.fillRect(this.x, this.y, this.width, this.height);
    };
}

let keys = [];

function handleKeyPress(e) {
    if (e.keyCode === 65) {
        keys["left"] = true;
    }
    if (e.keyCode === 68) {
        keys["right"] = true;
    }
    if (e.keyCode === 32) {
        keys["jump"] = true;
    }
    if (e.keyCode === 83) {
        keys["crouch"] = true;
    }
    if (e.keyCode === 87) {
        keys["open"] = true;
    }
    e.stopPropagation();
}

function handleKeyRelease(e) {
    if (e.keyCode === 65) {
        keys["left"] = false;
        character.isRunning = false;
    }
    if (e.keyCode === 68) {
        keys["right"] = false;
        character.isRunning = false;
    }
    if (e.keyCode === 32) {
        keys["jump"] = false;
    }
    if (e.keyCode === 83) {
        keys["crouch"] = false;
        character.isCrouching = false;
        character.speed = character.originalSpeed;
        character.height = character.originalHeight;
    }
    if (e.keyCode === 87) {
        keys["open"] = false;
    }
    e.stopPropagation();
}

function characterController() {
    if (keys["crouch"]) {
        if (!character.isCrouching) {
            character.isCrouching = true;
            character.height = character.height * 0.6;

            if (character.isAirborne) {
                character.speed = character.speed * 1.125;
            } else {
                character.y = character.y + character.originalHeight * 0.4;
                character.speed = character.speed * 0.5;
            }
        }
    }
    if (keys["jump"]) {
        if (!character.isAirborne) {
            jump();
        }
    }
    if (keys["right"] && !keys["left"]) {
        character.isRunning = true;
        applyForce(character, 1, character.speed);
    }
    if (keys["left"] && !keys["right"]) {
        character.isRunning = true;
        applyForce(character, -1, character.speed);
    }
}

function jump() {
    if (!character.isAirborne) {
        character.isAirborne = true;
        character.hasJumped = true;
        applyForce(character, 0, -character.jumpHeight);
    }
}

function applyGravity(element) {
    if (!element.isAirborne) {
        element.gravity = 0;
    } else {
        applyForce(element, 0, 3.2);
        element.y += element.gravity;
    }
}

function groundCheck(element) {
    // Find the elements buttom position
    let posX = element.x + element.width / 2;
    let posY = element.y + element.height;

    // Check if there is ground colliding with the element (crude check)
    for (let e in level) {
        for (let f in level[e]) {
            if (
                posX > level[e][f].x &&
                posX < level[e][f].x + level[e][f].width
            ) {
                if (
                    posY >= level[e][f].y &&
                    element.y <= level[e][f].y + level[e][f].height
                ) {
                    element.isAirborne = false;
                    element.hasJumped = false;
                    element.y = level[e][f].y - element.height;
                    return;
                } else {
                    element.isAirborne = true;
                }
            }
        }
    }
}

function applyForce(element, direction, force) {
    let dir = Math.acos(direction);
    let verticalForce = Math.round(Math.sin(dir) * 100) / 100;
    let horizontalForce = Math.round(Math.cos(dir) * 100) / 100;

    element.force = horizontalForce * force;
    element.gravity += verticalForce * force;
}

function canMove() {
    return true;
}

main();
