const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

// Sample puzzle strings for testing
const validPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
const solvedPuzzle = '135762984946381257728459613694517832812936745357824196473298561581673429269145378';
const invalidCharsPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37X';
const shortPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.3';
const unsolvablePuzzle = '115..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';

suite('Unit Tests', () => {
  
  suite('Puzzle Validation', () => {
    
    test('Logic handles a valid puzzle string of 81 characters', function() {
      const result = solver.validate(validPuzzle);
      assert.isTrue(result.valid);
    });
    
    test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', function() {
      const result = solver.validate(invalidCharsPuzzle);
      assert.isFalse(result.valid);
      assert.equal(result.error, 'Invalid characters in puzzle');
    });
    
    test('Logic handles a puzzle string that is not 81 characters in length', function() {
      const result = solver.validate(shortPuzzle);
      assert.isFalse(result.valid);
      assert.equal(result.error, 'Expected puzzle to be 81 characters long');
    });
    
  });
  
  suite('Row Placement', () => {
    
    test('Logic handles a valid row placement', function() {
      // Test placing a 3 in row A, column 2 (should be valid)
      const result = solver.checkRowPlacement(validPuzzle, 'A', 2, '3');
      assert.isTrue(result);
    });
    
    test('Logic handles an invalid row placement', function() {
      // Test placing a 1 in row A, column 2 (should be invalid - 1 already exists in row A)
      const result = solver.checkRowPlacement(validPuzzle, 'A', 2, '1');
      assert.isFalse(result);
    });
    
  });
  
  suite('Column Placement', () => {
    
    test('Logic handles a valid column placement', function() {
      // Test placing a 3 in row A, column 2 (should be valid)
      const result = solver.checkColPlacement(validPuzzle, 'A', 2, '3');
      assert.isTrue(result);
    });
    
    test('Logic handles an invalid column placement', function() {
      // Test placing a 9 in row A, column 2 (should be invalid - 9 already exists in column 2)
      const result = solver.checkColPlacement(validPuzzle, 'A', 2, '9');
      assert.isFalse(result);
    });
    
  });
  
  suite('Region Placement', () => {
    
    test('Logic handles a valid region (3x3 grid) placement', function() {
      // Test placing a 3 in row A, column 2 (should be valid)
      const result = solver.checkRegionPlacement(validPuzzle, 'A', 2, '3');
      assert.isTrue(result);
    });
    
    test('Logic handles an invalid region (3x3 grid) placement', function() {
      // Test placing a 5 in row A, column 2 (should be invalid - 5 already exists in top-left region)
      const result = solver.checkRegionPlacement(validPuzzle, 'A', 2, '5');
      assert.isFalse(result);
    });
    
  });
  
  suite('Solver Function', () => {
    
    test('Valid puzzle strings pass the solver', function() {
      const result = solver.solve(validPuzzle);
      assert.isString(result.solution);
      assert.equal(result.solution.length, 81);
    });
    
    test('Invalid puzzle strings fail the solver', function() {
      const result = solver.solve(invalidCharsPuzzle);
      assert.property(result, 'error');
      assert.equal(result.error, 'Invalid characters in puzzle');
    });
    
    test('Solver returns the expected solution for an incomplete puzzle', function() {
      const result = solver.solve(validPuzzle);
      assert.isString(result.solution);
      assert.equal(result.solution, solvedPuzzle);
      
      // Verify the solution doesn't contain any dots
      assert.notInclude(result.solution, '.');
      
      // Verify the solution is 81 characters
      assert.equal(result.solution.length, 81);
    });
    
  });
  
});