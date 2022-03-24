import { useEffect, useState } from "react";
import { GameBlocks } from "./type";

export default function useGame() {
  const [blocks, setBlocks] = useState<GameBlocks>([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);

  function restart() {
    const blocks: GameBlocks = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    const col = randomInt(0, 3);
    const row = randomInt(0, 3);
    const value = randomInt(1, 2) * 2;
    blocks[row][col] = value;
    setBlocks(blocks);
  }

  useEffect(() => {
    try {
      const storedBox = JSON.parse(localStorage.getItem("blocks") ?? "");
      if (Array.isArray(storedBox) && storedBox.length === 4) {
        for (const row of storedBox) {
          if (Array.isArray(row) && row.length === 4) {
            for (const block of row) {
              if (typeof block !== "number") {
                throw new Error("Invalid blocks");
              }
            }
          }
        }
      } else {
        throw new Error("Invalid blocks");
      }
      setBlocks(storedBox as any);
      saveGame(storedBox as any);
      return;
    } catch (e) {}
    const col = randomInt(0, 3);
    const row = randomInt(0, 3);
    const value = randomInt(1, 2) * 2;
    setBlocks((blocks) => {
      const newBlocks = blocks.map((row) => [...row]) as GameBlocks;
      newBlocks[row][col] = value;
      saveGame(newBlocks);
      return newBlocks;
    });
  }, []);

  const onSwipe: HammerListener = (event) => {
    const newBlocks = blocks.map((row) => [...row]) as GameBlocks;
    switch (event.direction) {
      case 2: // left
        for (let i = 0; i < 4; i++) {
          for (let j = 1; j < 4; j++) {
            if (newBlocks[i][j] !== 0) {
              let newPos = -1;
              let isAdd = false;
              for (let k = j - 1; k >= 0; k--) {
                if (newBlocks[i][k] === 0) {
                  newPos = k;
                } else if (newBlocks[i][k] === newBlocks[i][j]) {
                  newPos = k;
                  isAdd = true;
                } else {
                  break;
                }
              }
              if (newPos !== -1) {
                newBlocks[i][newPos] = isAdd
                  ? newBlocks[i][j] * 2
                  : newBlocks[i][j];
                newBlocks[i][j] = 0;
              }
            }
          }
        }
        break;
      case 4: // right
        for (let i = 0; i < 4; i++) {
          for (let j = 2; j >= 0; j--) {
            if (newBlocks[i][j] !== 0) {
              let newPos = -1;
              let isAdd = false;
              for (let k = j + 1; k < 4; k++) {
                if (newBlocks[i][k] === 0) {
                  newPos = k;
                } else if (newBlocks[i][k] === newBlocks[i][j]) {
                  newPos = k;
                  isAdd = true;
                } else {
                  break;
                }
              }
              if (newPos !== -1) {
                newBlocks[i][newPos] = isAdd
                  ? newBlocks[i][j] * 2
                  : newBlocks[i][j];
                newBlocks[i][j] = 0;
              }
            }
          }
        }
        break;
      case 8: // up
        for (let i = 0; i < 4; i++) {
          for (let j = 1; j < 4; j++) {
            if (newBlocks[j][i] !== 0) {
              let newPos = -1;
              let isAdd = false;
              for (let k = j - 1; k >= 0; k--) {
                if (newBlocks[k][i] === 0) {
                  newPos = k;
                } else if (newBlocks[k][i] === newBlocks[j][i]) {
                  newPos = k;
                  isAdd = true;
                } else {
                  break;
                }
              }
              if (newPos !== -1) {
                newBlocks[newPos][i] = isAdd
                  ? newBlocks[j][i] * 2
                  : newBlocks[j][i];
                newBlocks[j][i] = 0;
              }
            }
          }
        }
        break;
      case 16: // dowm
        for (let i = 0; i < 4; i++) {
          for (let j = 2; j >= 0; j--) {
            if (newBlocks[j][i] !== 0) {
              let newPos = -1;
              let isAdd = false;
              for (let k = j + 1; k < 4; k++) {
                if (newBlocks[k][i] === 0) {
                  newPos = k;
                } else if (newBlocks[k][i] === newBlocks[j][i]) {
                  newPos = k;
                  isAdd = true;
                } else {
                  break;
                }
              }
              if (newPos !== -1) {
                newBlocks[newPos][i] = isAdd
                  ? newBlocks[j][i] * 2
                  : newBlocks[j][i];
                newBlocks[j][i] = 0;
              }
            }
          }
        }
        break;
      default:
        break;
    }
    const indexes = getZeroIndex(newBlocks);
    if (indexes.length > 0) {
      const index = randomInt(0, indexes.length - 1);
      newBlocks[indexes[index][0]][indexes[index][1]] = randomInt(1, 2) * 2;
    }
    setBlocks(newBlocks);
    saveGame(newBlocks);
  };

  return { blocks, setBlocks, onSwipe, restart };
}

function getZeroIndex(blocks: GameBlocks) {
  const zeroIndex = [];
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (blocks[i][j] === 0) {
        zeroIndex.push([i, j]);
      }
    }
  }
  return zeroIndex;
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function saveGame(blocks: GameBlocks) {
  localStorage.setItem("blocks", JSON.stringify(blocks));
}
