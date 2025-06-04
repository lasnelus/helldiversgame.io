const cube = document.getElementById('cube');
const gameArea = document.getElementById('gameArea');

const rect = gameArea.getBoundingClientRect();
let cubeState = {
    x: rect.width / 2,
    y: rect.height / 2,
    size: 50,
    angle: 0
};

let isFiring = false;
let autoFireInterval = null;
let isReloading = false;
let lastMouseX = cubeState.x;
let lastMouseY = cubeState.y;
let currentWeapon = weapons.smg;
let lastShotTime = 0;
let currentAmmo = currentWeapon.magazineSize;


function updateCube() {
    const scaleY = cubeState.reflected ? -1 : 1;
    cube.style.left = `${cubeState.x}px`;
    cube.style.top = `${cubeState.y}px`;
    cube.style.transform = `translate(-50%, -50%) rotate(${cubeState.angle}rad) scaleY(${scaleY})`;
}

function setCubeTexture(url) {
    cube.style.backgroundImage = `url('${url}')`;
    cube.style.backgroundSize = 'cover';
}

gameArea.addEventListener('mousemove', function (e) {
    const rect = gameArea.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    lastMouseX = mouseX;
    lastMouseY = mouseY;

    cubeState.angle = Math.atan2(mouseY - cubeState.y, mouseX - cubeState.x);

    // Set reflected state
    cubeState.reflected = mouseX < rect.width / 2;

    updateCube();
});

function fireProjectile(e) {
    if (isReloading) return;
    if (currentAmmo <= 0) {
        reloadWeapon();
        return;
    }
    const now = Date.now();
    if (now - lastShotTime < currentWeapon.fireRate) return;
    lastShotTime = now;

    // Set firing sprite WITH fire effect
    setCubeTexture('assets/character_fireing.png');

    // Revert to firing sprite WITHOUT fire effect after a short delay
    setTimeout(() => {
        // Only revert if still firing and not reloading
        if (!isReloading && isFiring) {
            setCubeTexture('assets/character_fireing_cooldown.png');
        }
    }, Math.max(60, currentWeapon.fireRate * 0.5)); // 60ms minimum, or half fireRate

    const rect = gameArea.getBoundingClientRect();
    let mouseX = e ? e.clientX - rect.left : lastMouseX;
    let mouseY = e ? e.clientY - rect.top : lastMouseY;

    const dx = mouseX - cubeState.x;
    const dy = mouseY - cubeState.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const speed = 8;

    if (length === 0) return;

    projectiles.push({
        x: cubeState.x,
        y: cubeState.y,
        vx: (dx / length) * speed,
        vy: (dy / length) * speed,
        damage: currentWeapon.damage,
        class: currentWeapon.class
    });
    currentAmmo--;
    updateATH();
}

function updateATH() {
    document.getElementById('ammoDisplay').textContent = `${currentAmmo} / ${currentWeapon.magazineSize}`;
    document.getElementById('weaponImg').src = currentWeapon.image;

    // Barres graphiques
    const hpPercent = Math.max(0, Math.min(100, 100 * player.Hp / player.maxHp));
    const staminaPercent = Math.max(0, Math.min(100, 100 * player.stamina / player.maxStamina));
    document.getElementById('hpBar').style.width = hpPercent + "%";
    document.getElementById('staminaBar').style.width = staminaPercent + "%";
}

function reloadWeapon() {
    if (isReloading || currentAmmo === currentWeapon.magazineSize) return;
    isReloading = true;
    setCubeTexture('assets/character_reload.png'); // Optional: add a reload sprite
    setTimeout(() => {
        currentAmmo = currentWeapon.magazineSize;
        isReloading = false;
        setCubeTexture('assets/character_non_fireing.png');
        updateATH();
    }, currentWeapon.reloadTime);
}

// Left click: single fire + full auto while held
gameArea.addEventListener('mousedown', function (e) {
    if (e.button === 0) {
        isFiring = true;
        setCubeTexture('assets/character_fireing.png');
        fireProjectile(e); // Fire once immediately
        if (!autoFireInterval) {
            autoFireInterval = setInterval(() => {
                fireProjectile(); // Use last known mouse position
            }, 10); // Fast interval, let cooldown handle fire rate
        }
    }
});
// reload
document.addEventListener('keydown', function (e) {
    if (e.key === 'r' || e.key === 'R') {
        reloadWeapon();
    }
});

// Example: switch to SMG on key '2'
document.addEventListener('keydown', function (e) {
    if (e.key === '1') {
        currentWeapon = weapons.handgun;
        currentAmmo = currentWeapon.magazineSize;
        updateATH();
    }
    if (e.key === '2') {
        currentWeapon = weapons.smg;
        currentAmmo = currentWeapon.magazineSize;
        updateATH();
    }
});

gameArea.addEventListener('contextmenu', function (e) {
    e.preventDefault();
});

gameArea.addEventListener('mouseup', function (e) {
    if (e.button === 0) {
        isFiring = false;
        setCubeTexture('assets/character_non_fireing.png');
        if (autoFireInterval) {
            clearInterval(autoFireInterval);
            autoFireInterval = null;
        }
    }
});

gameArea.addEventListener('mouseleave', function () {
    isFiring = false;
    setCubeTexture('assets/character_non_fireing.png');
    if (autoFireInterval) {
        clearInterval(autoFireInterval);
        autoFireInterval = null;
    }
});

function damagePlayer(amount) {
    player.Hp -= amount;
    if (player.Hp <= 0) {
        player.Hp = 0;
        alert("Game Over !");
        // Tu peux ajouter ici une logique de reset ou de fin de partie
    }
}

// Initial draw
updateCube();
setCubeTexture('assets/character_non_fireing.png');
updateATH();