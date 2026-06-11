/* =========================
   共通
========================= */

function aimedVector(speed) {

    const dx = player.x - enemy.x;
    const dy = player.y - enemy.y;

    const len = Math.hypot(dx, dy);

    return {
        vx: dx / len * speed,
        vy: dy / len * speed
    };
}

/* =========================
   追尾5連
========================= */

function aimed5() {

    for (let i = 0; i < 5; i++) {

        setTimeout(() => {

            const v = aimedVector(5);

            bullets.push(
                new Bullet(
                    enemy.x,
                    enemy.y,
                    v.vx,
                    v.vy
                )
            );

        }, i * 120);

    }
}

/* =========================
   追尾25連
========================= */

function aimed25() {

    for (let i = 0; i < 25; i++) {

        setTimeout(() => {

            const v = aimedVector(6);

            bullets.push(
                new Bullet(
                    enemy.x,
                    enemy.y,
                    v.vx,
                    v.vy
                )
            );

        }, i * 80);

    }
}

/* =========================
   円形ばら撒き
========================= */

function circleSpread() {

    for (let i = 0; i < 24; i++) {

        const angle =
            Math.PI * 2 / 24 * i;

        bullets.push(
            new Bullet(
                enemy.x,
                enemy.y,
                Math.cos(angle) * 3,
                Math.sin(angle) * 3
            )
        );
    }
}

/* =========================
   花びら
========================= */

function flowerPattern() {

    const rot = frame * 0.03;

    for (let i = 0; i < 48; i++) {

        const angle =
            Math.PI * 2 / 48 * i;

        const speed =
            2 +
            Math.sin(
                angle * 4 + rot
            ) * 1.5;

        bullets.push(
            new Bullet(
                enemy.x,
                enemy.y,
                Math.cos(angle + rot) * speed,
                Math.sin(angle + rot) * speed,
                "flower"
            )
        );
    }
}

/* =========================
   二重螺旋
========================= */

function spiralPattern() {

    let count = 0;

    const timer = setInterval(() => {

        const a = count * 0.25;

        bullets.push(
            new Bullet(
                enemy.x,
                enemy.y,
                Math.cos(a) * 4,
                Math.sin(a) * 4,
                "spiral"
            )
        );

        bullets.push(
            new Bullet(
                enemy.x,
                enemy.y,
                Math.cos(a + Math.PI) * 4,
                Math.sin(a + Math.PI) * 4,
                "spiral"
            )
        );

        count++;

        if (count > 120) {
            clearInterval(timer);
        }

    }, 20);
}
/* =========================
   分裂弾
========================= */

function explodePattern() {

    for (let i = 0; i < 3; i++) {

        setTimeout(() => {

            const v =
                aimedVector(4);

            bullets.push(
                new Bullet(
                    enemy.x,
                    enemy.y,
                    v.vx,
                    v.vy,
                    "explode"
                )
            );

        }, i * 250);

    }
}

/* =========================
   跳弾
========================= */

function bouncePattern() {

    for (let i = 0; i < 3; i++) {

        setTimeout(() => {

            const center =
                Math.atan2(
                    player.y - enemy.y,
                    player.x - enemy.x
                );

            for (
                let j = -3;
                j <= 2;
                j++
            ) {

                const angle =
                    center +
                    j * 0.22;

                bullets.push(
                    new Bullet(
                        enemy.x,
                        enemy.y,
                        Math.cos(angle) * 5,
                        Math.sin(angle) * 5,
                        "bounce"
                    )
                );
            }

        }, i * 250);

    }
}

/* =========================
   左右整列
========================= */

function sideWallPattern() {

    const count = 25;

    for (let i = 0; i < count; i++) {

        const y =
            80 + i * 20;

        bullets.push(
            new Bullet(
                enemy.x,
                y,
                -5,
                0,
                "wallLeft"
            )
        );

        bullets.push(
            new Bullet(
                enemy.x,
                y,
                5,
                0,
                "wallRight"
            )
        );
    }

    setTimeout(
        fireWallBullets,
        2500
    );
}

/* =========================
   左右整列後発射
========================= */

function fireWallBullets() {

    const wallBullets =
        bullets.filter(
            b =>
                b.type === "wallLeft" ||
                b.type === "wallRight"
        );

    wallBullets.forEach(
        (b, index) => {

            setTimeout(() => {

                const dx =
                    player.x - b.x;

                const dy =
                    player.y - b.y;

                const len =
                    Math.hypot(dx, dy);

                b.vx =
                    dx / len * 6;

                b.vy =
                    dy / len * 6;

                b.state = "fire";

            }, index * 40);

        }
    );
}

/* =========================
   追尾5連＋円形
========================= */

function patternA() {

    aimed5();

    setTimeout(
        circleSpread,
        300
    );
}

/* =========================
   追尾5連＋花
========================= */

function patternB() {

    aimed5();

    setTimeout(
        flowerPattern,
        300
    );
}

/* =========================
   追尾5連＋螺旋
========================= */

function patternC() {

    aimed5();

    setTimeout(
        spiralPattern,
        300
    );
}

/* =========================
   攻撃ローテ
========================= */

function attackControl() {

    const t =
        frame % 3600;

    if (t === 0) {

        patternA();
    }

    if (t === 500) {

        patternB();
    }

    if (t === 1000) {

        patternC();
    }

    if (t === 1500) {

        explodePattern();
    }

    if (t === 2000) {

        bouncePattern();
    }

    if (t === 2500) {

        aimed25();
    }

    if (t === 3000) {

        sideWallPattern();
    }
}
