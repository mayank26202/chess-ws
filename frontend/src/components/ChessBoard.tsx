import type { Color, PieceSymbol, Square } from "chess.js";
import { useState, useMemo } from "react";
import { Chess } from "chess.js";
import {
  GiChessKing,
  GiChessQueen,
  GiChessRook,
  GiChessBishop,
  GiChessKnight,
  GiChessPawn,
} from "react-icons/gi";

// ♟️ Chess piece icon component
const ChessPiece = ({ type, color }: { type: PieceSymbol; color: Color }) => {
  const iconProps = {
    size: 36, // slightly smaller for mobile
    className:
      color === "w"
        ? "text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
        : "text-gray-900 drop-shadow-[0_1px_2px_rgba(255,255,255,0.3)]",
  };

  switch (type) {
    case "k":
      return <GiChessKing {...iconProps} />;
    case "q":
      return <GiChessQueen {...iconProps} />;
    case "r":
      return <GiChessRook {...iconProps} />;
    case "b":
      return <GiChessBishop {...iconProps} />;
    case "n":
      return <GiChessKnight {...iconProps} />;
    case "p":
      return <GiChessPawn {...iconProps} />;
    default:
      return null;
  }
};

export const ChessBoard = ({
  board,
  fen,
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
  const [validMoves, setValidMoves] = useState<Square[]>([]);
  const chess = useMemo(() => new Chess(fen), [fen]);

  const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
  const ranks = [8, 7, 6, 5, 4, 3, 2, 1];
  const allSquares: Square[][] = ranks.map((r) =>
    files.map((f) => `${f}${r}` as Square)
  );

  const renderBoard =
    playerColor === "b"
      ? [...board].reverse().map((r) => [...r].reverse())
      : board;

  const renderSquares =
    playerColor === "b"
      ? [...allSquares].reverse().map((r) => [...r].reverse())
      : allSquares;

  const handleClick = (sq: Square, piece: any) => {
    if (from === sq) {
      setFrom(null);
      setValidMoves([]);
      return;
    }

    if (!from && piece && piece.color === playerColor) {
      setFrom(sq);
      const moves = chess.moves({ square: sq, verbose: true });
      setValidMoves(moves.map((m) => m.to as Square));
      return;
    }

    if (turn !== playerColor) {
      console.log("⏳ Not your turn");
      setFrom(null);
      setValidMoves([]);
      return;
    }

    if (from) {
      const temp = new Chess(fen);
      const move = temp.move({ from, to: sq });
      if (move) onMove({ from, to: sq });
      setFrom(null);
      setValidMoves([]);
      return;
    }

    setFrom(null);
    setValidMoves([]);
  };

  return (
    <div
      className="
        inline-block 
        border-4 sm:border-8 
        border-gray-800 
        rounded-xl 
        shadow-2xl 
        overflow-hidden 
        bg-gray-800
        w-full 
        max-w-[90vw] sm:max-w-[80vw] md:max-w-[600px] lg:max-w-[700px]
        aspect-square
      "
    >
      {renderBoard.map((row, i) => (
        <div key={i} className="flex w-full h-[12.5%]">
          {row.map((cell, j) => {
            const sq = renderSquares[i][j];
            const dark = (i + j) % 2 === 1;
            const isSelected = from === sq;
            const isValidMove = validMoves.includes(sq);
            const lastRank = playerColor === "w" ? i === 7 : i === 0;
            const firstFile = j === 0;

            return (
              <div
                key={sq}
                onClick={() => handleClick(sq, cell)}
                className={`
                  flex-1
                  flex 
                  justify-center 
                  items-center 
                  cursor-pointer 
                  select-none 
                  transition-all 
                  relative 
                  text-[clamp(24px,4vw,40px)] 
                  ${dark ? "bg-teal-700" : "bg-teal-100"}
                  ${isSelected ? "ring-4 ring-inset ring-yellow-400" : ""}
                  ${isValidMove && !cell ? "after:content-[''] after:absolute after:w-3 sm:after:w-4 after:h-3 sm:after:h-4 after:bg-green-500 after:rounded-full after:opacity-70" : ""}
                  ${isValidMove && cell ? "ring-4 ring-inset ring-red-400 ring-opacity-60" : ""}
                  hover:brightness-110
                `}
              >
                {cell && <ChessPiece type={cell.type} color={cell.color} />}

                {/* Rank labels (numbers) */}
                {firstFile && (
                  <span
                    className={`absolute left-1 top-1 text-[0.6rem] sm:text-xs font-bold ${
                      dark ? "text-amber-100" : "text-amber-700"
                    }`}
                  >
                    {playerColor === "w" ? 8 - i : i + 1}
                  </span>
                )}

                {/* File labels (letters) */}
                {lastRank && (
                  <span
                    className={`absolute right-1 bottom-1 text-[0.6rem] sm:text-xs font-bold ${
                      dark ? "text-amber-100" : "text-amber-700"
                    }`}
                  >
                    {files[playerColor === "w" ? j : 7 - j]}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};
