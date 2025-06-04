const ENEMY_TYPES = {
    grunt: {
        hp: 15,
        maxHp: 15,
        damage: 1,
        fireRate: 90,
        lootTable: ['medkit', 'ammo'],
        color: 'red',
        img: 'assets/grunt_non_fireing.png'    // <-- Add your PNG path here
    },
    tank: {
        hp: 20,
        maxHp: 20,
        damage: 4,
        fireRate: 150,
        lootTable: ['ammo'],
        color: 'darkred',
        img: 'assets/tank_non_fireing.png'
    },
    fast: {
        hp: 3,
        maxHp: 3,
        damage: 1,
        fireRate: 60,
        lootTable: ['medkit'],
        color: 'orange',
        img: 'assets/fast_non_fireing.png'
    }
    // Add more types as needed
};

const LOOT_IMAGES = {
    medkit: 'assets/medkit.png',
    ammo: 'assets/ammo.png'
    // Ajoute d'autres types si besoin
};

// Tableau global des ennemis
let enemies = [];
let loots = [];
// Création d'un ennemi HTML
function spawnEnemy(x, y, typeOrOptions = "grunt") {
    let options = {};
    if (typeof typeOrOptions === "string") {
        options = { ...ENEMY_TYPES[typeOrOptions] };
    } else {
        options = { ...typeOrOptions };
    }

    const enemyDiv = document.createElement('div');
    enemyDiv.className = 'enemy';
    enemyDiv.style.position = 'absolute';
    enemyDiv.style.zIndex = 10;
    enemyDiv.style.pointerEvents = 'none';
    enemyDiv.style.width = tileSize + 'px';
    enemyDiv.style.height = tileSize + 'px';

    // Set PNG as background image (preferred for easy scaling)
    if (options.img) {
        enemyDiv.style.background = `url('${options.img}') center/cover no-repeat`;
    } else {
        enemyDiv.style.background = options.color || 'red';
    }

    document.getElementById('gameArea').appendChild(enemyDiv);

    enemies.push({
        x, y,
        vx: 0, vy: 0,
        hp: options.hp || 5,
        maxHp: options.maxHp || options.hp || 5,
        damage: options.damage || 1,
        fireCooldown: 0,
        fireRate: options.fireRate || 90,
        lootTable: options.lootTable || ['medkit', 'ammo'],
        alive: true,
        div: enemyDiv,
        static: options.static || false
    });
}


function updateEnemies() {
    const rect = document.getElementById('gameArea').getBoundingClientRect();
    for (const enemy of enemies) {
        if (!enemy.alive) {
            if (enemy.div) enemy.div.style.display = 'none';
            continue;
        }

        // --- Déplacement logique sur la map ---
        if (!enemy.static) { // <-- Ajout ici
            let dx = player.x - enemy.x;
            let dy = player.y - enemy.y;
            let dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > 0.1) {
                dx /= dist; dy /= dist;
                let nextX = enemy.x + dx * 0.2;
                let nextY = enemy.y + dy * 0.2;

                // Déplacement sur X
                if (
                    nextX >= 0 && nextX < mapWidth &&
                    gameMap[Math.floor(enemy.y)][Math.floor(nextX)] !== 1
                ) {
                    enemy.x = nextX;
                }
                // Déplacement sur Y
                if (
                    nextY >= 0 && nextY < mapHeight &&
                    gameMap[Math.floor(nextY)][Math.floor(enemy.x)] !== 1
                ) {
                    enemy.y = nextY;
                }
            }
        }

        // --- Position HTML calculée par rapport au joueur centré ---
        const left = rect.width / 2 + (enemy.x - player.x) * tileSize;
        const top = rect.height / 2 + (enemy.y - player.y) * tileSize;
        enemy.div.style.left = `${left}px`;
        enemy.div.style.top = `${top}px`;
        enemy.div.style.width = tileSize + "px";
        enemy.div.style.height = tileSize + "px";

        // Affichage de la barre de vie
        enemy.div.innerHTML = `
    <div style="position:absolute;left:0;top:-10px;width:100%;height:6px;background:black;">
        <div style="
            width:100%;
            height:100%;
            position:relative;
        ">
            <div style="
                height:100%;
                background:lime;
                width:${Math.max(0, Math.min(100, 100 * enemy.hp / enemy.maxHp))}%;
                transition:width 0.2s;
                position:absolute;
                left:0;top:0;
            "></div>
        </div>
    </div>`;
    }
}

// Tir d'un projectile ennemi vers le joueur
function fireEnemyProjectile(enemy) {
    let dx = player.x - enemy.x;
    let dy = player.y - enemy.y;
    let dist = Math.sqrt(dx * dx + dy * dy);
    if (dist === 0) return;
    let speed = 0.18;
    // Ajoute un projectile au système global (doit être géré dans updateProjectiles côté player.js)
    projectiles.push({
        x: enemy.x * tileSize,
        y: enemy.y * tileSize,
        vx: (dx / dist) * speed * tileSize,
        vy: (dy / dist) * speed * tileSize,
        fromEnemy: true,
        damage: enemy.damage
    });
}

// Gestion des dégâts et loot
function damageEnemy(enemy, amount) {
    enemy.hp -= amount;

    // Add blinking effect
    if (enemy.div) {
        enemy.div.classList.add('hit');
        setTimeout(() => {
            if (enemy.div) enemy.div.classList.remove('hit');
        }, 400); // Duration matches the animation (0.2s * 2)
    }

    if (enemy.hp <= 0) {
        enemy.alive = false;
        dropLoot(enemy);
        if (enemy.div) enemy.div.style.display = 'none';
    }
}

function dropLoot(enemy) {
    const lootType = enemy.lootTable[Math.floor(Math.random() * enemy.lootTable.length)];
    // Position du loot = position de l'ennemi
    const loot = {
        x: enemy.x,
        y: enemy.y,
        type: lootType,
        div: null,
        picked: false
    };

    // Création de l'élément HTML
    const lootDiv = document.createElement('div');
    lootDiv.className = 'loot';
    lootDiv.dataset.type = lootType;
    lootDiv.style.position = 'absolute';
    lootDiv.style.width = tileSize * 0.6 + 'px';
    lootDiv.style.height = tileSize * 0.6 + 'px';
    lootDiv.style.transform = 'translate(-50%, -50%)';
    lootDiv.style.zIndex = 20;
    lootDiv.style.background = 'none';

    // Ajoute l'image correspondante
    const img = document.createElement('img');
    img.src = LOOT_IMAGES[lootType] || 'assets/loot_default.png';
    img.alt = lootType;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.pointerEvents = 'none';
    lootDiv.appendChild(img);

    loot.div = lootDiv;
    document.getElementById('gameArea').appendChild(lootDiv);

    loots.push(loot);
}


function updateLoots() {
    const rect = document.getElementById('gameArea').getBoundingClientRect();
    for (const loot of loots) {
        if (loot.picked) continue;

        // Position HTML centrée sur le joueur
        const left = rect.width / 2 + (loot.x - player.x) * tileSize;
        const top = rect.height / 2 + (loot.y - player.y) * tileSize;
        loot.div.style.left = `${left}px`;
        loot.div.style.top = `${top}px`;

        // Ramassage par collision (distance < 0.6 case)
        const dist = Math.hypot(player.x - loot.x, player.y - loot.y);
        if (dist < 0.6) {
            if (loot.type === 'medkit') {
                player.hp = Math.min(player.maxHp, player.hp + 10);
            }
            if (loot.type === 'ammo') {
                // Ajoute des munitions ici
            }
            loot.picked = true;
            loot.div.remove();
        }
    }
    // Nettoyage des loots ramassés
    loots = loots.filter(l => !l.picked);
}

window.enemies = enemies;
window.damageEnemy = damageEnemy;