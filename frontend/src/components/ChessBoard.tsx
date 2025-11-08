import type { Color, PieceSymbol, Square } from "chess.js";
import { useState, useMemo } from "react";
import { Chess } from "chess.js";

export const ChessBoard = ({
  board,
  fen,
  socket,
  onMove,
  playerColor,
  turn,
}: {
  board: (
    | {
        square: Square;
        type: PieceSymbol;
        color: Color;
      }
    | null
  )[][];
  fen: string;
  socket: WebSocket;
  onMove: (move: { from: Square; to: Square }) => void;
  playerColor: "w" | "b";
  turn: "w" | "b";
}) => {
  const [from, setFrom] = useState<null | Square>(null);

  const chess = useMemo(() => new Chess(fen), [fen]);

  // coordinate setup
  const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
  const ranks = [8, 7, 6, 5, 4, 3, 2, 1];
  const allSquares: Square[][] = ranks.map((r) =>
    files.map((f) => `${f}${r}` as Square)
  );

  const renderBoard =
    playerColor === "b" ? [...board].reverse().map((r) => [...r].reverse()) : board;

  const renderSquares =
    playerColor === "b"
      ? [...allSquares].reverse().map((r) => [...r].reverse())
      : allSquares;

  const handleClick = (sq: Square, piece: any) => {
    // deselect same square
    if (from === sq) {
      setFrom(null);
      return;
    }

    // reselect another of your own pieces
    if (!from && piece && piece.color === playerColor) {
      setFrom(sq);
      return;
    }

    // prevent move when not your turn
    if (turn !== playerColor) {
      console.log("⏳ Not your turn");
      setFrom(null);
      return;
    }

    if (from) {
      // validate move via chess.js
      const temp = new Chess(fen);
      const move = temp.move({ from, to: sq });

      if (move) {
        onMove({ from, to: sq });
      } else {
        console.log("❌ Invalid move:", { from, to: sq });
      }
      setFrom(null);
      return;
    }

    // clicking empty square without selecting a piece does nothing
    setFrom(null);
  };

  return (
    <div className="text-black border-4 border-gray-700 inline-block rounded-lg overflow-hidden">
      {renderBoard.map((row, i) => (
        <div key={i} className="flex">
          {row.map((cell, j) => {
            const sq = renderSquares[i][j];
            const dark = (i + j) % 2 === 1;
            const isSelected = from === sq;
            return (
              <div
                key={sq}
                onClick={() => handleClick(sq, cell)}
                className={`w-16 h-16 flex justify-center items-center cursor-pointer select-none transition-all
                  ${dark ? "bg-green-700" : "bg-green-200"}
                  ${isSelected ? "ring-4 ring-yellow-400" : ""}
                `}
              >
                {cell ? (
                  <span
                    className={`text-2xl font-bold ${
                      cell.color === "w"
                        ? "text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
                        : "text-black"
                    }`}
                  >
                    {cell.color === "w"
                      ? cell.type.toUpperCase()
                      : cell.type.toLowerCase()}
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
