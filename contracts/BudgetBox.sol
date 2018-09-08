/*
  This file is part of The Colony Network.

  The Colony Network is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  The Colony Network is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with The Colony Network. If not, see <http://www.gnu.org/licenses/>.
*/

pragma solidity ^0.4.24;
pragma experimental "v0.5.0";


contract BudgetBox {
  uint256 constant K = 10;
  uint256[] voteArray;

  //////////
  // Public functions

  function addVote(uint256 vote) public {
    voteArray.push(vote);
  }

  function numVotes() public view returns (uint256) {
    return voteArray.length;
  }

  function createBBox() public view returns (uint256[K][K]) {
    uint256[K][K] memory bbox;
    uint a;
    uint b;
    uint pos;

    for (uint voter; voter < voteArray.length; voter++) {
      for (b = 0; b < K; b++) {
        for (a = 0; a < b; a++) {
          pos = getPos(a, b);
          if (voteExists(voter, pos)) {
            // Note: true indicates that b is preferred
            getVote(voter, pos) ? bbox[b][a] += 1 : bbox[a][b] += 1;
          }
        }
      }
    }

    return bbox;
  }

  //////////
  // Internal functions

  function voteExists(uint vote, uint pos) internal view returns (bool) {
    return voteArray[vote] & (2 << pos * 2) > 0;
  }

  function getVote(uint vote, uint pos) internal view returns (bool) {
    return voteArray[vote] & (1 << pos * 2) > 0;
  }

  function getPos(uint a, uint b) internal pure returns (uint) {
    require(a < b, "wrong-argument-order");
    return ((b * (b - 1)) / 2) + a;
  }
}
