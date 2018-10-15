const BN = require("bn.js");


function createVote(winner, loser) {
    const [a, b, winbit] = (winner < loser) ? [winner, loser, 0] : [loser, winner, 1];
    const pos = ((b * (b - 1)) / 2) + a;
    return (new BN(2 + winbit)).ushln(pos * 2);
}

// https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
var seed = 1;
function random() {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

function createRandomVotes() {
  const max16 = 2 ** 16 - 1
  const maxVote = new BN(max16 * random());
  for (var i = 0; i < 15; i++) {
    maxVote.ishln(16).iaddn(max16 * random());
  }
  return maxVote;
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
  createRandomVotes,
  sumMatrix,
  printMatrix,
  printRow,
}
