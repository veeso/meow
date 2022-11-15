// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

import "./helpers/BaseStorage.sol";
import "./ContractManager.sol";
import "./UserStorage.sol";

/**
 * @title MeowStorage
 * @author Christian "veeso" Visintin <christian.visintin1997@gmail.com>
 */
contract MeowStorage is BaseStorage {
    event MeowPublished(uint256 recipient, uint256 meowId);

    struct Meow {
        uint256 id;
        string text;
        string[] hashtags;
        uint128 epoch;
    }

    uint256 lastMeowId;

    struct MeowWithProfile {
        Meow meow;
        UserStorage.Profile profile;
    }

    // map between meow id and meow entity
    mapping(uint256 => Meow) meows;

    // Mapping of Meow id to the profile id of the author
    mapping(uint256 => uint256) meowToProfile;

    /// @notice Publish a new Meow
    /// @dev Explain to a developer any extra details
    /// @param _text meow text
    /// @param _hashtags associated to meow
    /// @param _epoch of the publication time
    function publish(
        string memory _text,
        string[] memory _hashtags,
        uint128 _epoch
    ) external {
        // check text length
        require(bytes(_text).length <= 256);
        // get manager
        ContractManager _manager = ContractManager(managerAddr);
        // retrieve address for user storage
        address _userStorageAddr = _manager.getAddress("UserStorage");
        UserStorage _userStorage = UserStorage(_userStorageAddr);
        // user must exist
        require(_userStorage.profileExists(tx.origin));
        uint256 _profileId = _userStorage.addressToId(tx.origin);
        // increase id by 1
        lastMeowId++;
        meows[lastMeowId] = Meow(lastMeowId, _text, _hashtags, _epoch);
        meowToProfile[lastMeowId] = _profileId;
        emit MeowPublished(_profileId, lastMeowId);
    }

    /// @notice get meow by id
    /// @param _id meow id
    /// @return meow associated to the id
    function getMeowById(uint256 _id)
        external
        view
        returns (MeowWithProfile memory)
    {
        // check if exists
        require(meows[_id].id != 0);
        // get manager
        ContractManager _manager = ContractManager(managerAddr);
        // retrieve address for user storage
        address _userStorageAddr = _manager.getAddress("UserStorage");
        UserStorage _userStorage = UserStorage(_userStorageAddr);
        return
            MeowWithProfile(
                meows[_id],
                _userStorage.getProfile(meowToProfile[_id])
            );
    }

    /// @notice get the id of the last meow published
    /// @return id id of the last meow published
    function getLastMeowId() external view returns (uint256) {
        return lastMeowId;
    }
}
