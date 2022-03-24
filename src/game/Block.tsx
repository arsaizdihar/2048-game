import React from "react";

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

function Block({ number }: { number: number }) {
  const color = colors[number as keyof typeof colors] || ["#EDC22E", "#EDC22E"];
  return (
    <div
      className="aspect-square flex justify-center items-center border-r-8 first:border-l-8 border-[#BBADA0]"
      style={number !== 0 ? { color: color[0], backgroundColor: color[1] } : {}}
    >
      {number !== 0 ? number : null}
    </div>
  );
}

export default Block;
