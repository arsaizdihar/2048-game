import { useEffect, useState } from "react";
import { GameBlocks } from "./type";

export default function useGame() {
  const [blocks, setBlocks] = useState<GameBlocks>([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);

  const [gameOver, setGameOver] = useState(false);

  function restart() {
    const blocks: GameBlocks = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    addRandom(blocks);
    addRandom(blocks);
    saveGame(blocks);
    setBlocks(blocks);
  }

  useEffect(() => {
    function listener(e: KeyboardEvent) {
      if (gameOver) return;
      setBlocks((blocks) => {
        let newBlocks = blocks.map((row) => [...row]) as GameBlocks;
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
          newBlocks = addRandom(newBlocks);
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
    setBlocks((blocks) => {
      const newBlocks = blocks.map((row) => [...row]) as GameBlocks;
      addRandom(newBlocks);
      addRandom(newBlocks);
      saveGame(newBlocks);
      return newBlocks;
    });
  }, []);

  const onSwipe: HammerListener = (event) => {
    if (gameOver) return;
    let isMoved = false;
    const newBlocks = blocks.map((row) => [...row]) as GameBlocks;
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

function up(blocks: GameBlocks) {
  let isMoved = false;
  for (let i = 0; i < 4; i++) {
    for (let j = 1; j < 4; j++) {
      if (blocks[j][i] !== 0) {
        let newPos = -1;
        let isAdd = false;
        for (let k = j - 1; k >= 0; k--) {
          if (blocks[k][i] === 0) {
            newPos = k;
          } else if (blocks[k][i] === blocks[j][i]) {
            newPos = k;
            isAdd = true;
          } else {
            break;
          }
        }
        if (newPos !== -1) {
          isMoved = true;
          blocks[newPos][i] = isAdd ? blocks[j][i] * 2 : blocks[j][i];
          blocks[j][i] = 0;
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
      if (blocks[j][i] !== 0) {
        let newPos = -1;
        let isAdd = false;
        for (let k = j + 1; k < 4; k++) {
          if (blocks[k][i] === 0) {
            newPos = k;
          } else if (blocks[k][i] === blocks[j][i]) {
            newPos = k;
            isAdd = true;
          } else {
            break;
          }
        }
        if (newPos !== -1) {
          isMoved = true;
          blocks[newPos][i] = isAdd ? blocks[j][i] * 2 : blocks[j][i];
          blocks[j][i] = 0;
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
      if (blocks[i][j] !== 0) {
        let newPos = -1;
        let isAdd = false;
        for (let k = j - 1; k >= 0; k--) {
          if (blocks[i][k] === 0) {
            newPos = k;
          } else if (blocks[i][k] === blocks[i][j]) {
            newPos = k;
            isAdd = true;
          } else {
            break;
          }
        }
        if (newPos !== -1) {
          isMoved = true;
          blocks[i][newPos] = isAdd ? blocks[i][j] * 2 : blocks[i][j];
          blocks[i][j] = 0;
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
      if (blocks[i][j] !== 0) {
        let newPos = -1;
        let isAdd = false;
        for (let k = j + 1; k < 4; k++) {
          if (blocks[i][k] === 0) {
            newPos = k;
          } else if (blocks[i][k] === blocks[i][j]) {
            newPos = k;
            isAdd = true;
          } else {
            break;
          }
        }
        if (newPos !== -1) {
          isMoved = true;
          blocks[i][newPos] = isAdd ? blocks[i][j] * 2 : blocks[i][j];
          blocks[i][j] = 0;
        }
      }
    }
  }
  return isMoved;
}

function addRandom(blocks: GameBlocks) {
  const indexes = getZeroIndex(blocks);
  if (indexes.length > 0) {
    const index = randomInt(0, indexes.length - 1);
    const value = Math.random() < 0.9 ? 2 : 4;
    blocks[indexes[index][0]][indexes[index][1]] = value;
  }
  return blocks;
}
