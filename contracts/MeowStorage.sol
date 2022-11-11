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
    function getMeowById(uint256 _id) external view returns (Meow memory) {
        return meows[_id];
    }

    /// @notice get meows associated to author in provided range
    /// @dev For performance reasons range must be provided
    /// @param _profileId meow profile id
    /// @param _offset start offset position to get meows from
    /// @param _count amount of meows to get
    /// @return meows user's meows in range
    function getMeowsForProfile(
        uint256 _profileId,
        uint256 _offset,
        uint256 _count
    ) external view returns (Meow[] memory) {
        uint256 _resultIndex = 0;
        Meow[] memory _result = new Meow[](_count);
        for (
            uint256 i = _offset + 1;
            i <= lastMeowId && _resultIndex < _count;
            i++
        ) {
            if (meowToProfile[i] == _profileId) {
                _result[_resultIndex] = meows[i];
                _resultIndex++;
            }
        }
        return _result;
    }

    /// @notice get meows which contains the provided hashtag
    /// @dev For performance reasons range must be provided
    /// @param _hashtag hashtag to search in meows
    /// @param _offset start offset position to get meows from
    /// @param _count amount of meows to get
    /// @return meows user's meows in range
    function getMeowsByHashtag(
        string memory _hashtag,
        uint256 _offset,
        uint256 _count
    ) external view returns (Meow[] memory) {
        uint256 _resultIndex = 0;
        Meow[] memory _result = new Meow[](_count);
        for (
            uint256 i = _offset + 1;
            i <= lastMeowId && _resultIndex < _count;
            i++
        ) {
            if (hashtagsContains(meows[i].hashtags, _hashtag)) {
                _result[_resultIndex] = meows[i];
                _resultIndex++;
            }
        }
        return _result;
    }

    /// @notice Checks whether meow hashtags contain provided argument
    /// @param _hashtags meow hashtags
    /// @param _hashtag hashtag to search
    /// @return yesno contains hashtag
    function hashtagsContains(string[] memory _hashtags, string memory _hashtag)
        private
        pure
        returns (bool)
    {
        for (uint256 i = 0; i < _hashtags.length; i++) {
            if (
                keccak256(abi.encodePacked(_hashtags[i])) ==
                keccak256(abi.encodePacked(_hashtag))
            ) {
                return true;
            }
        }
        return false;
    }
}
