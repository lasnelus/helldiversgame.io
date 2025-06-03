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
    y: Math.floor(mapHeight / 2)
};

spawnEnemy(player.x + 3, player.y + 2, { hp: 10, damage: 2, fireRate: 60 });
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
}

// --- Déplacement ZQSD avec collision murs ---
document.addEventListener('keydown', function(e) {
    let moved = false;
    if ((e.key === "z" || e.key === "Z") && player.y > 0 && gameMap[player.y - 1][player.x] !== 1) {
        player.y--; moved = true;
    }
    if ((e.key === "s" || e.key === "S") && player.y < mapHeight - 1 && gameMap[player.y + 1][player.x] !== 1) {
        player.y++; moved = true;
    }
    if ((e.key === "q" || e.key === "Q") && player.x > 0 && gameMap[player.y][player.x - 1] !== 1) {
        player.x--; moved = true;
    }
    if ((e.key === "d" || e.key === "D") && player.x < mapWidth - 1 && gameMap[player.y][player.x + 1] !== 1) {
        player.x++; moved = true;
    }
    if (moved) {
        drawMap();
    }
});
// --- Boucle d'affichage ---
function gameLoop() {
    updateEnemies();
    drawMap();
    requestAnimationFrame(gameLoop);
}
gameLoop();