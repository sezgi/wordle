import { render, screen, fireEvent } from "@testing-library/react";
import Message from "./Message";

test("displays win message when win is true", () => {
  render(<Message win gameOver={false} word="sappy" onReset={jest.fn()} />);
  expect(screen.getByText("YOU GOT IT!")).toBeInTheDocument();
});

test("displays the game over message when gameOver is true", () => {
  render(<Message win={false} gameOver word="sappy" onReset={jest.fn()} />);
  expect(screen.getByText('Sorry, it was "sappy"')).toBeInTheDocument();
});

test("displays win message when win and gameOver are true", () => {
  render(<Message win gameOver word="sappy" onReset={jest.fn()} />);
  expect(screen.getByText("YOU GOT IT!")).toBeInTheDocument();
});

test("calls onReset when play again button is clicked", () => {
  const onResetMock = jest.fn();
  render(
    <Message win={false} gameOver={true} word="sappy" onReset={onResetMock} />
  );
  const button = screen.getByText("Play again");
  fireEvent.click(button);
  expect(onResetMock).toHaveBeenCalledTimes(1);
});
