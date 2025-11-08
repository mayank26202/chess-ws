import { useNavigate } from "react-router-dom";
import { FaChess, FaTrophy } from "react-icons/fa";

export const Landing = () => {
  const navigate = useNavigate();
  
  return (
    <div className="h-screen bg-slate-900 text-white overflow-hidden flex flex-col">
      {/* Header */}
      <div className="py-6 text-center shrink-0">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-3">
          EndGame - Chess App
        </h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 max-w-6xl w-full">
          {/* Chessboard Image */}
          <div className="flex justify-center">
            <div className="relative">
              <img
                src={"/chessboard.png"}
                alt="chessboard"
                className="w-80 md:w-[450px] rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-4 -right-4 bg-yellow-400 text-slate-900 rounded-full w-24 h-24 flex items-center justify-center shadow-xl">
                <FaTrophy className="text-4xl" />
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="text-center lg:text-left space-y-8">
            <div>
              <h2 className="text-5xl md:text-6xl font-extrabold leading-tight mb-4">
                Play Chess Online
              </h2>
              <p className="text-3xl md:text-4xl font-bold text-green-400">
                on the #2 Platform!
              </p>
            </div>

            <p className="text-gray-400 text-lg max-w-md mx-auto lg:mx-0">
              Challenge players worldwide in real-time multiplayer matches. 
              Sharpen your skills and climb the ranks!
            </p>

            {/* Features */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <div className="bg-slate-800 px-4 py-2 rounded-full flex items-center gap-2">
                <FaChess className="text-green-400" />
                <span className="text-sm font-semibold">Real-time Play</span>
              </div>
              <div className="bg-slate-800 px-4 py-2 rounded-full flex items-center gap-2">
                <FaTrophy className="text-yellow-400" />
                <span className="text-sm font-semibold">Competitive</span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <button 
                onClick={() => { navigate("/game") }} 
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-12 rounded-xl text-xl shadow-lg transition-all transform hover:scale-105 active:scale-95"
              >
                Play Online Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="py-4 text-center text-gray-500 text-sm shrink-0">
        <p>© 2025 EndGame - Chess App. The ultimate online chess experience.</p>
      </div>
    </div>
  );
};