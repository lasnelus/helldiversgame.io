const allSequences = [
    { name: "Combo Alpha", seq: ['A', 'Z', 'E', 'R'] },
    { name: "Combo Bravo", seq: ['Q', 'S', 'D', 'F'] },
    { name: "Combo Charlie", seq: ['A', 'Q', 'Z', 'S'] },
    { name: "Combo Delta", seq: ['E', 'R', 'D', 'F'] },
    { name: "Combo Echo", seq: ['Z', 'E', 'S', 'D'] },
    { name: "Combo Foxtrot", seq: ['Q', 'Q', 'S', 'S'] },
    { name: "Combo Golf", seq: ['A', 'A', 'D', 'D'] },
    { name: "Combo Hotel", seq: ['R', 'E', 'Z', 'A'] }
];

let sequence = [];
let sequenceName = "";
let userIndex = 0;
let timeoutId;
let round = 0;
let totalRounds = 5;
let roundDelay = 1500;

function getRandomSequence() {
    // Prend une séquence au hasard dans la liste
    const obj = allSequences[Math.floor(Math.random() * allSequences.length)];
    sequenceName = obj.name;
    return obj.seq;
}

function startGame() {
    document.getElementById('result').textContent = '';
    round = 0;
    nextRound();
}

function nextRound() {
    if (round >= totalRounds) {
        document.getElementById('result').textContent = "Partie terminée !";
        document.getElementById('qte').textContent = '';
        document.getElementById('qte-name').textContent = '';
        return;
    }
    sequence = getRandomSequence();
    userIndex = 0;
    showSequence();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
        document.getElementById('result').textContent = "Raté ! Trop lent.";
        document.getElementById('qte').textContent = '';
        document.getElementById('qte-name').textContent = '';
        sequence = [];
        round++;
        setTimeout(nextRound, roundDelay);
    }, 5000);
}

function showSequence() {
    document.getElementById('qte-name').textContent = sequenceName;
    document.getElementById('qte').textContent = `Appuie sur : ${sequence.join(' ')}`;
}

document.addEventListener('keydown', function (e) {
    if (!sequence.length) return;
    if (e.key.toUpperCase() === sequence[userIndex]) {
        userIndex++;
        if (userIndex === sequence.length) {
            clearTimeout(timeoutId);
            document.getElementById('result').textContent = "Bravo ! Séquence réussie !";
            document.getElementById('qte').textContent = '';
            document.getElementById('qte-name').textContent = '';
            sequence = [];
            round++;
            setTimeout(nextRound, roundDelay);
        }
    } else {
        if (sequence.length) {
            clearTimeout(timeoutId);
            document.getElementById('result').textContent = "Raté ! Mauvaise touche.";
            document.getElementById('qte').textContent = '';
            document.getElementById('qte-name').textContent = '';
            sequence = [];
            round++;
            setTimeout(nextRound, roundDelay);
        }
    }
});