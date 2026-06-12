const chrono2 = {

    state: 0,

    timer: 0,

    spiralAngle: 0
};

function startChrono2(){

    chrono2.state = 0;
    chrono2.timer = 0;
    chrono2.spiralAngle = 0;

    enemyBullets.length = 0;
}

function updateChrono2(){

    chrono2.timer++;

    switch(
        chrono2.state
    ){

        // 中央へ移動
        case 0:

            chrono.x +=
                (400 - chrono.x)
                * 0.05;

            chrono.y +=
                (200 - chrono.y)
                * 0.05;

            if(
                chrono2.timer >
                120
            ){

                chrono2.timer = 0;

                chrono2.state = 1;
            }

            break;

        // 三重螺旋
        case 1:

            chrono2.spiralAngle +=
                0.12;

            if(
                chrono2.timer % 3
                === 0
            ){

                spawnSpiralBullet(
                    chrono2.spiralAngle
                );

                spawnSpiralBullet(
                    chrono2.spiralAngle +
                    Math.PI * 2 / 3
                );

                spawnSpiralBullet(
                    chrono2.spiralAngle +
                    Math.PI * 4 / 3
                );
            }

            if(
                chrono2.timer >
                180
            ){

                chrono2.timer = 0;

                chrono2.state = 2;

                freezeAllBullets();
            }

            break;

        // 停止
        case 2:

            if(
                chrono2.timer >
                60
            ){

                chrono2.timer = 0;

                chrono2.state = 3;

                accelerateAllBullets();
            }

            break;

        // 超加速期間
        case 3:

            if(
                chrono2.timer >
                90
            ){

                chrono2.timer = 0;

                chrono2.state = 1;
            }

            break;
    }
}

function spawnSpiralBullet(a){

    spawnEnemyBullet(

        chrono.x,
        chrono.y,

        Math.cos(a) * 1.5,
        Math.sin(a) * 1.5,

        6
    );
}

function freezeAllBullets(){

    enemyBullets.forEach(b=>{

        b.savedVx = b.vx;
        b.savedVy = b.vy;

        b.vx = 0;
        b.vy = 0;
    });
}

function accelerateAllBullets(){

    enemyBullets.forEach(b=>{

        if(
            b.savedVx !== undefined
        ){

            b.vx =
                b.savedVx * 6;

            b.vy =
                b.savedVy * 6;
        }
    });
}

function drawChrono2(){

    ctx.fillStyle =
        chrono2.state === 2
        ? "white"
        : "#88aaff";

    ctx.beginPath();

    ctx.arc(

        chrono.x,
        chrono.y,

        chrono.radius,

        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.strokeStyle =
        "white";

    ctx.lineWidth = 3;

    ctx.beginPath();

    ctx.arc(

        chrono.x,
        chrono.y,

        chrono.radius + 8,

        0,
        Math.PI * 2
    );

    ctx.stroke();

    // HPバー

    ctx.fillStyle = "red";

    ctx.fillRect(
        250,
        20,
        300,
        20
    );

    ctx.fillStyle = "cyan";

    ctx.fillRect(

        250,
        20,

        300 *
        (
            chrono.hp /
            chrono.maxHp
        ),

        20
    );

    ctx.fillStyle =
        "white";

    ctx.font =
        "22px sans-serif";

    ctx.fillText(

        "終刻「クロック・ゼロ」",

        220,
        60
    );

    if(
        chrono2.state === 2
    ){

        ctx.font =
            "36px sans-serif";

        ctx.fillText(

            "TIME STOP",

            250,
            120
        );
    }
}
