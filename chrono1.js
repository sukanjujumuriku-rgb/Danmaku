const chrono = {
    x: 400,
    y: 120,

    radius: 25,

    hp: 500,
    maxHp: 500,

    currentSpell: 0,
    spellTimer: 0,

    lastSpell: -1,

    moveAngle: 0
};

chooseChronoSpell();

function chooseChronoSpell(){

    let next;

    do{

        next =
            Math.floor(
                Math.random() * 5
            );

    }while(
        next === chrono.lastSpell
    );

    chrono.lastSpell = next;
    chrono.currentSpell = next;

    chrono.spellTimer = 0;
}

function updateChrono1(){

    chrono.spellTimer++;

    chrono.moveAngle += 0.02;

    chrono.x =
        400 +
        Math.cos(
            chrono.moveAngle
        ) * 120;

    chrono.y =
        120 +
        Math.sin(
            chrono.moveAngle
        ) * 30;

    if(
        chrono.spellTimer > 300
    ){
        chooseChronoSpell();
    }

    switch(
        chrono.currentSpell
    ){

        case 0:
            stopNeedle();
            break;

        case 1:
            accelNeedle();
            break;

        case 2:
            reverseClock();
            break;

        case 3:
            futureSight();
            break;

        case 4:
            afterImage();
            break;
    }
}

function stopNeedle(){

    if(
        chrono.spellTimer % 20 !== 0
    ) return;

    for(
        let i=0;
        i<8;
        i++
    ){

        const a =
            (Math.PI*2/8)*i;

        enemyBullets.push({

            x:chrono.x,
            y:chrono.y,

            vx:
                Math.cos(a)*2,

            vy:
                Math.sin(a)*2,

            radius:5,

            damage:5,

            age:0,

            stopTime:60
        });
    }
}

function accelNeedle(){

    if(
        chrono.spellTimer % 10 !== 0
    ) return;

    const a =
        Math.random()
        * Math.PI * 2;

    enemyBullets.push({

        x:chrono.x,
        y:chrono.y,

        vx:
            Math.cos(a),

        vy:
            Math.sin(a),

        radius:5,

        damage:5,

        age:0,

        accel:0.03
    });
}

function reverseClock(){

    if(
        chrono.spellTimer % 15 !== 0
    ) return;

    const a =
        Math.random()
        * Math.PI * 2;

    enemyBullets.push({

        x:chrono.x,
        y:chrono.y,

        vx:
            Math.cos(a)*3,

        vy:
            Math.sin(a)*3,

        radius:5,

        damage:5,

        age:0,

        reverseTime:90
    });
}

function futureSight(){

    if(
        chrono.spellTimer % 60 !== 0
    ) return;

    const dx =
        player.x -
        chrono.x;

    const dy =
        player.y -
        chrono.y;

    const len =
        Math.hypot(dx,dy);

    enemyBullets.push({

        x:chrono.x,
        y:chrono.y,

        vx:
            dx/len*5,

        vy:
            dy/len*5,

        radius:6,

        damage:10
    });
}

function afterImage(){

    if(
        chrono.spellTimer % 45 !== 0
    ) return;

    enemyBullets.push({

        x:player.x,
        y:player.y,

        vx:0,
        vy:0,

        radius:15,

        damage:10
    });
}

function drawChrono1(){

    ctx.fillStyle =
        "#88aaff";

    ctx.beginPath();

    ctx.arc(
        chrono.x,
        chrono.y,
        chrono.radius,
        0,
        Math.PI*2
    );

    ctx.fill();

    ctx.strokeStyle =
        "white";

    ctx.lineWidth = 2;

    ctx.beginPath();

    ctx.arc(
        chrono.x,
        chrono.y,
        chrono.radius + 8,
        0,
        Math.PI*2
    );

    ctx.stroke();

    ctx.fillStyle =
        "white";

    ctx.fillRect(
        250,
        20,
        300,
        20
    );

    ctx.fillStyle =
        "blue";

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

    const names = [

        "時符「停止秒針」",

        "時符「加速秒針」",

        "時符「逆行時計」",

        "時符「未来観測」",

        "時符「残像時刻」"
    ];

    ctx.fillStyle =
        "white";

    ctx.font =
        "20px sans-serif";

    ctx.fillText(
        names[
            chrono.currentSpell
        ],
        250,
        70
    );
}
