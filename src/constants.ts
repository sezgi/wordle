const GUESSES = 6;
const WORD_LENGTH = 5;
const API_URL = `https://random-word-api.herokuapp.com/word?length=${WORD_LENGTH}`;
const KEYBOARD = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Enter", "Z", "X", "C", "V", "B", "N", "M", "Backspace"],
];

export { GUESSES, WORD_LENGTH, API_URL, KEYBOARD };
