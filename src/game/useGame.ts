import { useEffect, useMemo, useState } from "react";
import { GameBlocks } from "./type";

function getRowAndCol(i: number) {
  return [Math.floor(i / 4), i % 4];
}

function swap(arr: any[], first: any, second: any) {
  const temp = arr[first];
  arr[first] = arr[second];
  arr[second] = temp;
}

function newBlocks(): GameBlocks {
  const blocks: GameBlocks = [];
  for (let i = 0; i < 16; i++) {
    blocks[i] = { id: i, value: 0 };
  }
  return blocks;
}

function getIndex(i: number, j: number) {
  return i * 4 + j;
}

function copyBlocks(blocks: GameBlocks): GameBlocks {
  return blocks.map((block) => ({ ...block }));
}

function isBlock(blocks: any) {
  if (!Array.isArray(blocks) || blocks.length !== 16) {
    return false;
  }
  for (let i = 0; i < 16; i++) {
    if (typeof blocks[i] !== "object") {
      return false;
    }
    if (
      typeof blocks[i].id !== "number" ||
      typeof blocks[i].value !== "number" ||
      typeof blocks[i].row !== "number" ||
      typeof blocks[i].col !== "number"
    ) {
      return false;
    }
  }
  return true;
}

export default function useGame() {
  const [blocks, setBlocks] = useState<GameBlocks>(newBlocks());
  const sortedBlocks = useMemo(() => {
    const sortedBlocks = copyBlocks(blocks).map((block, index) => {
      const [row, col] = getRowAndCol(index);
      return { ...block, row, col };
    });
    sortedBlocks.sort((a, b) => a.id - b.id);
    return sortedBlocks;
  }, [blocks]);

  const [gameOver, setGameOver] = useState(false);

  function restart() {
    const blocks: GameBlocks = newBlocks();
    addRandom(blocks);
    addRandom(blocks);
    saveGame(blocks);
    setBlocks(blocks);
  }

  useEffect(() => {
    function listener(e: KeyboardEvent) {
      if (gameOver) return;
      setBlocks((blocks) => {
        let newBlocks = copyBlocks(blocks);
        let isMoved = false;
        switch (e.key) {
          case "ArrowUp":
            isMoved = up(newBlocks);
            break;
          case "ArrowDown":
            isMoved = down(newBlocks);
            break;
          case "ArrowLeft":
            isMoved = left(newBlocks);
            break;
          case "ArrowRight":
            isMoved = right(newBlocks);
            break;
          default:
            break;
        }
        if (isMoved) {
          addRandom(newBlocks);
        }
        saveGame(newBlocks);
        return newBlocks;
      });
    }
    window.removeEventListener("keydown", listener);
    window.addEventListener("keydown", listener);

    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, [gameOver]);

  useEffect(() => {
    try {
      const storedBox = JSON.parse(localStorage.getItem("blocks") ?? "");
      if (!isBlock(storedBox)) {
        throw new Error("Invalid storedBox");
      }
      setBlocks(storedBox as any);
      saveGame(storedBox as any);
      return;
    } catch (e) {}
    setBlocks((blocks) => {
      const newBlocks = copyBlocks(blocks);
      addRandom(newBlocks);
      addRandom(newBlocks);
      saveGame(newBlocks);
      return newBlocks;
    });
  }, []);

  const onSwipe: HammerListener = (event) => {
    if (gameOver) return;
    let isMoved = false;
    const newBlocks = copyBlocks(blocks);
    switch (event.direction) {
      case 2: // left
        isMoved = left(newBlocks);
        break;
      case 4: // right
        isMoved = right(newBlocks);
        break;
      case 8: // up
        isMoved = up(newBlocks);
        break;
      case 16: // dowm
        isMoved = down(newBlocks);
        break;
      default:
        break;
    }
    if (isMoved) {
      addRandom(newBlocks);
    }
    setBlocks(newBlocks);
    saveGame(newBlocks);
  };

  return { blocks: sortedBlocks, onSwipe, restart };
}

function getZeroIndex(blocks: GameBlocks) {
  const zeroIndex = [];
  for (let i = 0; i < 16; i++) {
    if (blocks[i].value === 0) {
      zeroIndex.push(i);
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

function up(blocks: GameBlocks) {
  let isMoved = false;
  for (let i = 0; i < 4; i++) {
    for (let j = 1; j < 4; j++) {
      const index = getIndex(j, i);
      if (blocks[index].value !== 0) {
        let newPos = -1;
        let isAdd = false;
        for (let k = j - 1; k >= 0; k--) {
          const index2 = getIndex(k, i);
          if (blocks[index2].value === 0) {
            newPos = index2;
          } else if (blocks[index2].value === blocks[index].value) {
            newPos = index2;
            isAdd = true;
          } else {
            break;
          }
        }
        if (newPos !== -1) {
          isMoved = true;
          if (isAdd) {
            blocks[index].value *= 2;
          }
          blocks[newPos].value = 0;
          swap(blocks, index, newPos);
        }
      }
    }
  }
  return isMoved;
}

function down(blocks: GameBlocks) {
  let isMoved = false;
  for (let i = 0; i < 4; i++) {
    for (let j = 2; j >= 0; j--) {
      const index = getIndex(j, i);
      if (blocks[index].value !== 0) {
        let newPos = -1;
        let isAdd = false;
        for (let k = j + 1; k < 4; k++) {
          const index2 = getIndex(k, i);
          if (blocks[index2].value === 0) {
            newPos = index2;
          } else if (blocks[index2].value === blocks[index].value) {
            newPos = index2;
            isAdd = true;
          } else {
            break;
          }
        }
        if (newPos !== -1) {
          isMoved = true;
          if (isAdd) {
            blocks[index].value *= 2;
          }
          blocks[newPos].value = 0;
          swap(blocks, index, newPos);
        }
      }
    }
  }
  return isMoved;
}

function left(blocks: GameBlocks) {
  let isMoved = false;
  for (let i = 0; i < 4; i++) {
    for (let j = 1; j < 4; j++) {
      const index = getIndex(i, j);
      if (blocks[index].value !== 0) {
        let newPos = -1;
        let isAdd = false;
        for (let k = j - 1; k >= 0; k--) {
          const index2 = getIndex(i, k);
          if (blocks[index2].value === 0) {
            newPos = index2;
          } else if (blocks[index2].value === blocks[index].value) {
            newPos = index2;
            isAdd = true;
          } else {
            break;
          }
        }
        if (newPos !== -1) {
          isMoved = true;
          if (isAdd) {
            blocks[index].value *= 2;
          }
          blocks[newPos].value = 0;
          swap(blocks, index, newPos);
        }
      }
    }
  }
  return isMoved;
}

function right(blocks: GameBlocks) {
  let isMoved = false;
  for (let i = 0; i < 4; i++) {
    for (let j = 2; j >= 0; j--) {
      const index = getIndex(i, j);
      if (blocks[index].value !== 0) {
        let newPos = -1;
        let isAdd = false;
        for (let k = j + 1; k < 4; k++) {
          const index2 = getIndex(i, k);
          if (blocks[index2].value === 0) {
            newPos = index2;
          } else if (blocks[index2].value === blocks[index].value) {
            newPos = index2;
            isAdd = true;
          } else {
            break;
          }
        }
        if (newPos !== -1) {
          isMoved = true;
          if (isAdd) {
            blocks[index].value *= 2;
          }
          blocks[newPos].value = 0;
          swap(blocks, index, newPos);
        }
      }
    }
  }
  return isMoved;
}

function addRandom(blocks: GameBlocks) {
  const indexes = getZeroIndex(blocks);
  const block = blocks.find((block) => block.isNew);
  if (block) {
    block.isNew = false;
  }
  if (indexes.length > 0) {
    const index = randomInt(0, indexes.length - 1);
    const value = Math.random() < 0.9 ? 2 : 4;
    blocks[indexes[index]].value = value;
    blocks[indexes[index]].isNew = true;
  }
  return blocks;
}
