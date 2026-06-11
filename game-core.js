const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

function resize() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
}

resize();
window.addEventListener("resize", resize);

const keys = {};
const bullets = [];

let frame = 0;
let gameOver = false;

const player = {
    x: canvas.width / 2,
    y: canvas.height - 120,

    radius: 4,

    speed: 5,
    slowSpeed: 2
};

const enemy = {
    x: canvas.width / 2,
    y: 120,

    radius: 30,

    hp: 10000,
    maxHp: 10000
};

window.addEventListener("keydown", e => {
    keys[e.key.toLowerCase()] = true;
});

window.addEventListener("keyup", e => {
    keys[e.key.toLowerCase()] = false;
});

class Bullet {

    constructor(
        x,
        y,
        vx,
        vy,
        type = "normal"
    ) {

        this.x = x;
        this.y = y;

        this.vx = vx;
        this.vy = vy;

        this.type = type;

        this.life = 0;

        this.radius = 8;

        this.exploded = false;

        this.bounceCount = 0;

        this.state = "move";
    }

    update() {

        this.life++;

        if (
            this.type === "wallLeft" ||
            this.type === "wallRight"
        ) {

            this.updateWallBullet();
            return;
        }

        this.x += this.vx;
        this.y += this.vy;

        if (this.type === "bounce") {

            let bounced = false;

            if (this.x < this.radius) {
                this.x = this.radius;
                this.vx *= -1;
                bounced = true;
            }

            if (
                this.x >
                canvas.width - this.radius
            ) {
                this.x =
                    canvas.width -
                    this.radius;

                this.vx *= -1;
                bounced = true;
            }

            if (this.y < this.radius) {
                this.y = this.radius;
                this.vy *= -1;
                bounced = true;
            }

            if (
                this.y >
                canvas.height -
                this.radius
            ) {
                this.y =
                    canvas.height -
                    this.radius;

                this.vy *= -1;
                bounced = true;
            }

            if (bounced) {
                this.bounceCount++;
            }
        }

        if (
            this.type === "explode" &&
            this.life > 60 &&
            !this.exploded
        ) {

            this.exploded = true;

            for (
                let i = 0;
                i < 12;
                i++
            ) {

                const angle =
                    Math.PI * 2 / 12 * i;

                bullets.push(
                    new Bullet(
                        this.x,
                        this.y,
                        Math.cos(angle) * 4,
                        Math.sin(angle) * 4
                    )
                );
            }
        }
    }

    updateWallBullet() {

        if (this.state === "move") {

            this.x += this.vx;

            if (
                this.type === "wallLeft" &&
                this.x <= 20
            ) {

                this.x = 20;
                this.vx = 0;
                this.vy = 0;

                this.state = "wait";
            }

            if (
                this.type === "wallRight" &&
                this.x >= canvas.width - 20
            ) {

                this.x =
                    canvas.width - 20;

                this.vx = 0;
                this.vy = 0;

                this.state = "wait";
            }

        } else if (
            this.state === "fire"
        ) {

            this.x += this.vx;
            this.y += this.vy;
        }
    }

    remove() {

        if (
            this.type === "bounce" &&
            this.bounceCount >= 3
        ) {
            return true;
        }

        return (
            this.life > 1200 ||
            this.x < -200 ||
            this.x > canvas.width + 200 ||
            this.y < -200 ||
            this.y > canvas.height + 200
        );
    }

    draw() {

        let color = "#ff9933";

        switch (this.type) {

            case "explode":
                color = "#44aaff";
                break;

            case "bounce":
                color = "#44ff88";
                break;

            case "flower":
                color = "#ff66cc";
                break;

            case "spiral":
                color = "#cc88ff";
                break;

            case "wallLeft":
            case "wallRight":
                color = "#ffff44";
                break;
        }

        ctx.beginPath();
        ctx.arc(
            this.x,
            this.y,
            this.radius,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = color;
        ctx.fill();
    }
}

function updatePlayer() {

    const moveSpeed =
        keys["shift"]
            ? player.slowSpeed
            : player.speed;

    if (keys["w"])
        player.y -= moveSpeed;

    if (keys["s"])
        player.y += moveSpeed;

    if (keys["a"])
        player.x -= moveSpeed;

    if (keys["d"])
        player.x += moveSpeed;

    player.x = Math.max(
        20,
        Math.min(
            canvas.width - 20,
            player.x
        )
    );

    player.y = Math.max(
        20,
        Math.min(
            canvas.height - 20,
            player.y
        )
    );
}

function updateBullets() {

    for (const bullet of bullets) {
        bullet.update();
    }

    for (
        let i = bullets.length - 1;
        i >= 0;
        i--
    ) {

        if (
            bullets[i].remove()
        ) {
            bullets.splice(i, 1);
        }
    }
}

function checkHit() {

    for (const bullet of bullets) {

        const dx =
            bullet.x - player.x;

        const dy =
            bullet.y - player.y;

        const dist =
            Math.hypot(dx, dy);

        if (
            dist <
            bullet.radius +
            player.radius
        ) {

            gameOver = true;
            return;
        }
    }
}

function drawBackground() {

    ctx.fillStyle = "#000";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );
}

function drawEnemy() {

    ctx.beginPath();

    ctx.arc(
        enemy.x,
        enemy.y,
        enemy.radius,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = "#ff4444";
    ctx.fill();

    ctx.fillStyle = "#333";

    ctx.fillRect(
        enemy.x - 100,
        enemy.y - 60,
        200,
        10
    );

    ctx.fillStyle = "#00ff66";

    ctx.fillRect(
        enemy.x - 100,
        enemy.y - 60,
        200 *
        (
            enemy.hp /
            enemy.maxHp
        ),
        10
    );
}

function drawPlayer() {

    ctx.beginPath();

    ctx.arc(
        player.x,
        player.y,
        18,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = "#4488ff";
    ctx.fill();

    ctx.beginPath();

    ctx.arc(
        player.x,
        player.y,
        player.radius,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = "#ffffff";
    ctx.fill();

    if (keys["shift"]) {

        ctx.beginPath();

        ctx.arc(
            player.x,
            player.y,
            25,
            0,
            Math.PI * 2
        );

        ctx.strokeStyle =
            "#ffffff";

        ctx.stroke();
    }
}

function drawBullets() {

    for (const bullet of bullets) {
        bullet.draw();
    }
}

function drawGameOver() {

    ctx.fillStyle =
        "rgba(0,0,0,0.6)";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.fillStyle = "#ff4444";

    ctx.font =
        "64px sans-serif";

    ctx.textAlign =
        "center";

    ctx.fillText(
        "GAME OVER",
        canvas.width / 2,
        canvas.height / 2
    );
}

function drawInfo() {

    ctx.fillStyle = "#ffffff";

    ctx.font =
        "16px sans-serif";

    ctx.textAlign =
        "left";

    ctx.fillText(
        "WASD Move",
        20,
        30
    );

    ctx.fillText(
        "SHIFT Slow",
        20,
        50
    );

    ctx.fillText(
        "Bullets: " +
        bullets.length,
        20,
        70
    );
}

function draw() {

    drawBackground();

    drawEnemy();

    drawBullets();

    drawPlayer();

    drawInfo();
}

function loop() {

    if (!gameOver) {

        frame++;

        updatePlayer();

        updateBullets();

        checkHit();

        if (
            typeof attackControl ===
            "function"
        ) {
            attackControl();
        }

        draw();

    } else {

        draw();
        drawGameOver();
    }

    requestAnimationFrame(loop);
}

loop();
