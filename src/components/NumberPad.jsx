function NumberPad({ onNumberClick, onClear }) {
  return (
    <div className="number-pad">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
        <button key={number} onClick={() => onNumberClick(number)}>
          {number}
        </button>
      ))}

      <button onClick={onClear}>⌫</button>
    </div>
  );
}

export default NumberPad;
