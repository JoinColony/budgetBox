function createVote(winner, loser) {
    const [a, b, winbit] = (winner < loser) ? [winner, loser, 0] : [loser, winner, 1];
    const pos = ((b * (b - 1)) / 2) + a;
    return (2 + winbit) << (pos * 2);
}

function sumMatrix(matrix) {
  return matrix
    .reduce((agg, row) => agg.concat(row), [])
    .reduce((sum, el) => sum + el.toNumber(), 0);
}

function printMatrix(matrix) {
  matrix.map(printRow);
}

function printRow(row) {
  console.log(row.map(el => el.toNumber()));
}

module.exports = {
  createVote,
  sumMatrix,
  printMatrix,
  printRow,
}
