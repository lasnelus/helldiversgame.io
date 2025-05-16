const allSequences = [
    { name: "Supply Pack", seq: ['S', 'Q', 'S', 'Z', 'Z', 'Z', 'S'] },
    { name: "Ballistic Shield Backpack", seq: ['S', 'Q', 'S', 'S', 'Z', 'Q'] },
    { name: "Shield Generator Pack", seq: ['S', 'Z', 'Q', 'D', 'Q', 'D'] },
    { name: "Jump Pack", seq: ['S', 'Z', 'Z', 'S', 'Z'] },
    { name: "'Guard Dog'", seq: ['S', 'Z', 'Q', 'Z', 'D', 'S'] },
    { name: "'Guard Dog' Rover", seq: ['S', 'Z', 'Q', 'Z', 'D', 'D'] },
    { name: "'Guard Dog' Dog Breath", seq: ['S', 'Z', 'Q', 'Z', 'D', 'Z'] },
    { name: "Resupply", seq: ['S', 'S', 'Z', 'D'] },
    { name: "Medical Supplies", seq: ['D'] }, //here
    { name: "Eagle Strafing Run", seq: ['S', 'S', 'Z', 'D'] },

    { name: "Eagle 500kg Bomb", seq: ['S', 'Q', 'S', 'Z', 'Z', 'Z', 'S'] },
    { name: "Eagle 110mm Rocket Pods", seq: ['S', 'Q', 'S', 'S', 'Z', 'Q'] },
    { name: "Eagle Airstrike", seq: ['S', 'Z', 'Q', 'D', 'Q', 'D'] },
    { name: "Eagle Napalm Airstrike", seq: ['S', 'Z', 'Z', 'S', 'Z'] },
    { name: "Eagle Smoke Strike", seq: ['S', 'Z', 'Q', 'Z', 'D', 'S'] },
    { name: "Eagle Cluster Bomb", seq: ['S', 'Z', 'Q', 'Z', 'D', 'D'] },
    { name: "Eagle Rearm", seq: ['S', 'Z', 'Q', 'Z', 'D', 'Z'] },
    { name: "Eagle Air-to-Air Missiles", seq: ['S', 'S', 'Z', 'D'] },
    { name: "FX-12 Shield Generator Relay", seq: ['S', 'S', 'Z', 'D'] },
    { name: "E/MG-101 HMG Emplacement", seq: ['S', 'S', 'Z', 'D'] },

    { name: "MD-6 Anti-Personnel Minefield", seq: ['S', 'Q', 'S', 'Z', 'Z', 'Z', 'S'] },
    { name: "MD-I4 Incendiary Mines", seq: ['S', 'Q', 'S', 'S', 'Z', 'Q'] },
    { name: "MD-17 Anti-tank Mines", seq: ['S', 'Z', 'Q', 'D', 'Q', 'D'] },
    { name: "MD-8 Gas Mines", seq: ['S', 'Z', 'Z', 'S', 'Z'] },
    { name: "A/ARC-3 Tesla Tower", seq: ['S', 'Z', 'Q', 'Z', 'D', 'S'] },
    { name: "SSSD Delivery", seq: ['S', 'Z', 'Q', 'Z', 'D', 'D'] },
    { name: "SSSD Delivery", seq: ['S', 'Z', 'Q', 'Z', 'D', 'Z'] },
    { name: "Drilling Charge", seq: ['S', 'S', 'Z', 'D'] },
    { name: "Extraction Beacon", seq: ['S', 'S', 'Z', 'D'] },
    { name: "Hellbomb", seq: ['S', 'S', 'Z', 'D'] },

    { name: "HIVE BREAKER DRILL", seq: ['S', 'Q', 'S', 'Z', 'Z', 'Z', 'S'] },
    { name: "Spire Sterilizer", seq: ['S', 'Q', 'S', 'S', 'Z', 'Q'] },
    { name: "Super Earth Flag", seq: ['S', 'Z', 'Q', 'D', 'Q', 'D'] },
    { name: "Thumper", seq: ['S', 'Z', 'Z', 'S', 'Z'] },
    { name: "Prospecting Drill", seq: ['S', 'Z', 'Q', 'Z', 'D', 'S'] },
    { name: "Seismic Probe", seq: ['S', 'Z', 'Q', 'Z', 'D', 'D'] },
    { name: "Hive Scanner", seq: ['S', 'Z', 'Q', 'Z', 'D', 'Z'] },
    { name: "Scrambler", seq: ['S', 'S', 'Z', 'D'] },
    { name: "Extraction", seq: ['S', 'S', 'Z', 'D'] },
    { name: "Extraction", seq: ['S', 'S', 'Z', 'D'] },

    { name: "Reinforce", seq: ['S', 'Q', 'S', 'Z', 'Z', 'Z', 'S'] },
    { name: "Orbital Illumination Flare", seq: ['S', 'Q', 'S', 'S', 'Z', 'Q'] },
    { name: "SOS Beacon", seq: ['S', 'Z', 'Q', 'D', 'Q', 'D'] },
    { name: "Upload Data", seq: ['S', 'Z', 'Z', 'S', 'Z'] },
    { name: "Carpet Bomb", seq: ['S', 'Z', 'Q', 'Z', 'D', 'S'] },
    { name: "Jammed Piñata", seq: ['S', 'Z', 'Q', 'Z', 'D', 'D'] },
    { name: "SEAF Artillery", seq: ['S', 'Z', 'Q', 'Z', 'D', 'Z'] },
    { name: "Orbital Precision Strike", seq: ['S', 'S', 'Z', 'D'] },
    { name: "Orbital Airburst Strike", seq: ['S', 'S', 'Z', 'D'] },
    { name: "Orbital EMS Strike", seq: ['S', 'S', 'Z', 'D'] },

    { name: "Orbital 120mm HE Barrage", seq: ['S', 'Q', 'S', 'Z', 'Z', 'Z', 'S'] },
    { name: "Orbital Gas Strike", seq: ['S', 'Q', 'S', 'S', 'Z', 'Q'] },
    { name: "Orbital 380mm HE Barrage", seq: ['S', 'Z', 'Q', 'D', 'Q', 'D'] },
    { name: "Orbital Laser", seq: ['S', 'Z', 'Z', 'S', 'Z'] },
    { name: "Orbital Railcannon Strike", seq: ['S', 'Z', 'Q', 'Z', 'D', 'S'] },
    { name: "Orbital Walking Barrage", seq: ['S', 'Z', 'Q', 'Z', 'D', 'D'] },
    { name: "Orbital Gatling Barrage", seq: ['S', 'Z', 'Q', 'Z', 'D', 'Z'] },
    { name: "Orbital Smoke Strike", seq: ['S', 'S', 'Z', 'D'] },
    { name: "Orbital Napalm Barrage", seq: ['S', 'S', 'Z', 'D'] },
    { name: "Resupply", seq: ['S', 'S', 'Z', 'D'] },

    { name: "Medical Supplies", seq: ['S', 'Q', 'S', 'Z', 'Z', 'Z', 'S'] },
    { name: "EXO-45 Patriot Exosuit", seq: ['S', 'Q', 'S', 'S', 'Z', 'Q'] },
    { name: "Jump Pack", seq: ['S', 'Z', 'Q', 'D', 'Q', 'D'] },
    { name: "A/MLS-4X Rocket Sentry", seq: ['S', 'Z', 'Z', 'S', 'Z'] },
    { name: "Machine Gun", seq: ['S', 'Z', 'Q', 'Z', 'D', 'S'] },
    { name: "Autocannon", seq: ['S', 'Z', 'Q', 'Z', 'D', 'D'] },
    { name: "Grenade Launcher", seq: ['S', 'Z', 'Q', 'Z', 'D', 'Z'] },
    { name: "Machine Gun", seq: ['S', 'S', 'Z', 'D'] },
    { name: "Stalwart", seq: ['S', 'S', 'Z', 'D'] },
    { name: "Railgun", seq: ['S', 'S', 'Z', 'D'] },

    { name: "Recoilless Rifle", seq: ['S', 'Q', 'S', 'Z', 'Z', 'Z', 'S'] },
    { name: "Laser Cannon", seq: ['S', 'Q', 'S', 'S', 'Z', 'Q'] },
    { name: "Quasar Cannon", seq: ['S', 'Z', 'Q', 'D', 'Q', 'D'] },
    { name: "Anti-Materiel Rifle", seq: ['S', 'Z', 'Z', 'S', 'Z'] },
    { name: "Expendable Anti-Tank", seq: ['S', 'Z', 'Q', 'Z', 'D', 'S'] },
    { name: "Commando", seq: ['S', 'Z', 'Q', 'Z', 'D', 'D'] },
    { name: "Flamethrower", seq: ['S', 'Z', 'Q', 'Z', 'D', 'Z'] },
    { name: "Heavy Machine Gun", seq: ['S', 'S', 'Z', 'D'] },
    { name: "Airburst Rocket Launcher", seq: ['S', 'S', 'Z', 'D'] },
    { name: "Missile Silo", seq: ['S', 'S', 'Z', 'D'] },

    { name: "Spear", seq: ['S', 'Z', 'Q', 'Z', 'D', 'D'] },
    { name: "Arc Thrower", seq: ['S', 'Z', 'Q', 'Z', 'D', 'Z'] },
    { name: "Sterilizer", seq: ['S', 'S', 'Z', 'D'] },
    { name: "A/G-16 Gatling Sentry", seq: ['S', 'S', 'Z', 'D'] },
    { name: "A/MG-43 Machine Gun Sentry", seq: ['S', 'S', 'Z', 'D'] },
    { name: "A/M-12 Mortar Sentry", seq: ['S', 'Z', 'Q', 'Z', 'D', 'D'] },
    { name: "A/M-23 EMS Mortar Sentry", seq: ['S', 'Z', 'Q', 'Z', 'D', 'Z'] },
    { name: "A/MLS-4X Rocket Sentry", seq: ['S', 'S', 'Z', 'D'] },
    { name: "A/AC-8 Autocannon Sentry", seq: ['S', 'S', 'Z', 'D'] },
    { name: "Reinforce", seq: ['S', 'S', 'Z', 'D'] },
    { name: "Extraction Beacon", seq: ['S', 'S', 'Z', 'D'] },
    { name: "EXO-45 Patriot Exosuit", seq: ['S', 'S', 'Z', 'D'] },
    { name: "EXO-49 Emancipator Exosuit", seq: ['S', 'S', 'Z', 'D'] }
];

const arrowMap = {
    'Z': `<svg class="arrow-svg" viewBox="0 0 24 24" width="64" height="64"><path fill="white" d="M12 2l-6 6h4v8h4V8h4z"/></svg>`,
    'S': `<svg class="arrow-svg" viewBox="0 0 24 24" width="64" height="64"><path fill="white" d="M12 22l6-6h-4V8h-4v8H6z"/></svg>`,
    'Q': `<svg class="arrow-svg" viewBox="0 0 24 24" width="64" height="64"><path fill="white" d="M2 12l6-6v4h8v4H8v4z"/></svg>`,
    'D': `<svg class="arrow-svg" viewBox="0 0 24 24" width="64" height="64"><path fill="white" d="M22 12l-6 6v-4H8v-4h8V6z"/></svg>`
};

let score = 0;
let gameStarted = false;
let sequence = [];
let sequenceName = "";
let userIndex = 0;
let timeoutId;
let round = 0;
let totalRounds = 5;
let roundDelay = 1500;
let timeBarInterval;
let timeBarMax = 5000;
let partyStartTime = 0;
let partyDuration = totalRounds * timeBarMax;

function getRandomSequence() {
    const obj = allSequences[Math.floor(Math.random() * allSequences.length)];
    sequenceName = obj.name;
    return obj.seq;
}

function startGame() {
    document.getElementById('result').textContent = '';
    document.querySelector('.start-text').style.display = 'none';
    round = 0;
    score = 0;
    showPartyTimeBar();
    nextRound();
}

function nextRound() {
    if (round >= totalRounds) {
        document.getElementById('result').innerHTML = `
            <div class="end-round">
                <h2>Manche terminée !</h2>
                <p>Score cumulé : <strong>${score}</strong></p>
                <button id="restart-btn">Rejouer</button>
            </div>
        `;
        document.getElementById('qte').textContent = '';
        document.getElementById('qte-name').textContent = '';
        document.querySelector('.start-text').style.display = '';
        let bar = document.getElementById('time-bar');
        if (bar) bar.style.display = 'none';
        clearInterval(timeBarInterval);
        gameStarted = false;

        setTimeout(() => {
            const btn = document.getElementById('restart-btn');
            if (btn) {
                btn.onclick = () => {
                    score = 0;
                    startGame();
                };
            }
        }, 0);
        return;
    }
    sequence = getRandomSequence();
    userIndex = 0;
    showSequence();
    let bar = document.getElementById('time-bar');
    if (bar) bar.style.display = '';
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
        clearInterval(timeBarInterval);
        document.getElementById('result').textContent = "Raté ! Trop lent.";
        document.getElementById('qte').textContent = '';
        document.getElementById('qte-name').textContent = '';
        let bar = document.getElementById('time-bar');
        if (bar) bar.style.display = 'none';
        sequence = [];
        round++;
        // On ne relance pas automatiquement, l'utilisateur doit relancer
    }, timeBarMax);
}

function showSequence() {
    const qteDiv = document.getElementById('qte');
    qteDiv.innerHTML = sequence.map((key, idx) => {
        const isActive = idx < userIndex;
        return `<span class="qte-arrow${isActive ? ' active' : ''}">${arrowMap[key] ? arrowMap[key] : key}</span>`;
    }).join(' ');
    document.getElementById('qte-name').textContent = sequenceName;
    document.getElementById('result').textContent = '';
}

document.addEventListener('keydown', function (e) {
    if (document.querySelector('.start-text') && document.querySelector('.start-text').style.display !== 'none') return;
    if (!sequence.length) return;
    if (e.key.toUpperCase() === sequence[userIndex]) {
        userIndex++;
        showSequence();
        if (userIndex === sequence.length) {
            clearTimeout(timeoutId);
            score += 10;
            let bar = document.getElementById('time-bar');
            if (bar) bar.style.display = '';
            document.getElementById('result').textContent = "Bravo ! Séquence réussie !";
            document.getElementById('qte').textContent = '';
            document.getElementById('qte-name').textContent = '';
            sequence = [];
            round++;
            nextRound();
        }
    } else {
        userIndex = 0;
        showSequence();
    }
});
function showPartyTimeBar() {
    let bar = document.getElementById('time-bar');
    if (!bar) {
        bar = document.createElement('div');
        bar.id = 'time-bar';
        bar.style.height = '16px';
        bar.style.width = '100%';
        bar.style.background = '#222';
        bar.style.borderRadius = '8px';
        bar.style.margin = '24px 0 0 0';
        bar.innerHTML = '<div id="time-bar-inner" style="height:100%;width:100%;background:linear-gradient(90deg,#ffe44c,#ff6a00);border-radius:8px;transition:width 0.1s;"></div>';
        // Ajoute la barre dans le DOM, adapte ce sélecteur à ta structure HTML
        let group = document.querySelector('.text-group') || document.body;
        group.appendChild(bar);
    }
    let inner = document.getElementById('time-bar-inner');
    inner.style.width = '100%';

    partyStartTime = Date.now();
    clearInterval(timeBarInterval);
    timeBarInterval = setInterval(() => {
        let elapsed = Date.now() - partyStartTime;
        let percent = Math.max(0, 1 - elapsed / partyDuration);
        inner.style.width = (percent * 100) + '%';
        if (percent <= 0) {
            clearInterval(timeBarInterval);
            inner.style.width = '0%';
            document.getElementById('result').textContent = "Temps écoulé ! Appuie sur une touche pour rejouer.";
            document.getElementById('qte').textContent = '';
            document.getElementById('qte-name').textContent = '';
            document.querySelector('.start-text').style.display = '';
            let bar = document.getElementById('time-bar');
            if (bar) bar.style.display = 'none';
            sequence = [];
            gameStarted = false;
        }
    }, 30);
}