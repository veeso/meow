// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

/**
 * @title User Contract
 * @author Christian "veeso" Visintin <christian.visintin1997@gmail.com>
 */
contract User {
    struct Profile {
        uint256 id;
        bytes32 username;
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
    function createProfile(bytes32 _username) external {
        lastProfileId++;
        profiles[tx.origin] = Profile(lastProfileId, _username, "");
        profilesOwners[lastProfileId] = tx.origin;
    }

    /// @notice follow wallet associated to account
    /// @dev must push both following to sender and followers to wallet
    /// @param profileId to follow
    function follow(uint256 profileId) external {
        uint256 walletProfile = addressToId(tx.origin);
        if (!followContains(following[walletProfile], profileId)) {
            following[walletProfile].push(profileId);
        }
        if (!followContains(followers[profileId], walletProfile)) {
            followers[profileId].push(walletProfile);
        }
    }

    /// @notice unfollow address
    /// @dev must remove both following to sender and followers to wallet
    /// @param _profileId to unfollow
    function unfollow(uint256 _profileId) external {
        uint256 walletProfile = addressToId(tx.origin);
        if (followContains(following[walletProfile], _profileId)) {
            uint256[] storage temp = following[walletProfile];
            for (uint256 i = 0; i < following[walletProfile].length; i++) {
                if (following[walletProfile][i] == _profileId) {
                    delete temp[i];
                }
            }
            following[walletProfile] = temp;
        }
        if (followContains(followers[_profileId], walletProfile)) {
            uint256[] storage temp = followers[_profileId];
            for (uint256 i = 0; i < followers[_profileId].length; i++) {
                if (followers[_profileId][i] == walletProfile) {
                    delete temp[i];
                }
            }
            followers[_profileId] = temp;
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
        return following[_profileId];
    }

    /// @notice set avatar for wallet
    /// @param _avatarURI uri of avatar resource
    function setAvatar(string memory _avatarURI) external {
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

    /// @notice get profile id associated to sender address
    /// @param _sender address to search
    /// @return id
    function addressToId(address _sender) private view returns (uint256) {
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
}
