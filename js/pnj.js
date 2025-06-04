// Types de PNJ possibles
const PNJ_TYPES = {
    merchant: {
        name: "Marchand",
        color: "#3498db",
        img: "assets/pnj_marchand1.png",
        stock: [
            {type: "medkit", price: 10, qty: 3},
            {type: "ammo", price: 5, qty: 5}
        ]
    },
    questGiver: {
        name: "Donneur de quête",
        color: "#f1c40f",
        img: "assets/pnj_quest.png",
        stock: []
    },
    ally: {
        name: "Allié",
        color: "#2ecc71",
        img: "assets/pnj_ally.png",
        stock: []
    },
    merchantQuest: {
        name: "Marchand & Quêtes",
        color: "#9b59b6",
        img: "assets/pnj_marchand2.png",
        stock: [
            {type: "medkit", price: 8, qty: 2},
            {type: "ammo", price: 6, qty: 8},
            {type: "bag", price: 30, qty: 1}
        ]
    }
};

// Tableau global des PNJ
let pnjs = [];

// Fonction pour créer un PNJ
function spawnPNJ(x, y, typeKey) {
    const type = PNJ_TYPES[typeKey] || PNJ_TYPES.merchant;
    const pnjDiv = document.createElement('div');
    pnjDiv.className = 'pnj';
    pnjDiv.style.position = 'absolute';
    pnjDiv.style.width = tileSize + 'px';
    pnjDiv.style.height = tileSize + 'px';
    pnjDiv.style.zIndex = 15;
    pnjDiv.style.background = type.img ? `url('${type.img}') center/cover no-repeat` : type.color;
    pnjDiv.title = type.name;

    document.getElementById('gameArea').appendChild(pnjDiv);

    // Clone le stock pour que chaque PNJ ait son propre stock indépendant
    const pnj = {
        x, y,
        type: typeKey,
        div: pnjDiv,
        interacted: false,
        stock: type.stock ? type.stock.map(item => ({...item})) : []
    };
    pnjs.push(pnj);
}

// Affichage et interaction des PNJ
function updatePNJs() {
    const rect = document.getElementById('gameArea').getBoundingClientRect();
    for (const pnj of pnjs) {
        // Position HTML centrée sur le joueur
        const left = rect.width / 2 + (pnj.x - player.x) * tileSize;
        const top = rect.height / 2 + (pnj.y - player.y) * tileSize;
        pnj.div.style.left = `${left}px`;
        pnj.div.style.top = `${top}px`;

        // Interaction si le joueur est proche et appuie sur E
        const dist = Math.hypot(player.x - pnj.x, player.y - pnj.y);
        if (dist < 1 && !pnj.interacted) {
            pnj.div.style.filter = "brightness(1.3)";
            // Affiche une info-bulle ou un bouton d'interaction
            pnj.div.title = "Appuie sur E pour interagir";
        } else {
            pnj.div.style.filter = "";
            pnj.div.title = PNJ_TYPES[pnj.type].name;
        }
    }
}

// Gestion de l'interaction avec E
document.addEventListener('keydown', function(e) {
    if (e.key === "e" || e.key === "E") {
        for (const pnj of pnjs) {
            const dist = Math.hypot(player.x - pnj.x, player.y - pnj.y);
            if (dist < 1.1) {
                interactWithPNJ(pnj);
                break;
            }
        }
    }
});

// Fonction d'interaction selon le type de PNJ
function interactWithPNJ(pnj) {
    if (pnj.type === "merchant" || pnj.type === "merchantQuest") {
        openShop(pnj);
        return;
    }
    if (pnj.type === "questGiver" || pnj.type === "merchantQuest") {
        // Exemple : donne une quête si pas déjà prise
        if (!quests.some(q => q.id === "kill_grunt")) {
            quests.push({
                id: "kill_grunt",
                title: "Éliminer un grunt",
                description: "Tue 1 grunt.",
                type: "kill",
                target: "grunt",
                required: 1,
                progress: 0,
                completed: false,
                reward: { money: 20, item: "medkit" }
            });
            alert("Nouvelle quête reçue !");
            updateQuestDisplay();
        } else {
            alert("Tu as déjà cette quête !");
        }
        return;
    }
    if (pnj.type === "ally") {
        alert("Allié : Je vais t'aider au combat !");
    }
    checkQuests("talk", { npc: pnj.type });
}

let currentShopPNJ = null;
let shopTab = "buy";

function openShop(pnj) {
    currentShopPNJ = pnj;
    shopTab = "buy";
    document.getElementById('shopOverlay').style.display = 'block';
    updateShopDisplay();
}


function closeShop() {
    document.getElementById('shopOverlay').style.display = 'none';
    currentShopPNJ = null;
}

function setShopTab(tab) {
    shopTab = tab;
    updateShopDisplay();
}

function updateShopDisplay() {
    if (!currentShopPNJ) return;
    const stockDiv = document.getElementById('shopStock');
    stockDiv.innerHTML = `
        <div style="display:flex;gap:12px;margin-bottom:12px;">
            <button onclick="setShopTab('buy')" style="padding:4px 16px;${shopTab === 'buy' ? 'background:#444;color:#fff;' : ''}">Acheter</button>
            <button onclick="setShopTab('sell')" style="padding:4px 16px;${shopTab === 'sell' ? 'background:#444;color:#fff;' : ''}">Vendre</button>
        </div>
    `;

    if (shopTab === "buy") {
        for (let i = 0; i < currentShopPNJ.stock.length; i++) {
            const item = currentShopPNJ.stock[i];
            const div = document.createElement('div');
            div.style.display = "flex";
            div.style.alignItems = "center";
            div.style.justifyContent = "space-between";
            div.style.marginBottom = "6px";
            div.innerHTML = `
                <span>${item.type} (${item.qty}) - <b>${item.price}💰</b></span>
                <button onclick="buyFromShop(${i})">Acheter</button>
            `;
            stockDiv.appendChild(div);
        }
    } else if (shopTab === "sell") {
        if (inventory.items.length === 0) {
            const empty = document.createElement('div');
            empty.textContent = "Aucun objet à vendre.";
            stockDiv.appendChild(empty);
        } else {
            inventory.items.forEach((item, idx) => {
                const div = document.createElement('div');
                div.style.display = "flex";
                div.style.alignItems = "center";
                div.style.justifyContent = "space-between";
                div.style.marginBottom = "4px";
                div.innerHTML = `
                    <span>${item.type}</span>
                    <button onclick="sellToShop(${idx})">Vendre (+5💰)</button>
                `;
                stockDiv.appendChild(div);
            });
        }
    }
    document.getElementById('playerMoney').textContent = player.money + "💰";
}

window.buyFromShop = function(idx) {
    const item = currentShopPNJ.stock[idx];
    if (item.qty <= 0) return alert("Rupture de stock !");
    if (player.money < item.price) return alert("Pas assez d'argent !");
    if (inventory.items.length >= inventory.slots) return alert("Inventaire plein !");
    player.money -= item.price;
    item.qty--;
    inventory.items.push({type: item.type});
    updateShopDisplay();
    if (typeof updateInventoryDisplay === "function") updateInventoryDisplay();
};

window.sellToShop = function(idx) {
    const item = inventory.items[idx];
    player.money += 5; // prix fixe pour la vente
    inventory.items.splice(idx, 1);
    updateShopDisplay();
    if (typeof updateInventoryDisplay === "function") updateInventoryDisplay();
};

spawnPNJ(12, 8, "merchant");
spawnPNJ(15, 10, "questGiver");
spawnPNJ(18, 12, "ally");
spawnPNJ(20, 14, "merchantQuest");

