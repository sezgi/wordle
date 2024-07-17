import { TileGrid } from "./types";

export const generateGrid = (width: number, height: number): TileGrid =>
  Array.from({ length: height }, () =>
    Array.from({ length: width }, () => ({
      value: "",
      classList: ["tile"],
    }))
  );

export const countLetter = (str: string, letter: string): number =>
  str.split(letter).length - 1;
