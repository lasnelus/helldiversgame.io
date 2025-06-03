// Tableau global des ennemis
let enemies = [];

// Création d'un ennemi HTML
function spawnEnemy(x, y, options = {}) {
    const enemyDiv = document.createElement('div');
    enemyDiv.className = 'enemy';
    enemyDiv.style.position = 'absolute';
    enemyDiv.style.background = 'red';
    enemyDiv.style.borderRadius = '50%';
    enemyDiv.style.zIndex = 10;
    enemyDiv.style.pointerEvents = 'none';
    enemyDiv.style.width = tileSize + 'px';
    enemyDiv.style.height = tileSize + 'px';
    document.getElementById('gameArea').appendChild(enemyDiv);

    enemies.push({
        x, y,
        vx: 0, vy: 0,
        hp: options.hp || 5,
        maxHp: options.hp || 5,
        damage: options.damage || 1,
        fireCooldown: 0,
        fireRate: options.fireRate || 90, // frames entre tirs
        lootTable: options.lootTable || ['medkit', 'ammo'],
        alive: true,
        div: enemyDiv
    });
}

// Mise à jour des ennemis (déplacement, tir, position HTML)
function updateEnemies() {
    const rect = document.getElementById('gameArea').getBoundingClientRect();
    for (const enemy of enemies) {
        if (!enemy.alive) {
            if (enemy.div) enemy.div.style.display = 'none';
            continue;
        }

        // Déplacement vers le joueur
        let dx = player.x - enemy.x;
        let dy = player.y - enemy.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 0.1) {
            dx /= dist; dy /= dist;
            let nextX = enemy.x + dx * 0.2;
            let nextY = enemy.y + dy * 0.2;

            let moved = false;
            // Essaye X d'abord
            if (
                nextX >= 0 && nextX < mapWidth &&
                gameMap[Math.floor(enemy.y)][Math.floor(nextX)] !== 1
            ) {
                enemy.x = nextX;
                moved = true;
            }
            // Sinon essaye Y
            if (
                !moved &&
                nextY >= 0 && nextY < mapHeight &&
                gameMap[Math.floor(nextY)][Math.floor(enemy.x)] !== 1
            ) {
                enemy.y = nextY;
            }
        }
        // Tir automatique
        if (enemy.fireCooldown > 0) {
            enemy.fireCooldown--;
        } else {
            fireEnemyProjectile(enemy);
            enemy.fireCooldown = enemy.fireRate;
        }

        // Mise à jour position HTML (centré sur la caméra)
        const left = rect.width / 2 + (enemy.x - player.x) * tileSize;
        const top = rect.height / 2 + (enemy.y - player.y) * tileSize;
        enemy.div.style.left = `${left}px`;
        enemy.div.style.top = `${top}px`;
        enemy.div.style.width = tileSize + "px";
        enemy.div.style.height = tileSize + "px";
        enemy.div.style.transform = 'translate(-50%, -50%)';

        // Affichage de la barre de vie
        enemy.div.innerHTML = `<div style="position:absolute;left:0;top:-10px;width:100%;height:6px;background:black;">
            <div style="width:${100 * enemy.hp / enemy.maxHp}%;height:100%;background:lime;"></div>
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
    if (enemy.hp <= 0) {
        enemy.alive = false;
        dropLoot(enemy);
        if (enemy.div) enemy.div.style.display = 'none';
    }
}

function dropLoot(enemy) {
    // Exemple simple : loot aléatoire
    const loot = enemy.lootTable[Math.floor(Math.random() * enemy.lootTable.length)];
    // À toi d'ajouter le loot sur la map ou dans l'inventaire du joueur
    console.log("Loot dropped:", loot, "at", enemy.x, enemy.y);
}
