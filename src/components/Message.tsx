/**
 * Displays a message when user wins or loses,
 * and a button to reset the game
 */
interface MessageProps {
  win: boolean;
  gameOver: boolean;
  word: string;
  onReset: (ev: React.MouseEvent<HTMLButtonElement>) => void;
}

const Message: React.FC<MessageProps> = ({ win, gameOver, word, onReset }) => {
  return (
    <div className="message">
      <p>
        {win && "YOU GOT IT!"}
        {!win && gameOver && `Sorry, it was "${word}"`}
      </p>
      <button onClick={onReset}>Play again</button>
    </div>
  );
};

export default Message;
