const wordContainer = document.getElementById('wordContainer');
const startButton = document.getElementById('startButton');
const resetButton = document.getElementById('resetButton');
const nextButton = document.getElementById('nextButton');
const usedLettersElement = document.getElementById('usedLetters');
const gameContainer = document.getElementById('gameContainer');

let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
ctx.canvas.width = 0;
ctx.canvas.height = 0;

const bodyParts = [
    [4, 2, 1, 1],
    [4, 3, 1, 2],
    [3, 5, 1, 1],
    [5, 5, 1, 1],
    [3, 3, 1, 1],
    [5, 3, 1, 1]
];

let selectedWord;
let usedLetters;
let mistakes;
let hits;
let usedWords = [];

const addLetter = letter => {
    const letterElement = document.createElement('span');
    letterElement.innerHTML = letter.toUpperCase();
    usedLettersElement.appendChild(letterElement);
}

const addBodyPart = bodyPart => {
    ctx.fillStyle = '#fff';
    ctx.fillRect(...bodyPart);
};

const wrongLetter = () => {
    addBodyPart(bodyParts[mistakes]);
    mistakes++;
    if (mistakes === bodyParts.length) endGame(false);
}

const endGame = (won) => {
    document.removeEventListener('keydown', letterEvent);
    if (won) {
        nextButton.style.display = 'block';
    } else {
        resetButton.style.display = 'block';
    }
}

const correctLetter = letter => {
    const { children } = wordContainer;
    for (let i = 0; i < children.length; i++) {
        if (children[i].innerHTML === letter) {
            children[i].classList.remove('hidden');
            hits++;
        }
    }
    if (hits === selectedWord.length) endGame(true);
}

const letterInput = letter => {
    if (selectedWord.includes(letter)) {
        correctLetter(letter);
    } else {
        wrongLetter();
    }
    addLetter(letter);
    usedLetters.push(letter);
};

const letterEvent = event => {
    let newLetter = event.key.toUpperCase();
    if (newLetter.match(/^[a-zñ]$/i) && !usedLetters.includes(newLetter)) {
        letterInput(newLetter);
    };
};

const drawWord = () => {
    selectedWord.forEach(letter => {
        const letterElement = document.createElement('span');
        letterElement.innerHTML = letter.toUpperCase();
        letterElement.classList.add('letter');
        letterElement.classList.add('hidden');
        wordContainer.appendChild(letterElement);
    });
};

const selectRandomWord = () => {
    let word;
    do {
        word = words[Math.floor((Math.random() * words.length))].toUpperCase();
    } while (usedWords.includes(word) && usedWords.length < words.length);
    
    usedWords.push(word);
    if (usedWords.length === words.length) {
        usedWords = [];
    }
    
    selectedWord = word.split('');
};

const drawHangMan = () => {
    ctx.canvas.width = 120;
    ctx.canvas.height = 160;
    ctx.scale(20, 20);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#d95d39';
    ctx.fillRect(0, 7, 4, 1);
    ctx.fillRect(1, 0, 1, 8);
    ctx.fillRect(2, 0, 3, 1);
    ctx.fillRect(4, 1, 1, 1);
};

const startGame = () => {
    usedLetters = [];
    mistakes = 0;
    hits = 0;
    wordContainer.innerHTML = '';
    usedLettersElement.innerHTML = '';
    startButton.style.display = 'none';
    resetButton.style.display = 'none';
    nextButton.style.display = 'none';
    gameContainer.classList.remove('hidden');
    drawHangMan();
    selectRandomWord();
    drawWord();
    document.addEventListener('keydown', letterEvent);
};

const resetGame = () => {
    usedLetters = [];
    mistakes = 0;
    hits = 0;
    wordContainer.innerHTML = '';
    usedLettersElement.innerHTML = '';
    drawHangMan();
    drawWord();
    document.addEventListener('keydown', letterEvent);
};

const nextGame = () => {
    usedLetters = [];
    mistakes = 0;
    hits = 0;
    wordContainer.innerHTML = '';
    usedLettersElement.innerHTML = '';
    selectRandomWord();
    drawHangMan();
    drawWord();
    document.addEventListener('keydown', letterEvent);
};

startButton.addEventListener('click', startGame);
resetButton.addEventListener('click', resetGame);
nextButton.addEventListener('click', nextGame);
