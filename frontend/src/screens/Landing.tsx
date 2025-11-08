import { useNavigate } from "react-router-dom";

export const Landing = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen text-white px-6 pt-10 font-['Lexend_Deca']">
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-12 max-w-6xl">
        <div className="flex justify-center">
          <img
            src={"/chessboard.png"}
            alt="chessboard"
            className="w-80 md:w-[400px]"
          />
        </div>

        <div className="text-center md:text-left space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Play Chess Online <br />
            <span className="text-green-500">on the #2 Platform!</span>
          </h1>

          <div className="pt-4">
            <button onClick={() => { navigate("/game") }} className="bg-green-500 hover:bg-green-600 text-black font-bold py-3 px-8 rounded text-lg">
              Play Online
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
