// Function to dynamically generate matrix inputs
function generateMatrixInput(matrixId) {
  const rows = parseInt(document.getElementById(`rows${matrixId}`).value);
  const cols = parseInt(document.getElementById(`cols${matrixId}`).value);

  if (!rows || !cols || rows <= 0 || cols <= 0) {
    alert("Please enter valid dimensions.");
    return;
  }

  const container = document.getElementById(`matrix${matrixId}-container`);
  container.innerHTML = `<h3>Matrix ${matrixId}</h3>`;
  const matrixGrid = document.createElement("div");
  matrixGrid.className = "matrix";
  matrixGrid.style.gridTemplateColumns = `repeat(${cols}, auto)`;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const input = document.createElement("input");
      input.type = "number";
      input.placeholder = `(${i + 1}, ${j + 1})`;
      input.id = `matrix${matrixId}-${i}-${j}`;
      matrixGrid.appendChild(input);
    }
  }

  container.appendChild(matrixGrid);
}

// Parse matrix from user input
function parseMatrix(matrixId) {
  const rows = parseInt(document.getElementById(`rows${matrixId}`).value);
  const cols = parseInt(document.getElementById(`cols${matrixId}`).value);
  const matrix = [];

  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < cols; j++) {
      const value = parseFloat(document.getElementById(`matrix${matrixId}-${i}-${j}`).value) || 0;
      row.push(value);
    }
    matrix.push(row);
  }

  return matrix;
}

// Display result in table format
function displayResult(matrix) {
  const container = document.getElementById("result-container");
  container.innerHTML = "<table></table>";
  const table = container.querySelector("table");

  matrix.forEach(row => {
    const tr = document.createElement("tr");
    row.forEach(val => {
      const td = document.createElement("td");
      td.textContent = val;
      tr.appendChild(td);
    });
    table.appendChild(tr);
  });
}

// Add Matrices
function addMatrices() {
  const matrixA = parseMatrix("A");
  const matrixB = parseMatrix("B");

  if (matrixA.length !== matrixB.length || matrixA[0].length !== matrixB[0].length) {
    alert("Matrices must have the same dimensions for addition.");
    return;
  }

  const result = matrixA.map((row, i) => row.map((val, j) => val + matrixB[i][j]));
  displayResult(result);
}

// Subtract Matrices
function subtractMatrices() {
  const matrixA = parseMatrix("A");
  const matrixB = parseMatrix("B");

  if (matrixA.length !== matrixB.length || matrixA[0].length !== matrixB[0].length) {
    alert("Matrices must have the same dimensions for subtraction.");
    return;
  }

  const result = matrixA.map((row, i) => row.map((val, j) => val - matrixB[i][j]));
  displayResult(result);
}

// Multiply Matrices
function multiplyMatrices() {
  const matrixA = parseMatrix("A");
  const matrixB = parseMatrix("B");

  if (matrixA[0].length !== matrixB.length) {
    alert("Number of columns in Matrix A must equal number of rows in Matrix B.");
    return;
  }

  const result = Array(matrixA.length).fill().map(() => Array(matrixB[0].length).fill(0));

  for (let i = 0; i < matrixA.length; i++) {
    for (let j = 0; j < matrixB[0].length; j++) {
      for (let k = 0; k < matrixA[0].length; k++) {
        result[i][j] += matrixA[i][k] * matrixB[k][j];
      }
    }
  }

  displayResult(result);
}

// Transpose Matrix
function transposeMatrix(matrixId) {
  const matrix = parseMatrix(matrixId);
  const result = matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
  displayResult(result);
}

// Calculate Determinant (Recursive for NxN matrices)
function calculateDeterminant(matrixId) {
  const matrix = parseMatrix(matrixId);

  if (matrix.length !== matrix[0].length) {
    alert("Matrix must be square to calculate the determinant.");
    return;
  }

  function determinant(m) {
    if (m.length === 1) return m[0][0];
    if (m.length === 2) return m[0][0] * m[1][1] - m[0][1] * m[1][0];

    return m[0].reduce((acc, val, col) => {
      const subMatrix = m.slice(1).map(row => row.filter((_, index) => index !== col));
      return acc + val * determinant(subMatrix) * (col % 2 === 0 ? 1 : -1);
    }, 0);
  }

  const result = determinant(matrix);
  displayResult([[result]]);
}

// Invert Matrix
function invertMatrix(matrixId) {
  const matrix = parseMatrix(matrixId);

  if (matrix.length !== matrix[0].length) {
    alert("Matrix must be square to calculate the inverse.");
    return;
  }

  const size = matrix.length;
  const augmented = matrix.map((row, i) => [...row, ...Array(size).fill(0).map((_, j) => (i === j ? 1 : 0))]);

  for (let i = 0; i < size; i++) {
    const pivot = augmented[i][i];
    if (pivot === 0) {
      alert("Matrix is not invertible.");
      return;
    }

    for (let j = 0; j < 2 * size; j++) augmented[i][j] /= pivot;

    for (let k = 0; k < size; k++) {
      if (k !== i) {
        const factor = augmented[k][i];
        for (let j = 0; j < 2 * size; j++) augmented[k][j] -= factor * augmented[i][j];
      }
    }
  }

  const result = augmented.map(row => row.slice(size));
  displayResult(result);
}
