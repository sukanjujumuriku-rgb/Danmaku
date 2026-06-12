const silf = {
    x: 400,
    y: 120,

    radius: 25,

    hp: 1000,
    maxHp: 1000,

    phase: 0,

    spiralAngle: 0,
    moveAngle: 0,

    attackTimer: 0,

    teleportCooldown: 0
};

const enemyBullets = [];

function spawnEnemyBullet(x, y, vx, vy, size = 5) {

    enemyBullets.push({
        x,
        y,
        vx,
        vy,
        radius: size,
        damage: 5
    });
}

function updateSilf() {

    // フェーズ判定

    if (silf.hp > 800) {
        silf.phase = 0;
    }
    else if (silf.hp > 600) {
        silf.phase = 1;
    }
    else if (silf.hp > 100) {
        silf.phase = 2;
    }
    else {
        silf.phase = 3;
    }

    silf.attackTimer++;

    // 共通移動

    silf.moveAngle += 0.02;

    silf.x =
        400 +
        Math.cos(silf.moveAngle) * 220;

    silf.y =
        120 +
        Math.sin(silf.moveAngle) * 40;

    switch (silf.phase) {

        // 通常攻撃
        case 0:

            if (silf.attackTimer > 45) {

                silf.attackTimer = 0;

                const rot =
                    performance.now() / 1000;

                for (let i = 0; i < 8; i++) {

                    const a =
                        rot +
                        (Math.PI * 2 / 8) * i;

                    spawnEnemyBullet(
                        silf.x,
                        silf.y,
                        Math.cos(a) * 2,
                        Math.sin(a) * 2
                    );
                }
            }

            break;

        // 追風の環
        case 1:

            if (silf.attackTimer > 70) {

                silf.attackTimer = 0;

                for (let i = 0; i < 24; i++) {

                    const a =
                        (Math.PI * 2 / 24) * i;

                    spawnEnemyBullet(
                        silf.x,
                        silf.y,
                        Math.cos(a) * 1.8,
                        Math.sin(a) * 1.8
                    );
                }
            }

            break;

        // 乱流スパイラル
        case 2:

            if (silf.attackTimer > 3) {

                silf.attackTimer = 0;

                silf.spiralAngle += 0.2;

                spawnEnemyBullet(
                    silf.x,
                    silf.y,
                    Math.cos(silf.spiralAngle) * 3,
                    Math.sin(silf.spiralAngle) * 3
                );

                spawnEnemyBullet(
                    silf.x,
                    silf.y,
                    Math.cos(silf.spiralAngle + Math.PI) * 3,
                    Math.sin(silf.spiralAngle + Math.PI) * 3
                );
            }

            break;

        // 風下の死角
        case 3:

            if (silf.teleportCooldown <= 0) {

                silf.teleportCooldown = 90;

                silf.x = player.x;
                silf.y = player.y + 120;

                const dx =
                    player.x - silf.x;

                const dy =
                    player.y - silf.y;

                const base =
                    Math.atan2(dy, dx);

                for (let i = -4; i <= 4; i++) {

                    const a =
                        base + i * 0.2;

                    spawnEnemyBullet(
                        silf.x,
                        silf.y,
                        Math.cos(a) * 4,
                        Math.sin(a) * 4,
                        6
                    );
                }
            }

            silf.teleportCooldown--;

            break;
    }
}

function updateEnemyBullets() {

    for (
        let i = enemyBullets.length - 1;
        i >= 0;
        i--
    ) {

        const b = enemyBullets[i];

        b.x += b.vx;
        b.y += b.vy;

        const dx =
            b.x - player.x;

        const dy =
            b.y - player.y;

        const dist =
            Math.sqrt(dx * dx + dy * dy);

        if (
            dist <
            player.radius + b.radius &&
            player.invincible <= 0
        ) {

            player.hp -= b.damage;

            player.invincible = 60;

            enemyBullets.splice(i, 1);

            continue;
        }

        if (
            b.x < -50 ||
            b.x > canvas.width + 50 ||
            b.y < -50 ||
            b.y > canvas.height + 50
        ) {

            enemyBullets.splice(i, 1);
        }
    }
}

function drawSilf() {

    ctx.fillStyle = "white";

    ctx.beginPath();
    ctx.arc(
        silf.x,
        silf.y,
        silf.radius,
        0,
        Math.PI * 2
    );
    ctx.fill();

    // HPバー

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
        300 * (silf.hp / silf.maxHp),
        20
    );

    // スペル名

    ctx.fillStyle = "white";
    ctx.font = "18px sans-serif";

    const names = [
        "通常攻撃",
        "風符「追風の環」",
        "旋風符「乱流スパイラル」",
        "柳風「風下の死角」"
    ];

    ctx.fillText(
        names[silf.phase],
        280,
        60
    );
}

function drawEnemyBullets() {

    ctx.fillStyle = "orange";

    enemyBullets.forEach(b => {

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
