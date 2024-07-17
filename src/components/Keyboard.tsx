import { KeyboardLayout, KeyboardState } from "../types";

interface KeyboardProps {
  layout: KeyboardLayout;
  keyboard: KeyboardState;
  onKeyClick: (key: string) => void;
}

const Keyboard: React.FC<KeyboardProps> = ({
  layout,
  keyboard,
  onKeyClick,
}) => {
  return (
    <div className="keyboard">
      {layout.map((row) => (
        <div key={`row-${row[0]}`} className="keyboard-row">
          {row.map((key) => {
            const lowercaseKey = key.toLowerCase();
            return (
              <button
                key={`key-${key}`}
                className={`keyboard-key${
                  keyboard[lowercaseKey]
                    ? ` keyboard-key--${keyboard[lowercaseKey]}`
                    : ""
                }`}
                onClick={() => onKeyClick(key)}
              >
                <span className={`key-${key}`}>
                  {key === "Backspace" ? "⌫" : key}
                </span>
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
