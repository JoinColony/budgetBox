var BudgetBox = artifacts.require("./BudgetBox.sol");

contract('BudgetBox', function(accounts) {
  let budgetBox;

  before(async () => {
    budgetBox = await BudgetBox.new();
  })

  it("should add a series of votes", async () => {
    await budgetBox.addVote(0x01);
    await budgetBox.addVote(0x02);
    await budgetBox.addVote(0x03);

    const numVotes = await budgetBox.numVotes();
    assert.equal(numVotes.toNumber(), 3);
  });

});
