const gameArea = document.getElementById('game-area');
const wordBuffer = document.getElementById('word-buffer');
const scoreDisplay = document.getElementById('score');
const submitBtn = document.getElementById('submit-word');
const deleteBtn = document.getElementById('delete-btn');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const endScreen = document.getElementById('end-screen');
const timerDisplay = document.getElementById('timer');
const finalScoreDisplay = document.getElementById('final-score');

const wordSet = new Set(wordList);

let currentWord = '';
let score = 0;
let timer = 60;
let gameInterval = null;
let letterInterval = null;

const colors = ['red', 'green', 'blue', 'yellow', 'orange'];

startBtn.addEventListener('click', () => {
  startScreen.classList.add('hidden');
  gameScreen.classList.remove('hidden');
  resetGame();
  letterInterval = setInterval(createLetter, 800);
  gameInterval = setInterval(updateTimer, 1000);
});

restartBtn.addEventListener('click', () => {
  endScreen.classList.add('hidden');
  gameScreen.classList.remove('hidden');
  resetGame();
  letterInterval = setInterval(createLetter, 800);
  gameInterval = setInterval(updateTimer, 1000);
});

function resetGame() {
  score = 0;
  timer = 60;
  currentWord = '';
  gameArea.innerHTML = '';
  wordBuffer.textContent = '';
  scoreDisplay.textContent = 'Score: 0';
  timerDisplay.textContent = 'Time: 60s';
}

function updateTimer() {
  timer--;
  timerDisplay.textContent = `Time: ${timer}s`;
  if (timer <= 0) {
    endGame();
  }
}

function endGame() {
  clearInterval(gameInterval);
  clearInterval(letterInterval);
  gameScreen.classList.add('hidden');
  endScreen.classList.remove('hidden');
  finalScoreDisplay.textContent = `Your Score: ${score}`;
}

function createLetter() {
  const letter = document.createElement('div');
  letter.classList.add('letter');
  letter.textContent = getRandomLetter();
  const left = Math.random() * (gameArea.offsetWidth - 40);
  letter.style.left = `${left}px`;
  const color = colors[Math.floor(Math.random() * colors.length)];
  letter.classList.add(color);
  gameArea.appendChild(letter);

  letter.addEventListener('animationend', () => {
    if (letter.parentNode) gameArea.removeChild(letter);
  });

  letter.addEventListener('click', () => {
    currentWord += letter.textContent;
    wordBuffer.textContent = currentWord;
    letter.remove();
  });
}

function getRandomLetter() {
  const vowels = 'AEIOU';
  const consonants = 'BCDFGHJKLMNPQRSTVWXYZ';
  const pool = vowels.repeat(3) + consonants;
  return pool[Math.floor(Math.random() * pool.length)];
}

function submitWord() {
  const word = currentWord;
  const normalized = word.toLowerCase();
  if (wordSet.has(normalized)) {
    score += word.length * 10;
    wordBuffer.textContent = `✅ ${word.toUpperCase()}`;
  } else {
    wordBuffer.textContent = `❌ ${word.toUpperCase()}`;
  }
  currentWord = '';
  scoreDisplay.textContent = `Score: ${score}`;
}

function deleteLastLetter() {
  currentWord = currentWord.slice(0, -1);
  wordBuffer.textContent = currentWord;
}

document.addEventListener('keydown', (e) => {
  const key = e.key;
  if (key.length === 1 && /^[a-zA-Z]$/.test(key)) {
    const upper = key.toUpperCase();
    const match = [...document.getElementsByClassName('letter')].find(el => el.textContent === upper);
    if (match) {
      currentWord += upper;
      wordBuffer.textContent = currentWord;
      match.remove();
    }
  } else if (key === 'Backspace') {
    deleteLastLetter();
  } else if (key === 'Enter') {
    submitWord();
  }
});

submitBtn.addEventListener('click', submitWord);
deleteBtn.addEventListener('click', deleteLastLetter);