alert("game.js");
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const keys = {};

document.addEventListener("keydown", (e) => {
    keys[e.code] = true;
});

document.addEventListener("keyup", (e) => {
    keys[e.code] = false;
});

function drawUI() {

    ctx.fillStyle = "white";
    ctx.font = "24px sans-serif";

    ctx.fillText(
        `HP: ${player.hp}`,
        20,
        40
    );

    ctx.fillText(
        `Boss HP: ${silf.hp}`,
        20,
        70
    );
}

function drawGameOver() {

    ctx.fillStyle = "red";
    ctx.font = "48px sans-serif";

    ctx.fillText(
        "GAME OVER",
        230,
        300
    );
}

function drawVictory() {

    ctx.fillStyle = "lime";
    ctx.font = "48px sans-serif";

    ctx.fillText(
        "VICTORY",
        280,
        300
    );
}

function gameLoop() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    if(player.hp <= 0){
        drawGameOver();
        return;
    }

    if(silf.hp <= 0){
        drawVictory();
        return;
    }

    updatePlayer();
    updatePlayerBullets();

    updateSilf();
    updateEnemyBullets();

    drawPlayer();
    drawPlayerBullets();

    drawSilf();
    drawEnemyBullets();

    drawUI();

    requestAnimationFrame(gameLoop);
}

gameLoop();
