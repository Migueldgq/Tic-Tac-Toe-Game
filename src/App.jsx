import { useState } from "react";
import confetti from "canvas-confetti";
import { Square } from "./components/Square";
import { TURNS } from "./constants";
import { checkWinnerFrom, checkEndGame } from "./logic/board";
import { WinnerModal } from "./components/WinnerModal";
import { resetGameStorage, saveGameStorage } from "./logic/storage";

function App() {
  console.log("render");
  const [board, setBoard] = useState(() => {
    console.log("inicializar estado del board");
    const boardFromStorage = window.localStorage.getItem("board");
    return boardFromStorage
      ? JSON.parse(boardFromStorage)
      : Array(9).fill(null);
  });

  const [turn, setTurn] = useState(() => {
    const turnFromLocalStorage = window.localStorage.getItem("turn");
    return turnFromLocalStorage ?? TURNS.X;
  });
  // null = hay ganador, false = empate
  const [winner, SetWinner] = useState(null);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setTurn(TURNS.X);
    SetWinner(null);

    resetGameStorage();
  };

  const updateBoard = (index) => {
    /* No se actualiza la posicion si ya hay algo */
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = turn;
    setBoard(newBoard);

    /* Cambiar el turno */
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X;
    setTurn(newTurn);
    // guardar partida
    saveGameStorage({ board: newBoard, turn: newTurn });
    //Revisar si hay ganador

    const newWinnner = checkWinnerFrom(newBoard);
    if (newWinnner) {
      confetti();
      SetWinner(newWinnner);
    } else if (checkEndGame(newBoard)) {
      SetWinner(false); // empate
    }
  };

  return (
    <main className="board">
      <h1>Tic tac toe</h1>
      <button onClick={resetGame}>Reset game</button>
      <section className="game">
        {board.map((square, index) => {
          return (
            <Square key={index} index={index} updateBoard={updateBoard}>
              {square}
            </Square>
          );
        })}
      </section>

      <section className="turn">
        <Square isSelected={turn === TURNS.X}>{TURNS.X}</Square>
        <Square isSelected={turn === TURNS.O}>{TURNS.O}</Square>
      </section>

      <section>
        <WinnerModal resetGame={resetGame} winner={winner} />
      </section>
    </main>
  );
}
export default App;
