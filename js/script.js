const keys = ['A', 'Z', 'E', 'R', 'Q', 'S', 'D', 'F'];
let sequence = [];
let userIndex = 0;
let timeoutId;
let round = 0;
let totalRounds = 5;
let roundDelay = 1500;

function generateSequence(length = 4) {
    const seq = [];
    for (let i = 0; i < length; i++) {
        seq.push(keys[Math.floor(Math.random() * keys.length)]);
    }
    return seq;
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
        return;
    }
    sequence = generateSequence(4);
    userIndex = 0;
    showSequence();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
        document.getElementById('result').textContent = "Raté ! Trop lent.";
        document.getElementById('qte').textContent = '';
        sequence = [];
        round++;
        setTimeout(nextRound, roundDelay);
    }, 5000);
}

function showSequence() {
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
            sequence = [];
            round++;
            setTimeout(nextRound, roundDelay);
        }
    } else {
        if (sequence.length) {
            clearTimeout(timeoutId);
            document.getElementById('result').textContent = "Raté ! Mauvaise touche.";
            document.getElementById('qte').textContent = '';
            sequence = [];
            round++;
            setTimeout(nextRound, roundDelay);
        }
    }
});