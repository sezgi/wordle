import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import App from "./App";
import fetchMock from "jest-fetch-mock";

beforeEach(async () => {
  fetchMock.resetMocks();
  fetchMock.mockResponseOnce(JSON.stringify(["sappy"]));
  render(<App />);
  await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
  await waitFor(() =>
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
  );
});

describe("User keyboard events", () => {
  test("pressing a key sets the tile value at the current position", async () => {
    const firstTile = screen.getByTestId("tile-0-0");
    expect(firstTile).toBeInTheDocument();
    fireEvent.keyDown(document, { key: "S" });
    expect(firstTile).toHaveTextContent("s");
  });

  test("pressing a series of keys sets the correct tile values", async () => {
    const keys = ["S", "A", "P", "P", "Y"];
    keys.forEach((key, index) => {
      fireEvent.keyDown(document, { key });
      const tile = screen.getByTestId(`tile-0-${index}`);
      expect(tile).toHaveTextContent(key.toLowerCase());
    });
  });

  test('pressing "Backspace" removes the last letter', async () => {
    fireEvent.keyDown(document, { key: "S" });
    fireEvent.keyDown(document, { key: "A" });
    fireEvent.keyDown(document, { key: "Backspace" });
    const firstTile = screen.getByTestId("tile-0-0");
    const secondTile = screen.getByTestId("tile-0-1");
    expect(firstTile).toHaveTextContent("s");
    expect(secondTile).toHaveTextContent("");
  });

  test('pressing "Enter" processes the current row if it has enough letters', async () => {
    const keys = ["S", "A", "P", "P", "Y"];
    keys.forEach((key, index) => {
      fireEvent.keyDown(document, { key });
    });
    fireEvent.keyDown(document, { key: "Enter" });
    keys.forEach((_, index) => {
      const tile = screen.getByTestId(`tile-0-${index}`);
      expect(tile).toHaveClass("guessed");
    });
  });

  test('pressing "Enter" without enough letters does nothing', async () => {
    fireEvent.keyDown(document, { key: "S" });
    fireEvent.keyDown(document, { key: "Enter" });
    const firstTile = screen.getByTestId("tile-0-0");
    expect(firstTile).not.toHaveClass("guessed");
  });
});

// TODO
// Add tests for the following:
// - pressing "Enter":
//   - when the last row is complete (game over)
//   - with correct guess (win)
//   - with partially correct guess
// - row limits, e.g. backspace on first tile
// - game reset
// - shifted char logic
// - user mouse events (keyboard component)
