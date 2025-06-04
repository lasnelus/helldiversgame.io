let isPaused = false;

document.addEventListener('keydown', function(e) {
    if (e.key === "Escape") {
        // Si l'inventaire est ouvert, on le ferme
        if (inventoryOpen) {
            inventoryOpen = false;
            document.getElementById('inventoryOverlay').style.display = 'none';
            return;
        }
        // Si la boutique PNJ est ouverte, on la ferme
        if (document.getElementById('shopOverlay').style.display === 'block') {
            closeShop();
            return;
        }
        // Sinon, on gère la pause
        isPaused = !isPaused;
        document.getElementById('pauseOverlay').style.display = isPaused ? 'flex' : 'none';
    }
});

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
//inventaire

let inventoryOpen = false;
document.addEventListener('keydown', function(e) {
    if (e.key === "Tab") {
        e.preventDefault();
        inventoryOpen = !inventoryOpen;
        document.getElementById('inventoryOverlay').style.display = inventoryOpen ? 'block' : 'none';
        if (inventoryOpen) updateInventoryDisplay();
    }
    // ... (garde le code pause/escape déjà présent)
});

// --- Gestion des touches maintenues ---
document.addEventListener('keydown', function (e) {
    // On ne permet d'activer le sprint que si on a de l'endurance
    if (e.key === "Shift" && player.stamina > 0) player.isSprinting = true;
    if (e.key === "z" || e.key === "Z" || e.key === "ArrowUp") player.moveUp = true;
    if (e.key === "s" || e.key === "S" || e.key === "ArrowDown") player.moveDown = true;
    if (e.key === "q" || e.key === "Q" || e.key === "ArrowLeft") player.moveLeft = true;
    if (e.key === "d" || e.key === "D" || e.key === "ArrowRight") player.moveRight = true;
});
document.addEventListener('keyup', function (e) {
    if (e.key === "Shift") player.isSprinting = false;
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

    // Sprint si possible
    let moveSpeed = player.speed;
    if (player.isSprinting && player.stamina > 0 && (dx !== 0 || dy !== 0)) {
        moveSpeed = player.sprintSpeed;
        player.stamina -= 0.7;
        if (player.stamina < 0) player.stamina = 0;
        // Reset le timer de regen à chaque frame de sprint
        player.staminaRegenTimer = Date.now() + player.staminaRegenDelay;
        if (player.stamina === 0) player.isSprinting = false;
    } else {
        // Régénération seulement si le délai est passé
        if (player.stamina < player.maxStamina && Date.now() > player.staminaRegenTimer) {
            player.stamina += player.staminaRegen;
            if (player.stamina > player.maxStamina) player.stamina = player.maxStamina;
        }
        if (player.stamina === 0) player.isSprinting = false;
    }

    let nextX = player.x + dx * moveSpeed;
    let nextY = player.y + dy * moveSpeed;

    // Collision horizontale
    if (
        nextX > 0 && nextX < mapWidth - 1 &&
        gameMap[Math.floor(player.y)][Math.floor(nextX)] !== 1 &&
        gameMap[Math.floor(player.y)][Math.ceil(nextX)] !== 1
    ) {
        player.x = nextX;
    }
    // Collision verticale
    if (
        nextY > 0 && nextY < mapHeight - 1 &&
        gameMap[Math.floor(nextY)][Math.floor(player.x)] !== 1 &&
        gameMap[Math.ceil(nextY)][Math.floor(player.x)] !== 1
    ) {
        player.y = nextY;
    }
}


function updateInventoryDisplay() {
    const slotsDiv = document.getElementById('inventorySlots');
    slotsDiv.innerHTML = '';
    for (let i = 0; i < inventory.slots; i++) {
        const slot = document.createElement('div');
        slot.style.width = "48px";
        slot.style.height = "48px";
        slot.style.background = "#222";
        slot.style.border = "2px solid #444";
        slot.style.borderRadius = "8px";
        slot.style.display = "flex";
        slot.style.alignItems = "center";
        slot.style.justifyContent = "center";
        slot.style.fontSize = "2em";
        slot.style.position = "relative";
        if (inventory.items[i]) {
            const item = inventory.items[i];
            const img = document.createElement('img');
            img.src = LOOT_IMAGES[item.type] || 'assets/loot_default.png';
            img.style.width = "80%";
            img.style.height = "80%";
            img.title = item.type;
            slot.appendChild(img);
        }
        slotsDiv.appendChild(slot);
    }
    document.getElementById('inventoryInfo').textContent =
        `Emplacements utilisés : ${inventory.items.length} / ${inventory.slots}`;
}

function updateQuestDisplay() {
    const overlay = document.getElementById('questOverlay');
    const list = document.getElementById('questList');
    if (!quests.length) {
        overlay.style.display = "none";
        return;
    }
    overlay.style.display = "block";
    list.innerHTML = "";
    for (const quest of quests) {
        const div = document.createElement('div');
        div.style.marginBottom = "8px";
        div.style.color = quest.completed ? "#7fff7f" : "#fff";
        div.innerHTML = `<b>${quest.title}</b><br>
            <span style="font-size:0.95em;">${quest.description}</span><br>
            <span style="font-size:0.9em;">Progression : ${quest.progress} / ${quest.required}</span>
            ${quest.completed ? "<br><i>Terminé !</i>" : ""}`;
        list.appendChild(div);
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

spawnEnemy(10, 10, { ...ENEMY_TYPES.grunt, static: true });
spawnEnemy(9, 10, { ...ENEMY_TYPES.tank, static: true });
spawnEnemy(8, 10, { ...ENEMY_TYPES.fast, static: true });
function gameLoop() {
    if (!isPaused) {
        updateATH();
        updatePlayerMovement();
        updatePNJs();
        updateEnemies();
        updateLoots();
        updateProjectiles();
        drawMap();
    }
    requestAnimationFrame(gameLoop);
}
gameLoop();