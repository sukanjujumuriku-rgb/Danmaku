alert("player.js");
const player = {
    x:400,
    y:500,

    speed:4,

    radius:10,

    hp: 100,

    invincible:0
};

const playerBullets = [];

let chargeStart = null;
let shotCooldown = 0;

function spawnPlayerBullet(power){

    playerBullets.push({
        x:player.x,
        y:player.y,

        speed:8,

        power:power,

        radius:
            power === 10
            ? 8
            : 4
    });
}

function updatePlayer(){

    if(keys["KeyW"]) player.y -= player.speed;
    if(keys["KeyS"]) player.y += player.speed;
    if(keys["KeyA"]) player.x -= player.speed;
    if(keys["KeyD"]) player.x += player.speed;

    player.x =
        Math.max(
            0,
            Math.min(canvas.width,player.x)
        );

    player.y =
        Math.max(
            0,
            Math.min(canvas.height,player.y)
        );

    if(player.invincible > 0){
        player.invincible--;
    }

    if(shotCooldown > 0){
        shotCooldown--;
    }

    // 通常弾

    if(
        keys["Space"] &&
        !keys["KeyF"]
    ){

        if(shotCooldown <= 0){

            spawnPlayerBullet(5);

            shotCooldown = 2;
        }
    }

    // チャージ開始

    if(
        keys["Space"] &&
        keys["KeyF"] &&
        chargeStart === null
    ){
        chargeStart = performance.now();
    }

    // チャージ解除

    if(
        chargeStart !== null &&
        (!keys["Space"] || !keys["KeyF"])
    ){

        const held =
            (performance.now()
            - chargeStart) / 1000;

        if(held >= 1){

            spawnPlayerBullet(10);
        }

        chargeStart = null;
    }
}

function updatePlayerBullets(){

    for(
        let i = playerBullets.length - 1;
        i >= 0;
        i--
    ){

        const b =
            playerBullets[i];

        b.y -= b.speed;

        const dx =
            b.x - silf.x;

        const dy =
            b.y - silf.y;

        const dist =
            Math.sqrt(
                dx*dx + dy*dy
            );

        if(
            dist <
            silf.radius +
            b.radius
        ){

            silf.hp -= b.power;

            playerBullets.splice(i,1);

            continue;
        }

        if(b.y < -20){

            playerBullets.splice(i,1);
        }
    }
}

function drawPlayer(){

    if(
        player.invincible > 0 &&
        Math.floor(
            player.invincible / 5
        ) % 2 === 0
    ){
        return;
    }

    ctx.fillStyle = "cyan";

    ctx.beginPath();

    ctx.arc(
        player.x,
        player.y,
        player.radius,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.fillStyle = "white";

    ctx.beginPath();

    ctx.arc(
        player.x,
        player.y,
        3,
        0,
        Math.PI * 2
    );

    ctx.fill();
}

function drawPlayerBullets(){

    playerBullets.forEach(b=>{

        ctx.fillStyle =
            b.power === 10
            ? "lime"
            : "yellow";

        ctx.beginPath();

        ctx.arc(
            b.x,
            b.y,
            b.radius,
            0,
            Math.PI * 2
        );

        ctx.fill();
    });
}
