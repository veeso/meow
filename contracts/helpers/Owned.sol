// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Owned {
    address public ownerAddr;

    constructor() {
        ownerAddr = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == ownerAddr);
        _;
    }

    /// @notice transfer ownership of contract to another address
    /// @param _newOwner new owner address
    function transferOwnership(address _newOwner) public onlyOwner {
        require(_newOwner != address(0));

        ownerAddr = _newOwner;
    }
}
