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


// ========================================
// TO-DO LIST avec localStorage
// ========================================

const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');

let tasks = [];

// Charger les tâches depuis localStorage
function loadTasks() {
    const savedTasks = localStorage.getItem('focusflow-tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
        renderTasks();
    }
}

// Sauvegarder dans localStorage
function saveTasks() {
    localStorage.setItem('focusflow-tasks', JSON.stringify(tasks));
}

// Afficher les tâches
function renderTasks() {
    taskList.innerHTML = '';
    
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        li.innerHTML = `
            <span onclick="toggleTask(${index})" style="cursor: pointer; flex: 1;">
                ${task.completed ? '✅' : '⭕'} ${task.text}
            </span>
            <button onclick="deleteTask(${index})">🗑️ Supprimer</button>
        `;
        
        taskList.appendChild(li);
    });
}

// Ajouter une tâche
function addTask() {
    const text = taskInput.value.trim();
    
    if (text === '') {
        alert('⚠️ Veuillez entrer une tâche !');
        return;
    }
    
    tasks.push({
        text: text,
        completed: false,
        createdAt: new Date().toISOString()
    });
    
    taskInput.value = '';
    saveTasks();
    renderTasks();
}

// Marquer comme complétée
function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
}

// Supprimer une tâche
function deleteTask(index) {
    if (confirm('🗑️ Supprimer cette tâche ?')) {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    }
}

// Event Listeners
addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Initialisation
loadTasks();