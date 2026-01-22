// ========================================
// TIMER POMODORO
// ========================================

let timerInterval;
let timeLeft = 25 * 60; // 25 minutes en secondes
let isRunning = false;
let currentMode = 'work'; // 'work' ou 'break'

const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const modeBtns = document.querySelectorAll('.mode-btn');

// Fonction pour mettre à jour l'affichage
function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    
    minutesDisplay.textContent = minutes.toString().padStart(2, '0');
    secondsDisplay.textContent = seconds.toString().padStart(2, '0');
}

// Fonction pour démarrer le timer
function startTimer() {
    if (isRunning) return;
    
    isRunning = true;
    timerInterval = setInterval(() => {
        timeLeft--;
        updateDisplay();
        
        if (timeLeft === 0) {
            clearInterval(timerInterval);
            isRunning = false;
            alert(currentMode === 'work' ? '⏰ Temps de travail terminé ! Prenez une pause.' : '✅ Pause terminée ! Retour au travail.');
            
            // Auto-switch au mode suivant
            switchMode(currentMode === 'work' ? 'break' : 'work');
        }
    }, 1000);
}

// Fonction pour mettre en pause
function pauseTimer() {
    clearInterval(timerInterval);
    isRunning = false;
}

// Fonction pour réinitialiser
function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    timeLeft = currentMode === 'work' ? 25 * 60 : 5 * 60;
    updateDisplay();
}

// Fonction pour changer de mode
function switchMode(mode) {
    currentMode = mode;
    pauseTimer();
    
    if (mode === 'work') {
        timeLeft = 25 * 60;
    } else {
        timeLeft = 5 * 60;
    }
    
    updateDisplay();
    
    // Mise à jour visuelle des boutons
    modeBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.mode === mode) {
            btn.classList.add('active');
        }
    });
}

// Event Listeners
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        switchMode(btn.dataset.mode);
    });
});

// Initialisation
updateDisplay();