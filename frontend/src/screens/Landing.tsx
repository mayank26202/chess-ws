import { useNavigate } from "react-router-dom";
import { FaChess, FaTrophy } from "react-icons/fa";

export const Landing = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-slate-900 text-white overflow-x-hidden flex flex-col">
      {/* Header */}
      <div className="py-4 sm:py-6 text-center shrink-0 px-4">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold flex items-center justify-center gap-2 sm:gap-3">
          EndGame - Chess App
        </h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-8 sm:gap-10 lg:gap-12 max-w-6xl w-full">
          {/* Chessboard Image */}
          <div className="flex justify-center order-1 lg:order-1">
            <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
              <img
                src={"/chessboard.png"}
                alt="chessboard"
                className="w-full rounded-xl sm:rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 bg-yellow-400 text-slate-900 rounded-full w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center shadow-xl">
                <FaTrophy className="text-2xl sm:text-3xl md:text-4xl" />
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="text-center lg:text-left space-y-4 sm:space-y-6 lg:space-y-8 order-2 lg:order-2">
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-2 sm:mb-3 lg:mb-4">
                Play Chess Online
              </h2>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-400">
                on the #2 Platform!
              </p>
            </div>

            <p className="text-gray-400 text-base sm:text-lg max-w-md mx-auto lg:mx-0 px-4 sm:px-0">
              Challenge players worldwide in real-time multiplayer matches. 
              Sharpen your skills and climb the ranks!
            </p>

            {/* Features */}
            <div className="flex flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start px-4 sm:px-0">
              <div className="bg-slate-800 px-3 py-2 sm:px-4 sm:py-2 rounded-full flex items-center gap-2">
                <FaChess className="text-green-400 text-sm sm:text-base" />
                <span className="text-xs sm:text-sm font-semibold">Real-time Play</span>
              </div>
              <div className="bg-slate-800 px-3 py-2 sm:px-4 sm:py-2 rounded-full flex items-center gap-2">
                <FaTrophy className="text-yellow-400 text-sm sm:text-base" />
                <span className="text-xs sm:text-sm font-semibold">Competitive</span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-2 sm:pt-4 px-4 sm:px-0">
              <button 
                onClick={() => { navigate("/game") }} 
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 sm:py-4 sm:px-12 rounded-xl text-lg sm:text-xl shadow-lg transition-all transform hover:scale-105 active:scale-95 w-full sm:w-auto"
              >
                Play Online Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="py-3 sm:py-4 text-center text-gray-500 text-xs sm:text-sm shrink-0 px-4">
        <p>© 2025 EndGame - Chess App. The ultimate online chess experience.</p>
      </div>
    </div>
  );
};