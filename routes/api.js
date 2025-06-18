'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body;
      
      // Check for missing required fields
      if (!puzzle || !coordinate || !value) {
        return res.json({ error: 'Required field(s) missing' });
      }
      
      // Validate puzzle string
      const validation = solver.validate(puzzle);
      if (!validation.valid) {
        return res.json({ error: validation.error });
      }
      
      // Validate coordinate format (A1-I9)
      const coordRegex = /^[A-I][1-9]$/i;
      if (!coordRegex.test(coordinate)) {
        return res.json({ error: 'Invalid coordinate' });
      }
      
      // Validate value (1-9)
      if (!/^[1-9]$/.test(value)) {
        return res.json({ error: 'Invalid value' });
      }
      
      const row = coordinate[0].toUpperCase();
      const column = parseInt(coordinate[1]);
      
      // Check if the value is already in that position
      const rowIndex = row.charCodeAt(0) - 65;
      const colIndex = column - 1;
      const currentIndex = rowIndex * 9 + colIndex;
      
      if (puzzle[currentIndex] === value) {
        return res.json({ valid: true });
      }
      
      // Check placement validity
      const conflicts = [];
      
      if (!solver.checkRowPlacement(puzzle, row, column, value)) {
        conflicts.push('row');
      }
      
      if (!solver.checkColPlacement(puzzle, row, column, value)) {
        conflicts.push('column');
      }
      
      if (!solver.checkRegionPlacement(puzzle, row, column, value)) {
        conflicts.push('region');
      }
      
      if (conflicts.length === 0) {
        return res.json({ valid: true });
      } else {
        return res.json({ valid: false, conflict: conflicts });
      }
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body;
      
      // Check for missing puzzle field
      if (!puzzle) {
        return res.json({ error: 'Required field missing' });
      }
      
      // Attempt to solve the puzzle
      const result = solver.solve(puzzle);
      
      if (result.error) {
        return res.json({ error: result.error });
      } else {
        return res.json({ solution: result.solution });
      }
    });
};