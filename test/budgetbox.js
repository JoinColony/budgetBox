var BudgetBox = artifacts.require("./BudgetBox.sol");

function createVote(winner, loser) {
    const [a, b, winbit] = (winner < loser) ? [winner, loser, 0] : [loser, winner, 1];
    const pos = ((b * (b - 1)) / 2) + a;
    return (2 + winbit) << (pos * 2);
}

contract('BudgetBox', function(accounts) {
  let budgetBox;

  before(async () => {
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

    assert.equal(bbox[1][0].toNumber(), 0);
    assert.equal(bbox[2][1].toNumber(), 0);

    assert.equal(bbox[0][0].toNumber(), 0);
    assert.equal(bbox[1][1].toNumber(), 0);
    assert.equal(bbox[2][2].toNumber(), 0);
  });

});
