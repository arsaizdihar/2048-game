import type { NextPage } from "next";
import Hammer from "react-hammerjs";
import Block from "~/game/Block";
import useGame from "~/game/useGame";

const Home: NextPage = () => {
  const { blocks, onSwipe, restart } = useGame();
  return (
    <main className="w-screen h-screen flex flex-col justify-center items-center">
      <h1 className="text-center text-4xl font-bold">2048</h1>
      <Hammer onSwipe={onSwipe} direction="DIRECTION_ALL">
        <div className="w-full max-w-screen-sm bg-[#BBADA0] p-2 select-none aspect-square relative text-2xl font-bold">
          <div className="relative aspect-square">
            {blocks.map((block) => (
              <Block
                key={block.id}
                number={block.value}
                row={block.row}
                col={block.col}
                isNew={block.isNew}
              />
            ))}
          </div>
        </div>
      </Hammer>
      <button
        onClick={restart}
        className="bg-[#8F7A66] rounded-md p-4 text-white font-bold mt-2"
      >
        RESTART
      </button>
    </main>
  );
};

export default Home;
