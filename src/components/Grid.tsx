/**
 * Displays the grid of tiles
 */
import { TileGrid } from "../types";

interface GridProps {
  grid: TileGrid;
  showMessage: boolean;
  MessageComponent: JSX.Element;
}

const Grid: React.FC<GridProps> = ({ grid, showMessage, MessageComponent }) => {
  return (
    <div className="grid">
      {grid.map((row, rowIndex) =>
        row.map((col, colIndex) => (
          <div
            id={`tile-${rowIndex}-${colIndex}`}
            key={`${rowIndex}-${colIndex}`}
            className={col.classList.join(" ")}
          >
            <span>{col.value}</span>
          </div>
        ))
      )}
      {showMessage && MessageComponent}
    </div>
  );
};

export default Grid;
