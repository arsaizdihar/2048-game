import classNames from "classnames";
import React, { useEffect, useState } from "react";

const colors = {
  2: ["#776E65", "#EEE4DA"],
  4: ["#776E65", "#EDE0C8"],
  8: ["#F9F6F2", "#F2B179"],
  16: ["#F9F6F2", "#F59563"],
  32: ["#F9F6F2", "#F67C5F"],
  64: ["#F9F6F2", "#F65E3B"],
  128: ["#F9F6F2", "#EDCF72"],
  256: ["#F9F6F2", "#EDCC61"],
  512: ["#F9F6F2", "#EDC850"],
  1024: ["#F9F6F2", "#EDC53F"],
  2048: ["#F9F6F2", "#EDC22E"],
};
// border-r-8 first:border-l-8 border-[#BBADA0]

function Block({
  number,
  row,
  col,
  isNew = false,
}: {
  number: number;
  row: number;
  col: number;
  isNew?: boolean;
}) {
  const color = colors[number as keyof typeof colors] || [
    "#776E65",
    "transparent",
  ];
  const [animation, setAnimation] = useState(false);

  useEffect(() => {
    if (isNew) {
      setAnimation(true);
      setTimeout(() => setAnimation(false), 10);
    }
  }, [isNew]);
  return (
    <div
      className={classNames(
        "w-1/4 h-1/4 absolute p-1",
        row === 0 && "top-0",
        row === 1 && "top-1/4",
        row === 2 && "top-1/2",
        row === 3 && "top-3/4",
        col === 0 && "left-0",
        col === 1 && "left-1/4",
        col === 2 && "left-1/2",
        col === 3 && "left-3/4",
        number !== 0 && "duration-100 z-10"
      )}
    >
      <div
        className={classNames(
          "aspect-square flex justify-center items-center rounded-md scale-only bg-[#CDC1B4]"
        )}
      >
        <div
          className={classNames(
            "w-full h-full flex justify-center items-center rounded-md",
            animation
              ? "scale-50 transition-none"
              : "scale-100 duration-100 scale-only"
          )}
          style={{ color: color[0], backgroundColor: color[1] }}
        >
          {number !== 0 ? number : null}
        </div>
      </div>
    </div>
  );
}

export default Block;
