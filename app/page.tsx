'use client';
import { useState, useEffect } from "react";

interface Node {
  row: number;
  col: number;
  isStart: boolean;
  isEnd: boolean;
  isWall: boolean;
  distance: number;
  isVisited: boolean;
  previousNode: Node | null;
}

export default function Home() {
  const [grid, setGrid] = useState<Node[][]>([]);
  const [isMousePressed, setIsMousePressed] = useState(false);
  
  const ROWS = 20;
  const COLS = 50;
  
  useEffect(() => {
    initializeGrid();
  }, []);

  const initializeGrid = () => {
    const newGrid: Node[][] = [];
    for (let row = 0; row < ROWS; row++) {
      const currentRow: Node[] = [];
      for (let col = 0; col < COLS; col++) {
        currentRow.push({
          row,
          col,
          isStart: row === 10 && col === 5,
          isEnd: row === 10 && col === 45,
          isWall: false,
          distance: Infinity,
          isVisited: false,
          previousNode: null,
        });
      }
      newGrid.push(currentRow);
    }
    setGrid(newGrid);
  };

  const handleMouseDown = (row: number, col: number) => {
    const newGrid = toggleWall(grid, row, col);
    setGrid(newGrid);
    setIsMousePressed(true);
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (!isMousePressed) return;
    const newGrid = toggleWall(grid, row, col);
    setGrid(newGrid);
  };

  const toggleWall = (grid: Node[][], row: number, col: number): Node[][] => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    if (!node.isStart && !node.isEnd) {
      const newNode = {
        ...node,
        isWall: !node.isWall,
      };
      newGrid[row][col] = newNode;
    }
    return newGrid;
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Dijkstra Visualizer</h1>
      <div className="mb-4">
        <button 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
          onClick={() => {/* We'll implement Dijkstra here */}}
        >
          Visualize Dijkstra
        </button>
        <button 
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          onClick={initializeGrid}
        >
          Clear Grid
        </button>
      </div>
      <div className="grid gap-[1px] bg-gray-200">
        {grid.map((row, rowIdx) => (
          <div key={rowIdx} className="flex">
            {row.map((node, nodeIdx) => (
              <div
                key={nodeIdx}
                className={`w-6 h-6 border border-gray-200 
                  ${node.isStart ? 'bg-green-500' : ''}
                  ${node.isEnd ? 'bg-red-500' : ''}
                  ${node.isWall ? 'bg-gray-800' : 'bg-white'}
                  ${!node.isStart && !node.isEnd && !node.isWall ? 'hover:bg-gray-100' : ''}
                `}
                onMouseDown={() => handleMouseDown(rowIdx, nodeIdx)}
                onMouseEnter={() => handleMouseEnter(rowIdx, nodeIdx)}
                onMouseUp={() => setIsMousePressed(false)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
