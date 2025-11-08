import { useEffect, useState } from "react";
import { ChessBoard } from "../components/ChessBoard";
import { useSocket } from "../hooks/useSocket";
import { Chess } from "chess.js";
import { FaCrown, FaPlay, FaCircle } from "react-icons/fa";

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
  const [gameStarted, setGameStarted] = useState(false);

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
          setGameStarted(true);

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
          setGameStarted(false);
          break;
        }

        default:
          console.log("Unknown message type:", message.type);
      }
    };
  }, [socket, chess]);

  if (!socket)
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-white text-xl font-semibold">Connecting to server...</div>
      </div>
    );

  return (
    <div className="h-screen bg-slate-900 text-white overflow-hidden flex flex-col">
      {/* Header */}
      <div className="py-4 text-center shrink-0">
        <h1 className="text-3xl font-bold mb-1 flex items-center justify-center gap-3">
          EndGame - Chess App
        </h1>
        <p className="text-gray-400 text-sm">Real-time multiplayer chess</p>
      </div>

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 pb-4 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
          {/* Chessboard Section */}
          <div className="lg:col-span-2 flex flex-col h-full">
            <div className="bg-slate-800 rounded-xl p-4 shadow-xl flex-1 flex flex-col overflow-hidden">
              {/* Game Status Bar */}
              {gameStarted ? (
                <div className="mb-4 flex items-center justify-between flex-wrap gap-3 shrink-0">
                  <div className="flex items-center gap-3 bg-slate-700 px-4 py-2 rounded-full">
                    <FaCircle className="text-xs text-green-400 animate-pulse" />
                    <span className="font-semibold text-sm">
                      Playing as: {playerColor === "w" ? "White ⚪" : "Black ⚫"}
                    </span>
                  </div>
                  
                  <div className="bg-slate-700 px-4 py-2 rounded-full">
                    <span className={`font-bold text-sm ${turn === playerColor ? 'text-green-400' : 'text-gray-400'}`}>
                      {turn === "w" ? "White's Turn" : "Black's Turn"}
                      {turn === playerColor && " 🎯"}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="mb-4 flex items-center justify-center shrink-0">
                  <div className="flex items-center gap-3 bg-slate-700 px-6 py-3 rounded-full">
                    <FaCircle className="text-xs text-yellow-400 animate-pulse" />
                    <span className="font-semibold text-sm text-gray-300">
                      Waiting for another player to join...
                    </span>
                  </div>
                </div>
              )}

              {/* Chessboard */}
              <div className="flex justify-center items-center flex-1">
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
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 flex flex-col h-full">
            <div className="bg-slate-800 rounded-xl shadow-xl flex flex-col h-full overflow-hidden">
              {/* Start Game Button */}
              <div className="p-4 border-b border-slate-700 shrink-0">
                <button
                  onClick={() => {
                    socket?.send(JSON.stringify({ type: INIT_GAME }));
                  }}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
                >
                  <FaPlay className="text-sm" />
                  {gameStarted ? "New Game" : "Start Game"}
                </button>
              </div>

              {/* Game Stats */}
              <div className="p-4 border-b border-slate-700 shrink-0">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-900 rounded-lg p-3 text-center">
                    <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Moves</p>
                    <p className="text-white font-bold text-xl">{moves.length}</p>
                  </div>
                  <div className="bg-slate-900 rounded-lg p-3 text-center">
                    <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Status</p>
                    <p className={`font-bold text-xl ${gameStarted ? 'text-green-400' : 'text-gray-400'}`}>
                      {gameStarted ? 'Live' : 'Idle'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Move History */}
              <div className="p-4 flex-1 flex flex-col overflow-hidden">
                <h2 className="font-bold text-base mb-3 flex items-center gap-2 shrink-0">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  Move History
                </h2>
                <div className="bg-slate-900 rounded-xl p-3 flex-1 overflow-y-auto custom-scrollbar">
                  {moves.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-6">
                      No moves yet. Start playing!
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {moves.map((m, i) => (
                        <div
                          key={i}
                          className={`flex items-center gap-3 p-2 rounded-lg transition-all ${
                            i === moves.length - 1
                              ? "bg-blue-500/20 border-l-4 border-blue-400"
                              : "bg-slate-800 hover:bg-slate-700"
                          }`}
                        >
                          <span className="text-gray-400 font-mono text-xs font-bold min-w-8">
                            {Math.floor(i / 2) + 1}.
                          </span>
                          <span className="text-white text-sm font-medium flex-1">{m}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Winner Modal */}
      {winner && (
        <div className="fixed bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 relative border-2 border-yellow-400">
            <button
              onClick={() => setWinner(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors text-3xl font-bold leading-none w-8 h-8 flex items-center justify-center"
            >
              ×
            </button>
            <div className="text-center">
              <FaCrown className="inline-block text-6xl text-yellow-400 mb-4 animate-bounce" />
              <h2 className="text-3xl font-bold mb-3 text-white">Game Over!</h2>
              <p className="text-xl text-gray-300">
                Winner: <span className="uppercase font-black text-yellow-400 text-2xl">{winner}</span>
              </p>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.7);
        }
      `}</style>
    </div>
  );
};