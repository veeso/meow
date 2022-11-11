// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

/**
 * @title MeowStorage
 * @author Christian "veeso" Visintin <christian.visintin1997@gmail.com>
 */
contract MeowStorage {
    event MeowPublished(uint256 recipient, uint256 meowId);

    struct Meow {
        uint256 id;
        string text;
        string[] hashtags;
        uint128 _epoch;
    }

    Meow[] private meows;

    // Mapping of Meow id to the profile id of the author
    mapping(uint256 => uint256) meowToProfile;

    /// @notice Publish a new Meow
    /// @dev Explain to a developer any extra details
    /// @param _profileId that published the message
    /// @param _text meow text
    /// @param _hashtags associated to meow
    /// @param _epoch of the publication time
    function publish(
        uint256 _profileId,
        string memory _text,
        string[] memory _hashtags,
        uint128 _epoch
    ) external {
        uint256 meowId = meows.length;
        meows.push(Meow(meowId, _text, _hashtags, _epoch));
        meowToProfile[meowId] = _profileId;
        emit MeowPublished(_profileId, meowId);
    }

    /// @notice get meow by id
    /// @param _id meow id
    /// @return meow associated to the id
    function getMeowById(uint256 _id) external view returns (Meow memory) {
        return meows[_id];
    }

    /// @notice get meows associated to author in provided range
    /// @dev For performance reasons range must be provided
    /// @param _author meow author id
    /// @param _offset start offset position to get meows from
    /// @param _count amount of meows to get
    /// @return meows user's meows in range
    function getMeowsForAuthor(
        uint256 _author,
        uint256 _offset,
        uint256 _count
    ) external view returns (Meow[] memory) {
        uint256 skipped = 0;
        Meow[] memory result = new Meow[](_count);
        for (uint256 i = 0; i < meows.length && result.length < _count; i++) {
            if (meowToProfile[i] == _author) {
                if (skipped < _offset) {
                    skipped++;
                } else {
                    result[i] = meows[i];
                }
            }
        }
        return result;
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
        uint256 skipped = 0;
        Meow[] memory result = new Meow[](_count);
        for (uint256 i = 0; i < meows.length && result.length < _count; i++) {
            if (hashtagsContains(meows[i].hashtags, _hashtag)) {
                if (skipped < _offset) {
                    skipped++;
                } else {
                    result[i] = meows[i];
                }
            }
        }
        return result;
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
