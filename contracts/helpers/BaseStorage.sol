// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./Owned.sol";

/**
 * @title UserStorage Contract
 * @author Christian "veeso" Visintin <christian.visintin1997@gmail.com>
 */
contract BaseStorage is Owned {
    address managerAddr;

    /// @notice Set manager address
    /// @param _managerAddr address for manager
    function setManagerAddr(address _managerAddr) public onlyOwner {
        managerAddr = _managerAddr;
    }
}
