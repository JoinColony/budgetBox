const BudgetBox = artifacts.require("./BudgetBox.sol");

module.exports = function(deployer, network) {
  console.log(`## ${network} network ##`);
  deployer.deploy(BudgetBox);
};
