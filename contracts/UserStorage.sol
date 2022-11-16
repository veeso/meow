// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

import "./helpers/BaseStorage.sol";

/**
 * @title UserStorage Contract
 * @author Christian "veeso" Visintin <christian.visintin1997@gmail.com>
 */
contract UserStorage is BaseStorage {
    struct Profile {
        uint256 id;
        bytes32 username;
        string biography;
        string avatarURI;
    }

    uint256 lastProfileId;
    // association between id to profile
    mapping(address => Profile) profiles;
    // association between profile id and wallet address
    mapping(uint256 => address) profilesOwners;
    // Mapping of followers for profile
    mapping(uint256 => uint256[]) followers;
    // mapping of wallet followed by profile
    mapping(uint256 => uint256[]) following;

    /// @notice Create user with provided username
    /// @param _username username
    function createProfile(string memory _username) external {
        uint usernameLength = bytes(_username).length;
        require(profiles[tx.origin].id == 0);
        require(usernameLength <= 32);
        bytes32 _busername;
        assembly {
            _busername := mload(add(_username, 32))
        }
        if (!isUsernameValid(_busername, usernameLength)) {
            revert(
                "invalid username; only alphanumeric and underscore is accepted"
            );
        }
        lastProfileId++;
        profiles[tx.origin] = Profile(lastProfileId, _busername, "", "");
        profilesOwners[lastProfileId] = tx.origin;
    }

    /// @notice returns the last profile id available
    /// @return id last profile id
    function getLastProfileId() external view returns (uint256) {
        return lastProfileId;
    }

    /// @notice get profile by profile id
    /// @param _profileId to search
    /// @return profile associated
    function getProfile(uint256 _profileId)
        external
        view
        returns (Profile memory profile)
    {
        require(profilesOwners[_profileId] != address(0));
        address owner = profilesOwners[_profileId];
        return profiles[owner];
    }

    /// @notice get user's profile
    /// @return profile associated to wallet
    function getUserProfile() external view returns (Profile memory profile) {
        require(profileExists(tx.origin));
        return profiles[tx.origin];
    }

    /// @notice get profile by username
    /// @dev check if profile id is zero, to get whether exists or not
    /// @param _username username to look up for
    /// @return profile associated to username
    function getProfileByUsername(string memory _username)
        external
        view
        returns (Profile memory profile)
    {
        bytes32 _busername;
        assembly {
            _busername := mload(add(_username, 32))
        }
        for (uint256 i = 1; i <= lastProfileId; i++) {
            address owner = profilesOwners[i];
            if (profiles[owner].username == _busername) {
                return profiles[owner];
            }
        }
        revert("username not found");
    }

    /// @notice follow wallet associated to account
    /// @dev must push both following to sender and followers to wallet
    /// @param _profileId to follow
    function follow(uint256 _profileId) external {
        require(profileExists(tx.origin));
        require(profilesOwners[_profileId] != address(0));
        uint256 _walletProfile = addressToId(tx.origin);
        require(_walletProfile != _profileId);
        if (!followContains(following[_walletProfile], _profileId)) {
            following[_walletProfile].push(_profileId);
        }
        if (!followContains(followers[_profileId], _walletProfile)) {
            followers[_profileId].push(_walletProfile);
        }
    }

    /// @notice unfollow address
    /// @dev must remove both following to sender and followers to wallet
    /// @param _profileId to unfollow
    function unfollow(uint256 _profileId) external {
        require(profileExists(tx.origin));
        require(profilesOwners[_profileId] != address(0));
        uint256 _walletProfile = addressToId(tx.origin);
        require(_walletProfile != _profileId);
        if (followContains(following[_walletProfile], _profileId)) {
            uint256[] storage _temp = following[_walletProfile];
            for (uint256 i = 0; i < following[_walletProfile].length; i++) {
                if (following[_walletProfile][i] == _profileId) {
                    delete _temp[i];
                }
            }
            following[_walletProfile] = _temp;
        }
        if (followContains(followers[_profileId], _walletProfile)) {
            uint256[] storage _temp = followers[_profileId];
            for (uint256 i = 0; i < followers[_profileId].length; i++) {
                if (followers[_profileId][i] == _walletProfile) {
                    delete _temp[i];
                }
            }
            followers[_profileId] = _temp;
        }
    }

    /// @notice get followers of wallet
    /// @param _profileId to get followers for
    /// @return followers
    function getFollowers(uint256 _profileId)
        external
        view
        returns (uint256[] memory)
    {
        require(profilesOwners[_profileId] != address(0));
        return followers[_profileId];
    }

    /// @notice get following of wallet
    /// @param _profileId to get followers for
    /// @return following
    function getFollowing(uint256 _profileId)
        external
        view
        returns (uint256[] memory)
    {
        require(profilesOwners[_profileId] != address(0));
        return following[_profileId];
    }

    /// @notice set bio for profile
    /// @param _bio profile biography
    function setBiography(string memory _bio) external {
        require(profileExists(tx.origin));
        profiles[tx.origin].biography = _bio;
    }

    /// @notice set avatar for wallet
    /// @param _avatarURI uri of avatar resource
    function setAvatar(string memory _avatarURI) external {
        require(profileExists(tx.origin));
        profiles[tx.origin].avatarURI = _avatarURI;
    }

    /// @notice get avatar for
    /// @param _profileId address of author to get avatar for
    /// @return uri for avatar
    function getAvatar(uint256 _profileId)
        external
        view
        returns (string memory)
    {
        address profileOwner = profilesOwners[_profileId];
        return profiles[profileOwner].avatarURI;
    }

    /// @notice checks whether profile exists
    /// @param _profileOwner profile owner
    /// @return yesno
    function profileExists(address _profileOwner) public view returns (bool) {
        return addressToId(_profileOwner) != 0;
    }

    /// @notice get profile id associated to sender address
    /// @param _sender address to search
    /// @return id
    function addressToId(address _sender) public view returns (uint256) {
        return profiles[_sender].id;
    }

    /// @notice Returns whether list of address contains address
    /// @param _profiles list to search in
    /// @param _profile the profile to search
    /// @return yesno
    function followContains(uint256[] memory _profiles, uint256 _profile)
        private
        pure
        returns (bool)
    {
        for (uint256 i = 0; i < _profiles.length; i++) {
            if (_profiles[i] == _profile) {
                return true;
            }
        }
        return false;
    }

    /// @notice check whether username contains only alphanumeric and _
    /// @param _username to check
    /// @return yesno
    function isUsernameValid(bytes32 _username, uint length)
        private
        pure
        returns (bool)
    {
        for (uint i; i < length; i++) {
            bytes1 char = _username[i];

            if (
                !(char >= 0x30 && char <= 0x39) && //9-0
                !(char >= 0x41 && char <= 0x5A) && //A-Z
                !(char >= 0x61 && char <= 0x7A) && //a-z
                !(char == 0x5F) //underscore
            ) return false;
        }
        return true;
    }
}
