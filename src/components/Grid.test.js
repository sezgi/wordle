import { render, screen } from "@testing-library/react";
import Grid from "./Grid";
import { generateGrid } from "../utils";
import { TileClass } from "../types";

const mockGrid = generateGrid(5, 2);
const MockMessage = () => <div data-testid="message">Game Over</div>;

describe("Grid component", () => {
  test("renders with correct number of tiles", () => {
    render(
      <Grid
        grid={mockGrid}
        showMessage={false}
        MessageComponent={<MockMessage />}
      />
    );
    const tiles = screen.getAllByTestId(/tile-/);
    expect(tiles.length).toBe(10);
  });

  test("renders with correct tile values", () => {
    mockGrid[0][0].value = "s";
    mockGrid[0][1].value = "a";
    mockGrid[0][2].value = "p";
    mockGrid[0][3].value = "p";
    mockGrid[0][4].value = "y";
    render(
      <Grid
        grid={mockGrid}
        showMessage={false}
        MessageComponent={<MockMessage />}
      />
    );
    expect(screen.getByTestId("tile-0-0")).toHaveTextContent("s");
    expect(screen.getByTestId("tile-0-1")).toHaveTextContent("a");
    expect(screen.getByTestId("tile-0-2")).toHaveTextContent("p");
    expect(screen.getByTestId("tile-0-3")).toHaveTextContent("p");
    expect(screen.getByTestId("tile-0-4")).toHaveTextContent("y");
    expect(screen.getByTestId("tile-1-0")).toHaveTextContent("");
  });

  test("applies the correct classes to the tiles", () => {
    mockGrid[0][0].classList.push(TileClass.Guessing);
    mockGrid[0][1].classList.push(TileClass.Guessed);
    mockGrid[0][3].classList.push(TileClass.Correct);
    mockGrid[0][4].classList.push(TileClass.Shifted);
    render(
      <Grid
        grid={mockGrid}
        showMessage={false}
        MessageComponent={<MockMessage />}
      />
    );
    expect(screen.getByTestId("tile-0-0")).toHaveClass("guessing");
    expect(screen.getByTestId("tile-0-1")).toHaveClass("guessed");
    expect(screen.getByTestId("tile-0-3")).toHaveClass("correct");
    expect(screen.getByTestId("tile-0-4")).toHaveClass("shifted");
  });

  test("renders the message component when showMessage is true", () => {
    render(
      <Grid
        grid={mockGrid}
        showMessage={true}
        MessageComponent={<MockMessage />}
      />
    );
    expect(screen.getByTestId("message")).toBeInTheDocument();
  });

  test("does not render the message component when showMessage is false", () => {
    render(
      <Grid
        grid={mockGrid}
        showMessage={false}
        MessageComponent={<MockMessage />}
      />
    );
    expect(screen.queryByTestId("message")).not.toBeInTheDocument();
  });
});
