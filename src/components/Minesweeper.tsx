import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { toast } from "sonner";
import CowGameOverOverlay from "./CowGameOverOverlay";

interface Cell {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborCount: number;
}

type GameStatus = "playing" | "won" | "lost";
type Difficulty = "easy" | "medium" | "hard";

const DIFFICULTIES = {
  easy: { rows: 9, cols: 9, mines: 10 },
  medium: { rows: 16, cols: 16, mines: 40 },
  hard: { rows: 16, cols: 30, mines: 99 },
};

const Minesweeper = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [board, setBoard] = useState<Cell[][]>([]);
  const [gameStatus, setGameStatus] = useState<GameStatus>("playing");
  const [timer, setTimer] = useState(0);
  const [flagCount, setFlagCount] = useState(0);
  const [isFirstClick, setIsFirstClick] = useState(true);
  const [showCowOverlay, setShowCowOverlay] = useState(false);

  const { rows, cols, mines } = DIFFICULTIES[difficulty];

  const createEmptyBoard = useCallback((): Cell[][] => {
    return Array(rows)
      .fill(null)
      .map(() =>
        Array(cols)
          .fill(null)
          .map(
            (): Cell => ({
              isMine: false,
              isRevealed: false,
              isFlagged: false,
              neighborCount: 0,
            }),
          ),
      );
  }, [rows, cols]);

  const placeMines = useCallback(
    (board: Cell[][], excludeRow: number, excludeCol: number): void => {
      let placedMines = 0;
      while (placedMines < mines) {
        const row = Math.floor(Math.random() * rows);
        const col = Math.floor(Math.random() * cols);

        if (
          !board[row][col].isMine &&
          !(row === excludeRow && col === excludeCol)
        ) {
          board[row][col].isMine = true;
          placedMines++;
        }
      }
    },
    [rows, cols, mines],
  );

  const calculateNeighbors = useCallback(
    (board: Cell[][]): void => {
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          if (!board[row][col].isMine) {
            let count = 0;
            for (let i = -1; i <= 1; i++) {
              for (let j = -1; j <= 1; j++) {
                const newRow = row + i;
                const newCol = col + j;
                if (
                  newRow >= 0 &&
                  newRow < rows &&
                  newCol >= 0 &&
                  newCol < cols &&
                  board[newRow][newCol].isMine
                ) {
                  count++;
                }
              }
            }
            board[row][col].neighborCount = count;
          }
        }
      }
    },
    [rows, cols],
  );

  const initializeGame = useCallback(() => {
    const newBoard = createEmptyBoard();
    setBoard(newBoard);
    setGameStatus("playing");
    setTimer(0);
    setFlagCount(0);
    setIsFirstClick(true);
  }, [createEmptyBoard]);

  const revealCell = useCallback(
    (row: number, col: number, currentBoard?: Cell[][]): Cell[][] => {
      const boardToUse = currentBoard || board;
      const newBoard = boardToUse.map((r) => [...r]);

      if (
        row < 0 ||
        row >= rows ||
        col < 0 ||
        col >= cols ||
        newBoard[row][col].isRevealed ||
        newBoard[row][col].isFlagged
      ) {
        return newBoard;
      }

      newBoard[row][col].isRevealed = true;

      if (
        newBoard[row][col].neighborCount === 0 &&
        !newBoard[row][col].isMine
      ) {
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            revealCell(row + i, col + j, newBoard);
          }
        }
      }

      return newBoard;
    },
    [board, rows, cols],
  );

  const handleCellClick = (row: number, col: number) => {
    if (gameStatus !== "playing" || board[row][col].isFlagged) return;

    let newBoard = [...board];

    if (isFirstClick) {
      placeMines(newBoard, row, col);
      calculateNeighbors(newBoard);
      setIsFirstClick(false);
    }

    if (newBoard[row][col].isMine) {
      // Reveal all mines
      newBoard = newBoard.map((r) =>
        r.map((cell) => ({
          ...cell,
          isRevealed: cell.isMine ? true : cell.isRevealed,
        })),
      );
      setGameStatus("lost");
      setShowCowOverlay(true);
      toast.error("💥 Бум! Игра окончена!");
    } else {
      newBoard = revealCell(row, col, newBoard);

      // Check win condition
      const revealedCells = newBoard
        .flat()
        .filter((cell) => cell.isRevealed).length;
      if (revealedCells === rows * cols - mines) {
        setGameStatus("won");
        toast.success("🎉 Поздравляем! Вы выиграли!");
      }
    }

    setBoard(newBoard);
  };

  const handleRightClick = (e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault();
    if (gameStatus !== "playing" || board[row][col].isRevealed) return;

    const newBoard = board.map((r) => [...r]);
    newBoard[row][col].isFlagged = !newBoard[row][col].isFlagged;

    setFlagCount(flagCount + (newBoard[row][col].isFlagged ? 1 : -1));
    setBoard(newBoard);
  };

  const getCellContent = (cell: Cell, row: number, col: number) => {
    if (cell.isFlagged) return "🚩";
    if (!cell.isRevealed) return "";
    if (cell.isMine) return "💣";
    if (cell.neighborCount === 0) return "";
    return cell.neighborCount.toString();
  };

  const getCellClass = (cell: Cell) => {
    let baseClass =
      "w-8 h-8 border border-purple-500/30 flex items-center justify-center text-sm font-bold transition-all duration-200 hover:scale-105";

    if (cell.isRevealed) {
      if (cell.isMine) {
        baseClass += " bg-red-500/70 text-white";
      } else {
        baseClass += " bg-gray-800/50 text-white";
        if (cell.neighborCount > 0) {
          const colors = [
            "",
            "text-blue-400",
            "text-green-400",
            "text-red-400",
            "text-purple-400",
            "text-yellow-400",
            "text-pink-400",
            "text-gray-400",
            "text-gray-500",
          ];
          baseClass += ` ${colors[cell.neighborCount]}`;
        }
      }
    } else {
      baseClass +=
        " bg-gradient-to-br from-purple-700/50 to-blue-700/50 hover:from-purple-600/50 hover:to-blue-600/50 cursor-pointer";
    }

    return baseClass;
  };

  useEffect(() => {
    initializeGame();
  }, [difficulty, initializeGame]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameStatus === "playing" && !isFirstClick) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStatus, isFirstClick]);

  return (
    <div className="text-center space-y-6">
      <CowGameOverOverlay
        isVisible={showCowOverlay}
        onRestart={() => {
          setShowCowOverlay(false);
          initializeGame();
        }}
        onClose={() => setShowCowOverlay(false)}
      />

      <div className="flex flex-wrap justify-center gap-4 items-center">
        <div className="flex gap-2">
          {(Object.keys(DIFFICULTIES) as Difficulty[]).map((diff) => (
            <Button
              key={diff}
              variant={difficulty === diff ? "default" : "outline"}
              size="sm"
              onClick={() => setDifficulty(diff)}
              className={
                difficulty === diff
                  ? "bg-purple-600 hover:bg-purple-700"
                  : "border-purple-500 text-purple-300 hover:bg-purple-500/20"
              }
            >
              {diff === "easy"
                ? "Легко"
                : diff === "medium"
                  ? "Средне"
                  : "Сложно"}
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-4 text-purple-300">
          <div className="flex items-center gap-2">
            <Icon name="Timer" size={16} />
            <span>{timer}s</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="Flag" size={16} />
            <span>{mines - flagCount}</span>
          </div>
        </div>

        <Button
          onClick={initializeGame}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          <Icon name="RotateCcw" size={16} className="mr-2" />
          Новая игра
        </Button>
      </div>

      <div className="flex justify-center">
        <div
          className="inline-grid gap-1 p-4 bg-black/40 rounded-lg border border-purple-500/30"
          style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
        >
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <button
                key={`${rowIndex}-${colIndex}`}
                className={getCellClass(cell)}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                onContextMenu={(e) => handleRightClick(e, rowIndex, colIndex)}
                disabled={gameStatus !== "playing"}
              >
                {getCellContent(cell, rowIndex, colIndex)}
              </button>
            )),
          )}
        </div>
      </div>

      {gameStatus !== "playing" && (
        <div
          className={`p-4 rounded-lg border ${
            gameStatus === "won"
              ? "bg-green-500/20 border-green-500/50 text-green-300"
              : "bg-red-500/20 border-red-500/50 text-red-300"
          }`}
        >
          <div className="text-2xl mb-2">
            {gameStatus === "won" ? "🎉 Победа!" : "💥 Поражение!"}
          </div>
          <div className="text-sm">
            {gameStatus === "won"
              ? `Время: ${timer} секунд`
              : "Попробуй ещё раз!"}
          </div>
        </div>
      )}
    </div>
  );
};

export default Minesweeper;
