import { render, screen, fireEvent } from "@testing-library/react";
import Keyboard from "./Keyboard";
import { KeyClass } from "../types";
import { KEYBOARD } from "../constants";

const keyboardState = {
  s: KeyClass.Correct,
  a: KeyClass.Absent,
  p: KeyClass.Shifted,
};

test("renders the keyboard layout correctly", () => {
  render(<Keyboard layout={KEYBOARD} keyboard={{}} onKeyClick={jest.fn()} />);
  KEYBOARD.flat().forEach((key) => {
    expect(
      screen.getByText(key === "Backspace" ? "⌫" : key)
    ).toBeInTheDocument();
  });
});

test("applies the correct classes to the keys based on keyboard state", () => {
  render(
    <Keyboard
      layout={KEYBOARD}
      keyboard={keyboardState}
      onKeyClick={jest.fn()}
    />
  );
  expect(screen.getByText("S").closest("button")).toHaveClass(
    `keyboard-key--${KeyClass.Correct}`
  );
  expect(screen.getByText("A").closest("button")).toHaveClass(
    `keyboard-key--${KeyClass.Absent}`
  );
  expect(screen.getByText("P").closest("button")).toHaveClass(
    `keyboard-key--${KeyClass.Shifted}`
  );
});

test("calls onKeyClick when a key is clicked", () => {
  const onKeyClickMock = jest.fn();
  render(
    <Keyboard layout={KEYBOARD} keyboard={{}} onKeyClick={onKeyClickMock} />
  );
  fireEvent.click(screen.getByText("A"));
  expect(onKeyClickMock).toHaveBeenCalledWith("A");
});
