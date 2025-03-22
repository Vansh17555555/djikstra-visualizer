'use client';
import { useState, useEffect } from "react";

interface Node {
  row: number;
  col: number;
  isStart: boolean;
  isEnd: boolean;
  isWall: boolean;
  isPath?: boolean;
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

  const visualizeDijkstra = () => {
    const startNode = grid[10][5];
    const endNode = grid[10][45];
    const visitedNodesInOrder = dijkstra(grid, startNode, endNode);
    const nodesInShortestPath = getNodesInShortestPath(endNode);
    animateAlgorithm(visitedNodesInOrder, nodesInShortestPath);
  };

  const dijkstra = (grid: Node[][], startNode: Node, endNode: Node) => {
    const visitedNodesInOrder: Node[] = [];
    startNode.distance = 0;
    const unvisitedNodes = getAllNodes(grid);

    while (unvisitedNodes.length) {
      sortNodesByDistance(unvisitedNodes);
      const closestNode = unvisitedNodes.shift();
      if (!closestNode) return visitedNodesInOrder;
      
      if (closestNode.isWall) continue;
      if (closestNode.distance === Infinity) return visitedNodesInOrder;
      
      closestNode.isVisited = true;
      visitedNodesInOrder.push(closestNode);
      if (closestNode === endNode) return visitedNodesInOrder;
      
      updateUnvisitedNeighbors(closestNode, grid);
    }
    return visitedNodesInOrder;
  };

  const getNodesInShortestPath = (finishNode: Node) => {
    const nodesInShortestPath: Node[] = [];
    let currentNode: Node | null = finishNode;
    while (currentNode !== null) {
      nodesInShortestPath.unshift(currentNode);
      currentNode = currentNode.previousNode;
    }
    return nodesInShortestPath;
  };

  const getAllNodes = (grid: Node[][]) => {
    const nodes: Node[] = [];
    for (const row of grid) {
      for (const node of row) {
        nodes.push(node);
      }
    }
    return nodes;
  };

  const sortNodesByDistance = (unvisitedNodes: Node[]) => {
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
  };

  const updateUnvisitedNeighbors = (node: Node, grid: Node[][]) => {
    const neighbors = getNeighbors(node, grid);
    for (const neighbor of neighbors) {
      neighbor.distance = node.distance + 1;
      neighbor.previousNode = node;
    }
  };

  const getNeighbors = (node: Node, grid: Node[][]) => {
    const neighbors: Node[] = [];
    const { row, col } = node;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    return neighbors.filter(neighbor => !neighbor.isVisited);
  };

  const animateAlgorithm = (visitedNodesInOrder: Node[], nodesInShortestPath: Node[]) => {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          animateShortestPath(nodesInShortestPath);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        setGrid(prevGrid => {
          const newGrid = prevGrid.slice();
          const newNode = {
            ...node,
            isVisited: true
          };
          newGrid[node.row][node.col] = newNode;
          return newGrid;
        });
      }, 10 * i);
    }
  };

  const animateShortestPath = (nodesInShortestPath: Node[]) => {
    for (let i = 0; i < nodesInShortestPath.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPath[i];
        setGrid(prevGrid => {
          const newGrid = prevGrid.slice();
          const newNode = {
            ...node,
            isPath: true
          };
          newGrid[node.row][node.col] = newNode;
          return newGrid;
        });
      }, 50 * i);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Dijkstra Visualizer</h1>
      <div className="mb-4">
        <button 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
          onClick={visualizeDijkstra}
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
      <div className="grid gap-[1px] bg-gray-200 p-2">
        {grid.map((row, rowIdx) => (
          <div key={rowIdx} className="flex">
            {row.map((node, nodeIdx) => {
              let bgColor = 'bg-white';
              if (node.isStart) bgColor = 'bg-green-500';
              if (node.isEnd) bgColor = 'bg-red-500';
              if (node.isWall) bgColor = 'bg-gray-800';
              if (node.isVisited && !node.isStart && !node.isEnd) bgColor = 'bg-blue-200';
              if (node.isPath && !node.isStart && !node.isEnd) bgColor = 'bg-yellow-400';

              return (
                <div
                  key={nodeIdx}
                  className={`w-6 h-6 border border-gray-200 ${bgColor} 
                    ${!node.isStart && !node.isEnd && !node.isWall ? 'hover:bg-gray-100' : ''}
                    transition-colors duration-200`}
                  onMouseDown={() => handleMouseDown(rowIdx, nodeIdx)}
                  onMouseEnter={() => handleMouseEnter(rowIdx, nodeIdx)}
                  onMouseUp={() => setIsMousePressed(false)}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
