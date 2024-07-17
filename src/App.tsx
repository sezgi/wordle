/**
 * Use your keyboard or mouse to play Wordle!
 * Original: https://www.nytimes.com/games/wordle/index.html
 * Wiki: https://en.wikipedia.org/wiki/Wordle
 * ---
 * On initial load and reset, fetches a random word of length 5
 * User can enter 6 guesses
 * After each guess, the tiles are colored:
 * - Green: correct letter in correct position
 * - Yellow: correct letter in incorrect position
 * - Gray: incorrect letter or excess repeating letters
 * User wins if all letters are correct
 * Game over when all guesses are used
 * ---
 * TODO:
 * Check if valid word
 * Write more tests
 * Make keyboard responsive (e.g. mobile)
 * Test app on mobile
 * Add flip animation to tiles
 * Add aria labels
 */
import { useState, useEffect, useCallback } from "react";
import { generateGrid, countLetter } from "./utils";
import Grid from "./components/Grid";
import Message from "./components/Message";
import Keyboard from "./components/Keyboard";
import { Tile, TileClass, KeyClass, KeyboardState } from "./types";
import { GUESSES, WORD_LENGTH, API_URL, KEYBOARD } from "./constants";
import "./App.css";

export default function App() {
  const [word, setWord] = useState("");
  const [grid, setGrid] = useState(generateGrid(WORD_LENGTH, GUESSES));
  const [currentRow, setCurrentRow] = useState(0);
  const [currentCol, setCurrentCol] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [keyboard, setKeyboard] = useState<KeyboardState>({});

  const cloneGrid = useCallback(() => JSON.parse(JSON.stringify(grid)), [grid]);

  const handleKeyClick = useCallback(
    (key: string) => {
      if (gameOver || win) return;
      const gridClone = cloneGrid();
      const keyboardClone = { ...keyboard };

      if (key === "Backspace") {
        if (currentCol > 0) {
          const tile = gridClone[currentRow][currentCol - 1];
          tile.value = "";
          tile.classList.pop(); // remove "guessing" class
          setGrid(gridClone);
          setCurrentCol(currentCol - 1);
        }
      } else if (key === "Enter" && currentCol === WORD_LENGTH) {
        // user submitted a guess
        const guess = gridClone[currentRow]
          .map((obj: Tile) => obj.value)
          .join("");
        const shifted: Record<string, number[]> = {}; // tracks indices of shifted chars
        const correct: Record<string, number> = {}; // tracks count of each correct char
        let correctCount = 0;

        // check each character
        for (let i = 0; i < guess.length; i++) {
          const char = guess[i];
          const classList = gridClone[currentRow][i].classList;
          classList.push(TileClass.Guessed);
          if (char === word[i]) {
            // correct char in correct position
            classList.push(TileClass.Correct);
            correct[char] = correct[char] || 0;
            correct[char]++;
            correctCount++;
            keyboardClone[char] = KeyClass.Correct;
          } else if (word.includes(char)) {
            // correct char in incorrect position
            shifted[char] = shifted[char] || [];
            shifted[char].push(i);
          } else {
            // incorrect char
            keyboardClone[char] = KeyClass.Absent;
          }
        }
        // -- shifted char logic --
        // "Multiple instances of the same letter in a guess, such as the "o"s in "robot",
        // will be colored green or yellow only if the letter also appears multiple times
        // in the answer; otherwise, excess repeating letters will be colored gray."
        for (const shiftedChar of Object.keys(shifted)) {
          // number of that letter in the word, minus already guessed
          const count =
            countLetter(word, shiftedChar) - (correct[shiftedChar] || 0);
          if (!keyboardClone[shiftedChar]) {
            // if keyboard key is not already green, paint it yellow
            keyboardClone[shiftedChar] = KeyClass.Shifted;
          }
          // indices of the char guessed in incorrect position
          const shiftedIndices = shifted[shiftedChar];

          for (let i = 0; i < shiftedIndices.length; i++) {
            // return if already guessed
            if (i >= count) break;
            // otherwise, paint yellow
            gridClone[currentRow][shiftedIndices[i]].classList.push(
              TileClass.Shifted
            );
          }
        }
        if (correctCount === word.length) setWin(true);
        else if (currentRow === GUESSES - 1) {
          setGameOver(true);
        }
        setGrid(gridClone);
        setKeyboard(keyboardClone);
        setCurrentRow(currentRow + 1);
        setCurrentCol(0);
      } else if (key.length === 1 && /^[a-zA-Z]+$/.test(key)) {
        // user typed a letter in the current row
        if (currentCol === WORD_LENGTH) return;
        const tile = gridClone[currentRow][currentCol];
        tile.value = key.toLowerCase();
        tile.classList.push(TileClass.Guessing);
        setGrid(gridClone);
        setCurrentCol(currentCol + 1);
      }
    },
    [keyboard, currentRow, currentCol, win, gameOver, word]
  );

  const handleReset = useCallback((ev: React.MouseEvent<HTMLButtonElement>) => {
    const target = ev.target as HTMLButtonElement;
    target.blur(); // prevent "Enter" key from triggering button click
    fetchWord();
    setGrid(generateGrid(WORD_LENGTH, GUESSES));
    setKeyboard({});
    setCurrentRow(0);
    setCurrentCol(0);
    setGameOver(false);
    setWin(false);
  }, []);

  const fetchWord = useCallback(async () => {
    const data = await fetch(API_URL);
    const json = await data.json();
    setWord(json[0]);
    // temporary log for easy testing by code reviewer
    // note that react renders twice in dev mode
    console.log("word:", json[0]);
  }, []);

  useEffect(() => {
    if (!word) fetchWord();
  }, []);

  useEffect(() => {
    const handleKeyDown = (ev: KeyboardEvent) => {
      // if a keyboard component button is in focus, "Enter" key
      // should not trigger the button click
      const target = ev.target as HTMLElement;
      if (target.tagName === "BUTTON") ev.preventDefault();
      // handle user-typed keys the same as keyboard component button clicks
      handleKeyClick(ev.key);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyClick]);

  if (!word) return <div className="loading">Loading...</div>;

  return (
    <div>
      <Grid
        grid={grid}
        showMessage={win || gameOver}
        MessageComponent={
          <Message {...{ win, gameOver, word }} onReset={handleReset} />
        }
      />
      <Keyboard
        layout={KEYBOARD}
        keyboard={keyboard}
        onKeyClick={handleKeyClick}
      />
    </div>
  );
}
