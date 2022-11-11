// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

import "./helpers/Owned.sol";

contract ContractManager is Owned {
    // Association map between contract name and address
    mapping(string => address) addresses;

    /// @notice Set a new contract in manager
    /// @param _name contract name
    /// @param _address contract address
    function setAddress(string memory _name, address _address)
        public
        onlyOwner
    {
        addresses[_name] = _address;
    }

    /// @notice Get address by name
    /// @param _name address name
    function getAddress(string memory _name) public view returns (address) {
        return addresses[_name];
    }

    /// @notice Delete address by name
    /// @param _name address name to delete
    function deleteAddress(string memory _name) public onlyOwner {
        addresses[_name] = address(0);
    }
}
