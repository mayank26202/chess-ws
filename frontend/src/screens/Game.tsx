import { useEffect, useState } from "react";
import { ChessBoard } from "../components/ChessBoard";
import { useSocket } from "../hooks/useSocket";
import { Chess } from "chess.js";

export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "GAME_OVER";

export const Game = () => {
  const socket = useSocket();
  const [chess] = useState(() => new Chess());
  const [board, setBoard] = useState(chess.board());
  const [fen, setFen] = useState(chess.fen());
  const [moves, setMoves] = useState<string[]>([]);
  const [playerColor, setPlayerColor] = useState<"w" | "b">("w");
  const [turn, setTurn] = useState<"w" | "b">("w");
  const [winner, setWinner] = useState<string | null>(null);

  useEffect(() => {
    if (!socket) return;

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("WS message:", message);

      switch (message.type) {
        case INIT_GAME: {
          const serverColor = message.payload?.color;
          const mapped: "w" | "b" = serverColor === "black" ? "b" : "w";
          setPlayerColor(mapped);

          chess.reset();
          setBoard(chess.board());
          setFen(chess.fen());
          setTurn(chess.turn());
          setMoves([]);
          setWinner(null);
          console.log("Game Initialized, you are", serverColor);
          break;
        }

        case MOVE: {
          const move = message.payload;
          const res = chess.move(move);
          if (res) {
            setBoard(chess.board());
            setFen(chess.fen());
            setMoves((prev) => [...prev, `${move.from} → ${move.to}`]);
            setTurn(chess.turn());
            console.log("Remote Move applied:", move);
          } else {
            console.warn("Backend sent invalid move:", move);
          }
          break;
        }

        case GAME_OVER: {
          console.log("Game Over", message.payload);
          setWinner(message.payload?.winner || "Draw");
          break;
        }

        default:
          console.log("Unknown message type:", message.type);
      }
    };
  }, [socket, chess]);

  if (!socket)
    return <div className="text-white p-6 text-center">Connecting...</div>;

  return (
    <div className="flex justify-center min-h-screen bg-slate-900 text-white">
      <div className="pt-8 max-w-5xl w-full">
        <div className="grid grid-cols-6 gap-4">
          {/* Chessboard */}
          <div className="col-span-4 w-full flex flex-col items-center">
            <h2 className="text-lg font-semibold mb-2">
              You are {playerColor === "w" ? "White" : "Black"}
            </h2>
            <p className="text-sm text-gray-300 mb-2">
              Turn: {turn === "w" ? "White" : "Black"}
            </p>

            <ChessBoard
              socket={socket}
              board={board}
              fen={fen}
              playerColor={playerColor}
              turn={turn}
              onMove={(move) => {
                const result = chess.move(move);
                if (result) {
                  setBoard(chess.board());
                  setFen(chess.fen());
                  setMoves((prev) => [...prev, `${move.from} → ${move.to}`]);
                  setTurn(chess.turn());

                  socket.send(
                    JSON.stringify({
                      type: MOVE,
                      payload: { move },
                    })
                  );
                } else {
                  console.warn("Tried to apply illegal move locally:", move);
                }
              }}
            />

            {winner && (
              <div className="mt-6 text-xl font-bold text-green-400">
                🎉 Game Over! Winner:{" "}
                <span className="uppercase">{winner}</span>
              </div>
            )}
          </div>

          {/* Right panel */}
          <div className="col-span-2 bg-slate-800 rounded-2xl w-full flex flex-col items-center shadow-lg">
            <div className="pt-8">
              <button
                onClick={() => {
                  socket?.send(JSON.stringify({ type: INIT_GAME }));
                }}
                className="bg-green-500 hover:bg-green-600 text-black font-bold py-3 px-8 rounded text-lg"
              >
                Play
              </button>
            </div>

            {/* Move list */}
            <div className="pt-8 text-left w-full px-4">
              <h2 className="font-bold text-lg mb-2">Moves:</h2>
              <div className="bg-slate-700 rounded p-3 max-h-64 overflow-y-auto">
                {moves.length === 0 ? (
                  <p className="text-gray-400 text-sm">No moves yet</p>
                ) : (
                  <ul className="space-y-1">
                    {moves.map((m, i) => (
                      <li key={i} className="text-sm">{`${i + 1}. ${m}`}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
