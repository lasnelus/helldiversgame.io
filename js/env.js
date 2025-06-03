// --- Paramètres de la map ---
const mapWidth = 40;
const mapHeight = 40;
const tileSize = 50; // Taille en pixels (doit être la même que le #cube)
let projectiles = [];

const textures = {
    0: new Image(),
};
textures[0].src = 'assets/metal_ground.png';

// --- Génération d'une map simple (0 = sol, 1 = mur) ---
function generateMap() {
    const map = [];
    for (let y = 0; y < mapHeight; y++) {
        const row = [];
        for (let x = 0; x < mapWidth; x++) {
            // Bordures en mur, intérieur en sol
            if (x === 0 || y === 0 || x === mapWidth - 1 || y === mapHeight - 1) row.push(1);
            else row.push(0);
        }
        map.push(row);
    }
    return map;
}
const gameMap = generateMap();

// --- Joueur logique (centré au départ) ---
let player = {
    x: Math.floor(mapWidth / 2),
    y: Math.floor(mapHeight / 2),
    vx: 0,
    vy: 0,
    speed: 0.05, // Vitesse en cases par frame
    moveUp: false,
    moveDown: false,
    moveLeft: false,
    moveRight: false
};

spawnEnemy(10, 10, { ...ENEMY_TYPES.grunt, static: true });
spawnEnemy(9, 10, { ...ENEMY_TYPES.tank, static: true });
spawnEnemy(8, 10, { ...ENEMY_TYPES.fast, static: true });
// --- Canvas ---
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();
// --- Dessin de la map centrée sur le joueur ---
function drawMap() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const offsetX = Math.floor(canvas.width / 2 - tileSize / 2 - player.x * tileSize);
    const offsetY = Math.floor(canvas.height / 2 - tileSize / 2 - player.y * tileSize);

    for (let y = 0; y < mapHeight; y++) {
        for (let x = 0; x < mapWidth; x++) {
            let tile = gameMap[y][x];
            let px = x * tileSize + offsetX;
            let py = y * tileSize + offsetY;
            let img = textures[tile];
            if (img && img.complete) {
                ctx.drawImage(img, px, py, tileSize, tileSize);
            } else {
                // fallback color if image not loaded
                ctx.fillStyle = tile === 1 ? "#444" : "#ccc";
                ctx.fillRect(px, py, tileSize, tileSize);
            }
        }
    }
    document.getElementById('playerHp').textContent = "Vie : " + playerHp;
}

// --- Gestion des touches maintenues ---
document.addEventListener('keydown', function (e) {
    if (e.key === "z" || e.key === "Z" || e.key === "ArrowUp") player.moveUp = true;
    if (e.key === "s" || e.key === "S" || e.key === "ArrowDown") player.moveDown = true;
    if (e.key === "q" || e.key === "Q" || e.key === "ArrowLeft") player.moveLeft = true;
    if (e.key === "d" || e.key === "D" || e.key === "ArrowRight") player.moveRight = true;
});
document.addEventListener('keyup', function (e) {
    if (e.key === "z" || e.key === "Z" || e.key === "ArrowUp") player.moveUp = false;
    if (e.key === "s" || e.key === "S" || e.key === "ArrowDown") player.moveDown = false;
    if (e.key === "q" || e.key === "Q" || e.key === "ArrowLeft") player.moveLeft = false;
    if (e.key === "d" || e.key === "D" || e.key === "ArrowRight") player.moveRight = false;
});

// --- Fonction de déplacement fluide ---
function updatePlayerMovement() {
    let dx = 0, dy = 0;
    if (player.moveUp) dy -= 1;
    if (player.moveDown) dy += 1;
    if (player.moveLeft) dx -= 1;
    if (player.moveRight) dx += 1;

    // Normalisation pour diagonale
    if (dx !== 0 && dy !== 0) {
        dx *= Math.SQRT1_2;
        dy *= Math.SQRT1_2;
    }

    // Collision murs (on vérifie la prochaine case)
    let nextX = player.x + dx * player.speed;
    let nextY = player.y + dy * player.speed;

    // Collision horizontale
    if (
        nextX >= 0 && nextX < mapWidth &&
        gameMap[Math.floor(player.y)][Math.floor(nextX)] !== 1
    ) {
        player.x = nextX;
    }
    // Collision verticale
    if (
        nextY >= 0 && nextY < mapHeight &&
        gameMap[Math.floor(nextY)][Math.floor(player.x)] !== 1
    ) {
        player.y = nextY;
    }
}

function updateProjectiles() {
    const rect = gameArea.getBoundingClientRect();

    // Supprime tous les anciens divs projectiles
    document.querySelectorAll('.projectile').forEach(el => el.remove());

    // Met à jour et affiche les projectiles
    projectiles = projectiles.filter(p => {
        p.x += p.vx;
        p.y += p.vy;

        // Conversion position pixel -> case map
        // Calcule l'offset de la caméra (comme dans drawMap)
        const offsetX = Math.floor(gameArea.offsetWidth / 2 - tileSize / 2 - player.x * tileSize);
        const offsetY = Math.floor(gameArea.offsetHeight / 2 - tileSize / 2 - player.y * tileSize);

        // Position du projectile en coordonnées map
        const mapX = (p.x - offsetX) / tileSize;
        const mapY = (p.y - offsetY) / tileSize;

        const tileX = Math.floor(mapX);
        const tileY = Math.floor(mapY);

        if (
            tileX < 0 || tileX >= mapWidth ||
            tileY < 0 || tileY >= mapHeight ||
            gameMap[tileY][tileX] === 1
        ) {
            return false;
        }

        // Collision avec le joueur (pour les projectiles ennemis)
        if (p.fromEnemy) {
            const dx = (player.x + 0.5) * tileSize - p.x;
            const dy = (player.y + 0.5) * tileSize - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < tileSize / 2) {
                console.log("Projectile hit enemy!");
                window.damageEnemy(enemy, p.damage || 1);
                return false;
            }
        }

        // Collision avec les ennemis (pour les projectiles du joueur)
        if (!p.fromEnemy) {
            for (const enemy of window.enemies) {
                if (!enemy.alive) continue;
                const offsetX = Math.floor(gameArea.offsetWidth / 2 - tileSize / 2 - player.x * tileSize);
                const offsetY = Math.floor(gameArea.offsetHeight / 2 - tileSize / 2 - player.y * tileSize);
                const enemyPx = enemy.x * tileSize + offsetX + tileSize / 2;
                const enemyPy = enemy.y * tileSize + offsetY + tileSize / 2;

                const dx = enemyPx - p.x;
                const dy = enemyPy - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < tileSize / 2) {
                    window.damageEnemy(enemy, p.damage || 1);
                    return false;
                }
            }
        }
        // Affichage du projectile
        const proj = document.createElement('div');
        proj.className = 'projectile';
        proj.style.left = `${p.x}px`;
        proj.style.top = `${p.y}px`;
        proj.style.transform = 'translate(-50%, -50%)';
        gameArea.appendChild(proj);

        return true;
    });
}
// --- Boucle d'affichage ---
function gameLoop() {
    updatePlayerMovement();
    updateEnemies();
    updateProjectiles();
    drawMap();
    requestAnimationFrame(gameLoop);
}
gameLoop();