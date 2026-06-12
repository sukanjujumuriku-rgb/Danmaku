const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const keys = {};

document.addEventListener("keydown", e=>{
    keys[e.code] = true;
});

document.addEventListener("keyup", e=>{
    keys[e.code] = false;
});

let currentBoss = "silf";
let transitionTimer = 0;

function drawUI(){

    ctx.fillStyle = "white";
    ctx.font = "24px sans-serif";

    ctx.fillText(
        `HP : ${player.hp}`,
        20,
        40
    );
}

function drawTransition(){

    ctx.fillStyle = "white";

    ctx.font = "48px sans-serif";

    ctx.fillText(
        "WARNING",
        250,
        220
    );

    ctx.font = "32px sans-serif";

    ctx.fillText(
        "TIME DISTORTION DETECTED",
        120,
        300
    );

    ctx.font = "40px sans-serif";

    ctx.fillText(
        "CHRONOA",
        260,
        380
    );
}

function gameLoop(){

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    // 共通
    updatePlayer();
    updatePlayerBullets();

    drawPlayer();
    drawPlayerBullets();

    drawUI();

    // シルフレイン
    if(currentBoss === "silf"){

        updateSilf();
        updateEnemyBullets();

        drawSilf();
        drawEnemyBullets();

        if(silf.hp <= 0){

            currentBoss = "transition";

            transitionTimer = 300; // 5秒
        }
    }

    // 演出
    else if(currentBoss === "transition"){

        drawTransition();

        transitionTimer--;

        if(transitionTimer <= 0){

            currentBoss = "chrono1";
        }
    }

    // クロノア前半
    else if(currentBoss === "chrono1"){

        updateChrono1();
        updateEnemyBullets();

        drawChrono1();
        drawEnemyBullets();

        if(chrono.hp <= 100){

            currentBoss = "chrono2";

            if(typeof startChrono2 === "function"){
                startChrono2();
            }
        }
    }

    // クロノア後半
    else if(currentBoss === "chrono2"){

        updateChrono2();
        updateEnemyBullets();

        drawChrono2();
        drawEnemyBullets();

        if(chrono.hp <= 0){

            ctx.fillStyle = "lime";
            ctx.font = "48px sans-serif";

            ctx.fillText(
                "CHRONOA DEFEATED",
                130,
                300
            );

            return;
        }
    }

    // プレイヤー死亡

    if(player.hp <= 0){

        ctx.fillStyle = "red";
        ctx.font = "48px sans-serif";

        ctx.fillText(
            "GAME OVER",
            220,
            300
        );

        return;
    }

    requestAnimationFrame(
        gameLoop
    );
}

gameLoop();
