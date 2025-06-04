// --- Paramètres globaux ---
window.mapWidth = 40;
window.mapHeight = 40;
window.tileSize = 50;

window.isPaused = false;
window.projectiles = [];
window.textures = {
    0: new Image(),
};
window.textures[0].src = 'assets/metal_ground.png';

window.gameMap = []; // sera généré plus tard

// Joueur
window.player = {
    x: Math.floor(window.mapWidth / 2),
    y: Math.floor(window.mapHeight / 2),
    vx: 0,
    vy: 0,
    Hp: 100,
    maxHp: 100,
    speed: 0.05,
    sprintSpeed: 0.12,
    stamina: 100,
    maxStamina: 100,
    staminaRegen: 0.12,
    staminaRegenDelay: 1200,
    money: 0,
    moveUp: false,
    moveDown: false,
    moveLeft: false,
    moveRight: false
};

// Inventaire
window.inventory = {
    slots: 8,
    items: []
};

// Projectiles
window.projectiles = [];

// Ennemis et loots
window.enemies = [];
window.loots = [];

// PNJ
window.pnjs = [];

// Quêtes
window.quests = [];

function checkQuests(eventType, eventData) {
    for (const quest of quests) {
        if (quest.completed) continue;

        // Exemple : quête de type "kill"
        if (quest.type === "kill" && eventType === "kill" && eventData.target === quest.target) {
            quest.progress++;
        }

        // Exemple : quête de type "collect"
        if (quest.type === "collect" && eventType === "collect" && eventData.item === quest.target) {
            quest.progress++;
        }

        // Exemple : quête de type "talk"
        if (quest.type === "talk" && eventType === "talk" && eventData.npc === quest.target) {
            quest.progress = 1;
        }

        // Ajoute ici d'autres types de quêtes selon tes besoins

        // Vérifie la complétion
        if (quest.progress >= quest.required) {
            quest.completed = true;
            if (quest.reward) {
                if (quest.reward.money) player.money += quest.reward.money;
                if (quest.reward.item) inventory.items.push({type: quest.reward.item});
            }
            alert(`Quête "${quest.title}" terminée ! Récompense reçue.`);
        }
    }
    if (typeof updateQuestDisplay === "function") updateQuestDisplay();
}