const BudgetBox = artifacts.require("./BudgetBox.sol");

const K = 5;

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

contract('BudgetBox', function(accounts) {
  let budgetBox;

  beforeEach(async () => {
    budgetBox = await BudgetBox.new();
  })

  it("should add a series of votes", async () => {
    await budgetBox.addVote(0);
    await budgetBox.addVote(0);
    await budgetBox.addVote(0);

    const numVotes = await budgetBox.numVotes();
    assert.equal(numVotes.toNumber(), 3);
  });

  it("should generate a bbox", async () => {
    await budgetBox.addVote(createVote(0, 1) | createVote(1, 2));

    const bbox = await budgetBox.createBBox();
    assert.equal(bbox[0][1].toNumber(), 1);
    assert.equal(bbox[1][2].toNumber(), 1);
    assert.equal(sumMatrix(bbox), 2);
  });

  it("should run the power method", async () => {
    await budgetBox.addVote(createVote(0, 1) | createVote(1, 2));

    let bbox;
    bbox = await budgetBox.createBBox();
    bbox = await budgetBox.addDiagonal(bbox);
    bbox = await budgetBox.normalize(bbox);

    const v = await budgetBox.powerMethod(bbox);
    assert(v[0].toNumber() > v[1].toNumber());
    assert(v[1].toNumber() > v[2].toNumber());
  });

  it("should run everything and check gas costs", async () => {
    const gasCosts = [];
    let tx;

    tx = await budgetBox.addVote(createVote(0, 1) | createVote(1, 2));
    gasCosts.push(tx.receipt.gasUsed);

    tx = await budgetBox.runAll();
    gasCosts.push(tx.receipt.gasUsed);

    console.log(gasCosts);
  });
});
