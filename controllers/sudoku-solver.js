class SudokuSolver {

  validate(puzzleString) {
    // Check if puzzle string is exactly 81 characters
    if (!puzzleString || puzzleString.length !== 81) {
      return { valid: false, error: 'Expected puzzle to be 81 characters long' };
    }
    
    // Check if puzzle string contains only valid characters (1-9 and .)
    const validChars = /^[1-9.]*$/;
    if (!validChars.test(puzzleString)) {
      return { valid: false, error: 'Invalid characters in puzzle' };
    }
    
    return { valid: true };
  }

  checkRowPlacement(puzzleString, row, column, value) {
    // Convert row letter to number (A=0, B=1, etc.)
    const rowIndex = row.toUpperCase().charCodeAt(0) - 65;
    
    // Check if the value already exists in the row
    for (let col = 0; col < 9; col++) {
      const index = rowIndex * 9 + col;
      if (puzzleString[index] === value.toString() && col !== column - 1) {
        return false;
      }
    }
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    // Convert row letter to number (A=0, B=1, etc.)
    const rowIndex = row.toUpperCase().charCodeAt(0) - 65;
    const colIndex = column - 1;
    
    // Check if the value already exists in the column
    for (let r = 0; r < 9; r++) {
      const index = r * 9 + colIndex;
      if (puzzleString[index] === value.toString() && r !== rowIndex) {
        return false;
      }
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    // Convert row letter to number (A=0, B=1, etc.)
    const rowIndex = row.toUpperCase().charCodeAt(0) - 65;
    const colIndex = column - 1;
    
    // Find the 3x3 region starting position
    const regionStartRow = Math.floor(rowIndex / 3) * 3;
    const regionStartCol = Math.floor(colIndex / 3) * 3;
    
    // Check if the value already exists in the 3x3 region
    for (let r = regionStartRow; r < regionStartRow + 3; r++) {
      for (let c = regionStartCol; c < regionStartCol + 3; c++) {
        const index = r * 9 + c;
        if (puzzleString[index] === value.toString() && 
            !(r === rowIndex && c === colIndex)) {
          return false;
        }
      }
    }
    return true;
  }

  // Helper method to check if a placement is valid
  isValidPlacement(puzzleString, row, column, value) {
    return this.checkRowPlacement(puzzleString, row, column, value) &&
           this.checkColPlacement(puzzleString, row, column, value) &&
           this.checkRegionPlacement(puzzleString, row, column, value);
  }

  // Helper method to convert index to row/column
  indexToRowCol(index) {
    const row = String.fromCharCode(65 + Math.floor(index / 9));
    const column = (index % 9) + 1;
    return { row, column };
  }

  // Helper method to find next empty cell
  findEmptyCell(puzzleString) {
    for (let i = 0; i < 81; i++) {
      if (puzzleString[i] === '.') {
        return i;
      }
    }
    return -1;
  }

  solve(puzzleString) {
    // First validate the puzzle
    const validation = this.validate(puzzleString);
    if (!validation.valid) {
      return { error: validation.error };
    }
    
    // Check if the initial puzzle state is valid
    if (!this.isValidPuzzle(puzzleString)) {
      return { error: 'Puzzle cannot be solved' };
    }
    
    // Solve using backtracking
    const solution = this.solvePuzzle(puzzleString);
    
    if (solution) {
      return { solution };
    } else {
      return { error: 'Puzzle cannot be solved' };
    }
  }

  // Check if the current puzzle state is valid (no conflicts)
  isValidPuzzle(puzzleString) {
    for (let i = 0; i < 81; i++) {
      if (puzzleString[i] !== '.') {
        const { row, column } = this.indexToRowCol(i);
        const value = puzzleString[i];
        
        // Temporarily remove the current cell value to check placement
        const tempPuzzle = puzzleString.split('');
        tempPuzzle[i] = '.';
        const tempPuzzleString = tempPuzzle.join('');
        
        if (!this.isValidPlacement(tempPuzzleString, row, column, value)) {
          return false;
        }
      }
    }
    return true;
  }

  // Backtracking algorithm to solve the puzzle
  solvePuzzle(puzzleString) {
    const emptyIndex = this.findEmptyCell(puzzleString);
    
    // If no empty cell found, puzzle is solved
    if (emptyIndex === -1) {
      return puzzleString;
    }
    
    const { row, column } = this.indexToRowCol(emptyIndex);
    
    // Try values 1-9
    for (let value = 1; value <= 9; value++) {
      if (this.isValidPlacement(puzzleString, row, column, value)) {
        // Place the value
        const newPuzzle = puzzleString.split('');
        newPuzzle[emptyIndex] = value.toString();
        const newPuzzleString = newPuzzle.join('');
        
        // Recursively solve
        const result = this.solvePuzzle(newPuzzleString);
        if (result) {
          return result;
        }
      }
    }
    
    // If no value works, backtrack
    return null;
  }
}

module.exports = SudokuSolver;