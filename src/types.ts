export enum TileClass {
  Guessing = "guessing",
  Guessed = "guessed",
  Correct = "correct",
  Shifted = "shifted",
}
export enum KeyClass {
  Correct = "correct",
  Shifted = "shifted",
  Absent = "absent",
}
export interface Tile {
  value: string;
  classList: TileClass[] | string[];
}
export type TileGrid = Tile[][];
export type KeyboardLayout = string[][];
export type KeyboardState = Record<string, KeyClass>;
