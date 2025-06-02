const weapons = {
    handgun: {
        name: "Handgun",
        damage: 12,
        fireRate: 400,         // ms between shots
        price: 100,
        rarity: "common",
        class: "handgun",
        magazineSize: 12,
        ammo: 60,              // total reserve ammo
        reloadTime: 1200,      // ms
        image: "assets/handgun.png"
    },
    smg: {
        name: "SMG",
        damage: 7,
        fireRate: 100,
        price: 350,
        rarity: "uncommon",
        class: "smg",
        magazineSize: 30,
        ammo: 180,
        reloadTime: 1600,
        image: "assets/smg.png"
    },
    lmg: {
        name: "LMG",
        damage: 10,
        fireRate: 180,
        price: 600,
        rarity: "rare",
        class: "lmg",
        magazineSize: 60,
        ammo: 240,
        reloadTime: 2500,
        image: "assets/lmg.png"
    },
    shotgun: {
        name: "Shotgun",
        damage: 30,
        fireRate: 900,
        price: 500,
        rarity: "rare",
        class: "shotgun",
        magazineSize: 6,
        ammo: 36,
        reloadTime: 2200,
        image: "assets/shotgun.png"
    },
    sniper: {
        name: "Sniper Rifle",
        damage: 60,
        fireRate: 1200,
        price: 1200,
        rarity: "epic",
        class: "sniper",
        magazineSize: 5,
        ammo: 25,
        reloadTime: 3000,
        image: "assets/sniper.png"
    },
    melee: {
        name: "Sword",
        damage: 35,
        fireRate: 700,
        price: 50,
        rarity: "common",
        class: "melee",
        magazineSize: 1,
        ammo: Infinity,
        reloadTime: 0,
        image: "assets/sword.png"
    }
};

const rarityTiers = [
    { name: "common",      multiplier: 1,    color: "#bbb" },
    { name: "uncommon",    multiplier: 1.15, color: "#4caf50" },
    { name: "rare",        multiplier: 1.3,  color: "#2196f3" },
    { name: "epic",        multiplier: 1.5,  color: "#9c27b0" },
    { name: "legendary",   multiplier: 1.8,  color: "#ff9800" }
];

const weaponTypes = [
    weapons.handgun,
    weapons.smg,
    weapons.lmg,
    weapons.shotgun,
    weapons.sniper,
    weapons.melee
];

// Génère une arme aléatoire
function generateRandomWeapon() {
    // Choix du type d'arme
    const baseWeapon = weaponTypes[Math.floor(Math.random() * weaponTypes.length)];

    // Choix de la rareté
    const rarityIndex = Math.floor(Math.random() * rarityTiers.length);
    const rarity = rarityTiers[rarityIndex];

    // Application des variations de stats
    function scale(stat, min=0.9, max=1.1) {
        // Variation aléatoire autour de la valeur de base
        const rand = min + Math.random() * (max - min);
        return Math.round(stat * rand * rarity.multiplier);
    }

    // Création de l'arme générée
    return {
        name: `${rarity.name.charAt(0).toUpperCase() + rarity.name.slice(1)} ${baseWeapon.name}`,
        damage: scale(baseWeapon.damage, 0.95, 1.1),
        fireRate: Math.round(baseWeapon.fireRate / (0.95 + Math.random() * 0.2) / rarity.multiplier), // plus rare = plus rapide
        price: Math.round(baseWeapon.price * rarity.multiplier),
        rarity: rarity.name,
        rarityColor: rarity.color,
        class: baseWeapon.class,
        magazineSize: scale(baseWeapon.magazineSize, 0.95, 1.1),
        ammo: scale(baseWeapon.ammo, 0.95, 1.1),
        reloadTime: Math.round(baseWeapon.reloadTime / rarity.multiplier),
        image: baseWeapon.image
    };
}

// Exemple d'utilisation :
const randomWeapon = generateRandomWeapon();
console.log(randomWeapon);