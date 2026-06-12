alert("silf.js");
const silf = {

    x:400,
    y:100,

    radius:25,

    hp:1000,

    maxHp:1000,

    dir:1
};

const enemyBullets = [];

let enemyTimer = 0;

function updateSilf(){

    silf.x += silf.dir * 2;

    if(silf.x > 700){
        silf.dir = -1;
    }

    if(silf.x < 100){
        silf.dir = 1;
    }

    enemyTimer++;

    if(enemyTimer > 30){

        enemyTimer = 0;

        const count = 8;

        for(
            let i=0;
            i<count;
            i++
        ){

            const angle =
                (Math.PI*2/count)
                * i;

            enemyBullets.push({

                x:silf.x,
                y:silf.y,

                vx:
                    Math.cos(angle)
                    * 2,

                vy:
                    Math.sin(angle)
                    * 2,

                radius:5
            });
        }
    }
}

function updateEnemyBullets(){

    for(
        let i =
        enemyBullets.length - 1;
        i >= 0;
        i--
    ){

        const b =
            enemyBullets[i];

        b.x += b.vx;
        b.y += b.vy;

        const dx =
            b.x - player.x;

        const dy =
            b.y - player.y;

        const dist =
            Math.sqrt(
                dx*dx + dy*dy
            );

        if(
            dist <
            player.radius +
            b.radius &&
            player.invincible <= 0
        ){

            player.hp--;

            player.invincible = 60;

            enemyBullets.splice(i,1);

            continue;
        }

        if(
            b.x < -20 ||
            b.x > canvas.width + 20 ||
            b.y < -20 ||
            b.y > canvas.height + 20
        ){
            enemyBullets.splice(i,1);
        }
    }
}

function drawSilf(){

    ctx.fillStyle = "white";

    ctx.beginPath();

    ctx.arc(
        silf.x,
        silf.y,
        silf.radius,
        0,
        Math.PI*2
    );

    ctx.fill();

    ctx.fillStyle = "red";

    ctx.fillRect(
        250,
        20,
        300,
        20
    );

    ctx.fillStyle = "lime";

    ctx.fillRect(
        250,
        20,
        300 *
        (silf.hp/silf.maxHp),
        20
    );
}

function drawEnemyBullets(){

    ctx.fillStyle = "orange";

    enemyBullets.forEach(b=>{

        ctx.beginPath();

        ctx.arc(
            b.x,
            b.y,
            b.radius,
            0,
            Math.PI*2
        );

        ctx.fill();
    });
}
