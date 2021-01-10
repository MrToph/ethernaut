pragma solidity ^0.7.3;

interface IMagicNum {
    function setSolver(address _solver) external;
}

contract MagicNumAttacker {
    IMagicNum public challenge;

    constructor(address challengeAddress) {
        challenge = IMagicNum(challengeAddress);
    }

    function attack() public {
        bytes memory bytecode = hex"600a600c600039600a6000f3602a60005260206000f3";
        bytes32 salt = 0;
        address solver;

        assembly {
            solver := create2(0, add(bytecode, 0x20), mload(bytecode), salt)
        }

        challenge.setSolver(solver);
    }
}
