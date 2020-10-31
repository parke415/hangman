/*----- constants -----*/
const WORDS = [
  'ARRAY', 'FUNCTION', 'BINARY', 'VARIABLE', 
  'BOOLEAN', 'REACT', 'COMPUTER SCIENCE', 
  'TERMINAL', 'EVENTS'
];
const PANEL_WIDTH = 15;
const FATAL_NUM_GUESSES = 6;

/*----- app's state (variables) -----*/
let secretWord;
let guessWord;
let gameStatus; // null = in progress; 👍 = win; 👎 = lose;
let wrongLetters;

/*----- cached element references -----*/
const guessEl = document.getElementById('guess');
const replayBtn = document.getElementById('replay');
const gallowsEl = document.getElementById('gallows');
const letterBtns = document.querySelectorAll('section > button');
const msgEl = document.getElementById('msg');

/*----- event listeners -----*/
document.querySelector('.row:nth-child(1)').addEventListener('click', handleLetterClick);
document.querySelector('.row:nth-child(2)').addEventListener('click', handleLetterClick);
document.querySelector('.row:nth-child(3)').addEventListener('click', handleLetterClick);
document.getElementById('replay').addEventListener('click', init);

/*----- functions -----*/
init();

// In response to user interaction, update state and call render
function handleLetterClick(evt) {
  // debugger;
  const letter = evt.target.textContent;
  if (evt.target.tagName !== 'BUTTON' || gameStatus) return;
  // If the letter is in the secret word
  // update guessWord where all occurrences of that letter is in secretWord
  // Otherwise add letter to the wrong letters array
  if (secretWord.includes(letter)) {
    let newGuess = '';
    for (let i = 0; i < secretWord.length; i++) {
      newGuess += (secretWord.charAt(i) === letter) ? letter :  guessWord.charAt(i);
    }
    guessWord = newGuess;
  } else {
    wrongLetters.push(letter);
  }
  gameStatus = getGameStatus();
  render();
}

function getGameStatus() {
  if (guessWord === secretWord) return '👍';
  if (wrongLetters.length === FATAL_NUM_GUESSES) return '👎';
  return null;
}

// render transfers all state to the DOM
function render() {
  guessEl.textContent = guessWord;
  replayBtn.style.visibility = gameStatus ? 'visible' : 'hidden';
  gallowsEl.style.backgroundPositionX = `-${wrongLetters.length * PANEL_WIDTH}vmin`;
  renderButtons();
  renderMessage();
}
function renderMessage() {
  if (gameStatus === '👍') {
   msgEl.textContent = 'CONGRATS - YOU WON!';
  } else if (gameStatus === '👎') {
    msgEl.textContent = 'RIP';
  } else {
    const numRemaining = FATAL_NUM_GUESSES - wrongLetters.length;
    msgEl.innerHTML = `GOOD LUCK!<br><span>${numRemaining} WRONG GUESS${numRemaining === 1 ? '' : 'ES'} REMAINING</span>`;
  }
}
function renderButtons() {
  letterBtns.forEach(function(btn) {
    const letter = btn.textContent;
    btn.disabled = guessWord.includes(letter)
      || wrongLetters.includes(letter);
    if (guessWord.includes(letter)) {
      btn.className = 'valid-letter';
    } else if (wrongLetters.includes(letter)) {
      btn.className = 'wrong-letter';
    } else {
      btn.className = '';
    }
  });
}

function init() {
  const rndIdx = Math.floor(Math.random() * WORDS.length);
  secretWord = WORDS[rndIdx];
  guessWord = '';
  // init guessWord with underscores for each char in secretWord
  for (let char of secretWord) {
    guessWord += (char === ' ') ? ' ' : '_';
  }
  // Using RegEx
  // guessWord = secretWord.replace(/[A-Z]/g, '_');
  gameStatus = null;
  wrongLetters = [];
  render();
}

