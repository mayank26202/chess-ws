import { useEffect, useRef, useState } from "react";
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

  const moveListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (moveListRef.current) {
      moveListRef.current.scrollTo({
        top: moveListRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [moves]);

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event: MessageEvent) => {
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
          }
          break;
        }
        case GAME_OVER: {
          setWinner(message.payload?.winner || "Draw");
          setGameStarted(false);
          break;
        }
      }
    };

    socket.onmessage = handleMessage;
    return () => {
      socket.onmessage = null;
    };
  }, [socket, chess]);

  if (!socket)
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-white text-lg sm:text-xl font-semibold text-center px-4">
          Connecting to server...
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col overflow-hidden">
      {/* Header */}
      <div className="py-4 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold mb-1 flex items-center justify-center gap-2 sm:gap-3">
          EndGame - Chess App
        </h1>
        <p className="text-gray-400 text-xs sm:text-sm">
          Real-time multiplayer chess
        </p>
      </div>

      <div className="flex-1 w-full max-w-7xl mx-auto px-2 sm:px-4 pb-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
          {/* Chessboard Section */}
          <div className="lg:col-span-2 flex flex-col h-full">
            <div className="bg-slate-800 rounded-xl p-3 sm:p-4 shadow-xl flex-1 flex flex-col overflow-hidden">
              {/* Game Status */}
              {gameStarted ? (
                <div className="mb-3 sm:mb-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2 sm:gap-3 bg-slate-700 px-3 sm:px-4 py-2 rounded-full w-full sm:w-auto justify-center">
                    <FaCircle className="text-xs text-green-400 animate-pulse" />
                    <span className="font-semibold text-sm">
                      Playing as: {playerColor === "w" ? "White ⚪" : "Black ⚫"}
                    </span>
                  </div>
                  <div className="bg-slate-700 px-3 sm:px-4 py-2 rounded-full text-center w-full sm:w-auto">
                    <span
                      className={`font-bold text-sm ${
                        turn === playerColor ? "text-green-400" : "text-gray-400"
                      }`}
                    >
                      {turn === "w" ? "White's Turn" : "Black's Turn"}
                      {turn === playerColor && " 🎯"}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="mb-4 flex items-center justify-center">
                  <div className="flex items-center gap-2 bg-slate-700 px-4 py-2 sm:px-6 sm:py-3 rounded-full text-center">
                    <FaCircle className="text-xs text-yellow-400 animate-pulse" />
                    <span className="font-semibold text-sm text-gray-300">
                      Waiting for another player to join...
                    </span>
                  </div>
                </div>
              )}

              {/* Chessboard */}
              <div className="flex justify-center items-center flex-1 w-full">
                <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-full">
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
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 flex flex-col h-full">
            <div className="bg-slate-800 rounded-xl shadow-xl flex flex-col h-full overflow-hidden">
              <div className="p-3 sm:p-4 border-b border-slate-700">
                <button
                  onClick={() => socket?.send(JSON.stringify({ type: INIT_GAME }))}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-xl shadow-lg transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base"
                >
                  <FaPlay />
                  {gameStarted ? "New Game" : "Start Game"}
                </button>
              </div>

              {/* Stats */}
              <div className="p-3 sm:p-4 border-b border-slate-700">
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <div className="bg-slate-900 rounded-lg p-2 sm:p-3 text-center">
                    <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">
                      Moves
                    </p>
                    <p className="text-white font-bold text-lg sm:text-xl">
                      {moves.length}
                    </p>
                  </div>
                  <div className="bg-slate-900 rounded-lg p-2 sm:p-3 text-center">
                    <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">
                      Status
                    </p>
                    <p
                      className={`font-bold text-lg sm:text-xl ${
                        gameStarted ? "text-green-400" : "text-gray-400"
                      }`}
                    >
                      {gameStarted ? "Live" : "Idle"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Move History */}
              <div className="p-3 sm:p-4 flex-1 flex flex-col overflow-hidden">
                <h2 className="font-bold text-base mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  Move History
                </h2>
                <div
                  ref={moveListRef}
                  className="bg-slate-900 rounded-xl p-3 flex-1 overflow-y-auto max-h-[250px] sm:max-h-[300px] custom-scrollbar"
                >
                  {moves.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-4 sm:py-6">
                      No moves yet. Start playing!
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {moves.map((m, i) => (
                        <div
                          key={i}
                          className={`flex items-center gap-2 sm:gap-3 p-2 rounded-lg transition-all ${
                            i === moves.length - 1
                              ? "bg-blue-500/20 border-l-4 border-blue-400"
                              : "bg-slate-800 hover:bg-slate-700"
                          }`}
                        >
                          <span className="text-gray-400 font-mono text-xs font-bold min-w-6 sm:min-w-8">
                            {Math.floor(i / 2) + 1}.
                          </span>
                          <span className="text-white text-sm font-medium flex-1">
                            {m}
                          </span>
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
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 max-w-sm sm:max-w-md w-full border-2 border-yellow-400 relative">
            <button
              onClick={() => setWinner(null)}
              className="absolute top-2 right-3 text-gray-400 hover:text-white transition-colors text-2xl sm:text-3xl font-bold"
            >
              ×
            </button>
            <div className="text-center">
              <FaCrown className="inline-block text-5xl sm:text-6xl text-yellow-400 mb-3 sm:mb-4 animate-bounce" />
              <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3 text-white">
                Game Over!
              </h2>
              <p className="text-lg sm:text-xl text-gray-300">
                Winner:{" "}
                <span className="uppercase font-black text-yellow-400 text-xl sm:text-2xl">
                  {winner}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
