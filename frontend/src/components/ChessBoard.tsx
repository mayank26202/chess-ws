import type { Color, PieceSymbol, Square } from "chess.js";
import { useState } from "react";
import { MOVE } from "../screens/Game";
import { Chess } from "chess.js";

export const ChessBoard = ({
  board,
  socket,
  onMove,
  playerColor,
  turn,
}: {
  board: ({
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null)[][];
  socket: WebSocket;
  onMove: (move: { from: Square; to: Square }) => void;
  playerColor: "w" | "b";
  turn: "w" | "b";
}) => {
  const [from, setFrom] = useState<null | Square>(null);
  const chess = new Chess();
  chess.loadPgn(""); // fresh state for validation

  // Flip board for black player
  const renderedBoard = playerColor === "b" ? [...board].reverse() : board;

  const handleClick = (squareRepresentation: Square) => {
    if (!from) {
      const piece = board.flat().find(
        (sq) => sq && sq.square === squareRepresentation
      );
      // ✅ Prevent selecting opponent's piece or empty square
      if (!piece || piece.color !== playerColor) return;
      setFrom(squareRepresentation);
      return;
    }

    const move = { from, to: squareRepresentation };

    try {
      const temp = new Chess();
      temp.load(JSON.stringify(chess)); // copy state if needed

      // ✅ Validate the move using chess.js
      const result = temp.move(move);
      if (!result) {
        console.log("❌ Invalid move");
        setFrom(null);
        return;
      }

      // ✅ Only allow move if it's your turn
      if (turn !== playerColor) {
        console.log("⏳ Not your turn!");
        setFrom(null);
        return;
      }

      // ✅ Send to backend and update locally
      socket.send(
        JSON.stringify({
          type: MOVE,
          payload: { move },
        })
      );
      onMove(move);
      console.log("✅ Move:", move.from, "→", move.to);
    } catch (err) {
      console.error("Invalid move:", err);
    }

    setFrom(null);
  };

  return (
    <div className="text-black border-4 border-gray-700 inline-block rounded-lg overflow-hidden">
      {renderedBoard.map((row, i) => (
        <div key={i} className="flex">
          {row.map((square, j) => {
            const file = String.fromCharCode(97 + (j % 8));
            const rank = 8 - i;
            const squareRepresentation = `${file}${rank}` as Square;
            const isDark = (i + j) % 2 === 1;

            return (
              <div
                key={squareRepresentation}
                onClick={() => handleClick(squareRepresentation)}
                className={`w-16 h-16 flex justify-center items-center cursor-pointer transition ${
                  isDark ? "bg-green-600" : "bg-green-100"
                } ${
                  from === squareRepresentation
                    ? "ring-4 ring-yellow-400"
                    : ""
                }`}
              >
                {square ? (
                  <span
                    className={`text-2xl font-bold ${
                      square.color === "w"
                        ? "text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]"
                        : "text-black"
                    }`}
                  >
                    {square.color === "w"
                      ? square.type.toUpperCase()
                      : square.type.toLowerCase()}
                  </span>
                ) : null}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};
