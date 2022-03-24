import type { NextPage } from "next";
import Hammer from "react-hammerjs";
import Block from "~/game/Block";
import useGame from "~/game/useGame";

const Home: NextPage = () => {
  const { blocks, onSwipe } = useGame();
  return (
    <main className="w-screen h-screen flex justify-center items-center">
      <Hammer onSwipe={onSwipe} direction="DIRECTION_ALL">
        <div className="w-full max-w-screen-sm bg-[#CDC1B4] p-4 select-none">
          <h1 className="text-center text-4xl font-bold">2048</h1>
          <div className="font-medium text-4xl">
            {blocks.map((row, rowIdx) => (
              <div
                key={rowIdx}
                className="grid grid-cols-4 border-b-8 first:border-t-8 border-[#BBADA0]"
              >
                {row.map((block, blockIdx) => (
                  <Block key={blockIdx} number={block} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </Hammer>
    </main>
  );
};

export default Home;
