const sumMatrix = require("./utilities").sumMatrix;
const createVote = require("./utilities").createVote;
const createRandomVotes = require("./utilities").createRandomVotes;
const createTransitiveVotes = require("./utilities").createTransitiveVotes;

const BudgetBox = artifacts.require("./BudgetBox.sol");


contract('BudgetBox', function(accounts) {
  let budgetBox;

  beforeEach(async () => {
    budgetBox = await BudgetBox.new();
  });

  describe("general functionality", async () => {
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

    it("should create the markov matrix and run the power method", async () => {
      await budgetBox.addVote(createVote(0, 1) | createVote(1, 2));

      let bbox;
      bbox = await budgetBox.createBBox();
      bbox = await budgetBox.addDiagonal(bbox);
      bbox = await budgetBox.normalize(bbox);

      const v = await budgetBox.powerMethod(bbox);
      assert(v[0].toNumber() > v[1].toNumber());
      assert(v[1].toNumber() > v[2].toNumber());
    });

    it("should run everything at once", async () => {
      await budgetBox.addVote(createVote(0, 1) | createVote(1, 2));
      await budgetBox.runAll();
      const v = await budgetBox.getBudget();
      assert(v[0].toNumber() > v[1].toNumber());
      assert(v[1].toNumber() > v[2].toNumber());
    });

    it("should work with many votes", async () => {
      const n = 150;
      for (var i = 0; i < n; i++) {
        await budgetBox.addVote(createVote(0, 1) | createVote(1, 2));
      }

      const numVotes = await budgetBox.numVotes();
      assert.equal(numVotes.toNumber(), n);

      await budgetBox.runAll();
      const v = await budgetBox.getBudget();
      assert(v[0].toNumber() > v[1].toNumber());
      assert(v[1].toNumber() > v[2].toNumber());
    });
  });

  describe("gas costs for various degrees of scale", async () => {
    const fs = require("fs");
    function logger (err) {
      if (err) console.log(err);
    }

    const K = 8;
    const OUT = `gas/test_${K}.tsv`;

    fs.writeFile(OUT, "K\tn\tvoteStyle\tbudgetCost\tvotesCost\n", logger);

    let tx;
    let voteCosts;
    let budgetCost;

    [100, 200, 400, 600, 800, 1000].forEach(async (n) => {
      it(`should load and process ${n} random votes`, async () => {
        voteCosts = [];

        for (var i = 0; i < n; i++) {
          tx = await budgetBox.addVote(createRandomVotes().toString(), { from: accounts[1] });
          voteCosts.push(tx.receipt.gasUsed);
        }

        tx = await budgetBox.runAll();
        budgetCost = tx.receipt.gasUsed;
        fs.appendFile(OUT, `${K}\t${n}\trandom\t${budgetCost}\t${voteCosts}\n`, logger);
      });

      it(`should load and process ${n} transitive votes`, async () => {
        voteCosts = [];

        for (var i = 0; i < n; i++) {
          tx = await budgetBox.addVote(createTransitiveVotes().toString(), { from: accounts[2] });
          voteCosts.push(tx.receipt.gasUsed);
        }

        tx = await budgetBox.runAll();
        budgetCost = tx.receipt.gasUsed;
        fs.appendFile(OUT, `${K}\t${n}\ttransitive\t${budgetCost}\t${voteCosts}\n`, logger);
      });

      it(`should load and process ${n} mixed votes`, async () => {
        voteCosts = [];

        for (var i = 0; i < n; i++) {
          if (i % 2 === 0) {
            tx = await budgetBox.addVote(createRandomVotes().toString(), { from: accounts[3] });
          } else {
            tx = await budgetBox.addVote(createTransitiveVotes().toString(), { from: accounts[3] });
          }
          voteCosts.push(tx.receipt.gasUsed);
        }

        tx = await budgetBox.runAll();
        budgetCost = tx.receipt.gasUsed;
        fs.appendFile(OUT, `${K}\t${n}\tmixed\t${budgetCost}\t${voteCosts}\n`, logger);
      });


    });
  });

});
