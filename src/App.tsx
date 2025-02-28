import React, { useState, useEffect } from 'react';
import { Github, HelpCircle, RefreshCw, PawPrint } from 'lucide-react';

// Define the types for our game
type Letter = 'F' | 'O' | 'X' | null;
type Grid = (Letter | null)[][];
type LetterCounts = {
  F: number;
  O: number;
  X: number;
};

const initialLetterCounts: LetterCounts = {
  F: 5,
  O: 6,
  X: 5,
};

function App() {
  // Game state
  const [grid, setGrid] = useState<Grid>(Array(4).fill(null).map(() => Array(4).fill(null)));
  const [currentLetter, setCurrentLetter] = useState<Letter | null>(null);
  const [remainingLetters, setRemainingLetters] = useState<LetterCounts>({ ...initialLetterCounts });
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gameWon, setGameWon] = useState<boolean>(false);
  const [showHelp, setShowHelp] = useState<boolean>(false);
  const [placedCount, setPlacedCount] = useState<number>(0);
  const [lastFoundSequence, setLastFoundSequence] = useState<{sequence: Letter[], positions: [number, number][]} | null>(null);

  // Initialize the game
  useEffect(() => {
    pickRandomLetter();
  }, []);

  // Pick a random letter based on remaining counts
  const pickRandomLetter = () => {
    if (gameOver || gameWon) return;
    
    const availableLetters: Letter[] = [];
    
    Object.entries(remainingLetters).forEach(([letter, count]) => {
      for (let i = 0; i < count; i++) {
        availableLetters.push(letter as Letter);
      }
    });
    
    if (availableLetters.length === 0) {
      setGameWon(true);
      return;
    }
    
    const randomIndex = Math.floor(Math.random() * availableLetters.length);
    const letter = availableLetters[randomIndex];
    setCurrentLetter(letter);
  };

  // Place a letter on the grid
  const placeLetter = (row: number, col: number) => {
    if (gameOver || gameWon || grid[row][col] !== null || currentLetter === null) return;
    
    // Create a new grid with the letter placed
    const newGrid = [...grid.map(r => [...r])];
    newGrid[row][col] = currentLetter;
    
    // Update remaining letters
    const newRemainingLetters = { ...remainingLetters };
    newRemainingLetters[currentLetter] -= 1;
    
    // Update state
    setGrid(newGrid);
    setRemainingLetters(newRemainingLetters);
    setCurrentLetter(null);
    setPlacedCount(placedCount + 1);
    
    // Check if the game is over
    const foxFound = checkForFox(newGrid, row, col);
    if (foxFound) {
      setGameOver(true);
      return;
    }
    
    // Check if all tiles are placed
    if (placedCount + 1 === 16) {
      setGameWon(true);
      return;
    }
    
    // Pick the next letter
    setTimeout(pickRandomLetter, 300);
  };

  // Check if "FOX" is formed in any direction
  const checkForFox = (grid: Grid, row: number, col: number): boolean => {
    const directions = [
      [0, 1],   // horizontal right
      [1, 0],   // vertical down
      [1, 1],   // diagonal down-right
      [1, -1],  // diagonal down-left
      [-1, 1],  // diagonal up-right
      [-1, -1], // diagonal up-left
      [-1, 0],  // vertical up
      [0, -1],  // horizontal left
    ];
    
    for (const [dx, dy] of directions) {
      const result = checkDirection(grid, row, col, dx, dy);
      if (result) {
        setLastFoundSequence(result);
        return true;
      }
    }
    
    return false;
  };

  // Helper function to check for "FOX" in a specific direction
  const checkDirection = (grid: Grid, row: number, col: number, dx: number, dy: number): {sequence: Letter[], positions: [number, number][]} | null => {
    const sequences = [
      ['F', 'O', 'X'], // FOX
      ['X', 'O', 'F'], // XOF
    ];
    
    for (const sequence of sequences) {
      // Check if we can form the sequence starting from this position
      let found = true;
      const positions: [number, number][] = [];
      
      for (let i = 0; i < 3; i++) {
        const newRow = row + i * dx;
        const newCol = col + i * dy;
        
        if (
          newRow < 0 || newRow >= 4 || 
          newCol < 0 || newCol >= 4 || 
          grid[newRow][newCol] !== sequence[i]
        ) {
          found = false;
          break;
        }
        
        positions.push([newRow, newCol]);
      }
      
      if (found) {
        return {
          sequence: sequence as Letter[],
          positions
        };
      }
      
      // Also check if we're in the middle or end of a sequence
      for (let offset = 1; offset <= 2; offset++) {
        found = true;
        const positions: [number, number][] = [];
        
        for (let i = 0; i < 3; i++) {
          const newRow = row + (i - offset) * dx;
          const newCol = col + (i - offset) * dy;
          
          if (
            newRow < 0 || newRow >= 4 || 
            newCol < 0 || newCol >= 4 || 
            grid[newRow][newCol] !== sequence[i]
          ) {
            found = false;
            break;
          }
          
          positions.push([newRow, newCol]);
        }
        
        if (found) {
          return {
            sequence: sequence as Letter[],
            positions
          };
        }
      }
    }
    
    return null;
  };

  // Reset the game
  const resetGame = () => {
    setGrid(Array(4).fill(null).map(() => Array(4).fill(null)));
    setRemainingLetters({ ...initialLetterCounts });
    setGameOver(false);
    setGameWon(false);
    setCurrentLetter(null);
    setPlacedCount(0);
    setLastFoundSequence(null);
    setTimeout(pickRandomLetter, 300);
  };

  // Toggle help modal
  const toggleHelp = () => {
    setShowHelp(!showHelp);
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col font-['IBM_Plex_Sans']">
      {/* Header */}
      <header className="p-4 flex justify-between items-center bg-white shadow-sm">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold uppercase">DO NOT FIND THE FOX!</h1>
          <PawPrint className="text-orange-500" size={24} />
        </div>
        <div className="flex gap-2">
          <button 
            onClick={resetGame}
            className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
            aria-label="New Game"
          >
            <RefreshCw size={20} />
          </button>
          <button 
            onClick={toggleHelp}
            className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
            aria-label="Help"
          >
            <HelpCircle size={20} />
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        {/* Current letter display */}
        <div className="mb-6 text-center">
          <p className="text-lg mb-2">Current letter:</p>
          <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center text-3xl font-bold mx-auto shadow-md">
            {currentLetter || '?'}
          </div>
        </div>

        {/* Game grid */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {grid.map((row, rowIndex) => (
            row.map((cell, colIndex) => (
              <button
                key={`${rowIndex}-${colIndex}`}
                className={`w-16 h-16 rounded-lg flex items-center justify-center text-2xl font-bold transition-all shadow-md ${
                  cell === null 
                    ? 'bg-slate-100 hover:bg-slate-200 cursor-pointer' 
                    : cell === 'F' 
                      ? 'bg-blue-500 text-white' 
                      : cell === 'O' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-red-500 text-white'
                } ${
                  lastFoundSequence && lastFoundSequence.positions.some(([r, c]) => r === rowIndex && c === colIndex)
                    ? 'ring-4 ring-yellow-400'
                    : ''
                }`}
                onClick={() => placeLetter(rowIndex, colIndex)}
                disabled={cell !== null || gameOver || gameWon}
              >
                {cell}
              </button>
            ))
          ))}
        </div>

        {/* Game status */}
        <div className="text-center mb-4">
          {gameOver && (
            <div className="text-red-600 text-xl font-bold mb-4">
              Game Over! Unfortunately, the Fox found you.
            </div>
          )}
          {gameWon && (
            <div className="text-green-600 text-xl font-bold mb-4">
              You Win! You avoided spelling FOX!
            </div>
          )}
          <div className="flex gap-4 justify-center">
            <div className="text-blue-600 font-semibold">F: {remainingLetters.F}</div>
            <div className="text-green-600 font-semibold">O: {remainingLetters.O}</div>
            <div className="text-red-600 font-semibold">X: {remainingLetters.X}</div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 flex justify-end items-center bg-white shadow-sm">
        <a 
          href="https://github.com/abishekvenkat" 
          target="_blank" 
          rel="noopener noreferrer"
          className="p-2 text-slate-600 hover:text-slate-900 transition-colors"
          aria-label="GitHub"
        >
          <Github size={20} />
        </a>
      </footer>

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg max-w-md shadow-xl text-slate-800">
            <h2 className="text-xl font-bold mb-4">How to Play</h2>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>You'll be given random letters (F, O, X) one at a time</li>
              <li>Place each letter on the 4x4 grid</li>
              <li>Avoid spelling "FOX" in any direction (horizontal, vertical, diagonal)</li>
              <li>If you spell "FOX" or "XOF", you lose</li>
              <li>Fill all 16 spaces without spelling "FOX" to win</li>
            </ul>
            <div className="flex justify-end">
              <button 
                onClick={toggleHelp}
                className="px-4 py-2 bg-slate-200 rounded hover:bg-slate-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;