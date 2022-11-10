// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

/**
 * @title Meow Contract
 * @dev Store & retrieve value in a variable
 */
contract MeowContract {
    event MeowPublished(address recipient, uint256 meowId);

    struct Meow {
        uint256 id;
        address author;
        string text;
        string[] hashtags;
        uint128 datetime;
    }

    Meow[] private meows;

    // Mapping of Meow id to the wallet address of the author
    mapping(uint256 => address) meowToAuthor;
    // Mapping of wallet address to avatar url
    mapping(address => string) authorToAvatar;
    // Mapping of followers for wallet
    mapping(address => address[]) followers;
    // mapping of wallet followed by address
    mapping(address => address[]) following;

    /// @notice Publish a new Meow
    /// @dev Explain to a developer any extra details
    /// @param text meow text
    function publish(
        string memory text,
        string[] memory hashtags,
        uint128 datetime
    ) external {
        uint256 meowId = meows.length;
        meows.push(Meow(meowId, msg.sender, text, hashtags, datetime));
        meowToAuthor[meowId] = msg.sender;
        emit MeowPublished(msg.sender, meowId);
    }

    /// @notice get meow by id
    /// @param id meow id
    /// @return meow associated to the id
    function getMeowById(uint256 id) external view returns (Meow memory) {
        return meows[id];
    }

    /// @notice get meows associated to author in provided range
    /// @dev For performance reasons range must be provided
    /// @param author meow author address
    /// @param offset start offset position to get meows from
    /// @param count amount of meows to get
    /// @return meows user's meows in range
    function getMeowsForAuthor(
        address author,
        uint256 offset,
        uint256 count
    ) external view returns (Meow[] memory) {
        uint256 skipped = 0;
        Meow[] memory result = new Meow[](count);
        for (uint256 i = 0; i < meows.length && result.length < count; i++) {
            if (meowToAuthor[i] == author) {
                if (skipped < offset) {
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
    /// @param hashtag hashtag to search in meows
    /// @param offset start offset position to get meows from
    /// @param count amount of meows to get
    /// @return meows user's meows in range
    function getMeowsByHashtag(
        string memory hashtag,
        uint256 offset,
        uint256 count
    ) external view returns (Meow[] memory) {
        uint256 skipped = 0;
        Meow[] memory result = new Meow[](count);
        for (uint256 i = 0; i < meows.length && result.length < count; i++) {
            if (hashtagsContains(meows[i].hashtags, hashtag)) {
                if (skipped < offset) {
                    skipped++;
                } else {
                    result[i] = meows[i];
                }
            }
        }
        return result;
    }

    /// @notice get wallet meows in provided range
    /// @dev For performance reasons range must be provided
    /// @param offset start offset position to get meows from
    /// @param count amount of meows to get
    /// @return meows user's meows in range
    function getMyMeows(uint256 offset, uint256 count)
        external
        view
        returns (Meow[] memory)
    {
        uint256 skipped = 0;
        Meow[] memory result = new Meow[](count);
        for (uint256 i = 0; i < meows.length && result.length < count; i++) {
            if (meowToAuthor[i] == msg.sender) {
                if (skipped < offset) {
                    skipped++;
                } else {
                    result[i] = meows[i];
                }
            }
        }
        return result;
    }

    /// @notice follow wallet associated to account
    /// @dev must push both following to sender and followers to wallet
    /// @param wallet to follow
    function follow(address wallet) external {
        if (!followContains(following[msg.sender], wallet)) {
            following[msg.sender].push(wallet);
        }
        if (!followContains(followers[wallet], msg.sender)) {
            followers[wallet].push(msg.sender);
        }
    }

    /// @notice unfollow address
    /// @dev must remove both following to sender and followers to wallet
    /// @param wallet to unfollow
    function unfollow(address wallet) external {
        if (followContains(following[msg.sender], wallet)) {
            address[] storage temp = following[msg.sender];
            for (uint256 i = 0; i < following[msg.sender].length; i++) {
                if (following[msg.sender][i] == wallet) {
                    delete temp[i];
                }
            }
            following[msg.sender] = temp;
        }
        if (followContains(followers[wallet], msg.sender)) {
            address[] storage temp = followers[wallet];
            for (uint256 i = 0; i < followers[wallet].length; i++) {
                if (followers[wallet][i] == msg.sender) {
                    delete temp[i];
                }
            }
            followers[wallet] = temp;
        }
    }

    /// @notice get followers of wallet
    /// @param wallet to get followers for
    /// @return followers
    function getFollowers(address wallet)
        external
        view
        returns (address[] memory)
    {
        return followers[wallet];
    }

    /// @notice get following of wallet
    /// @param wallet to get followers for
    /// @return following
    function getFollowing(address wallet)
        external
        view
        returns (address[] memory)
    {
        return following[wallet];
    }

    /// @notice set avatar for wallet
    /// @param avatarUri uri of avatar resource
    function setAvatar(string memory avatarUri) external {
        authorToAvatar[msg.sender] = avatarUri;
    }

    /// @notice get avatar for
    /// @param author address of author to get avatar for
    /// @return uri for avatar
    function getAvatar(address author) external view returns (string memory) {
        return authorToAvatar[author];
    }

    /// @notice Checks whether meow hashtags contain provided argument
    /// @param hashtags meow hashtags
    /// @param hashtag hashtag to search
    /// @return yesno contains hashtag
    function hashtagsContains(string[] memory hashtags, string memory hashtag)
        private
        pure
        returns (bool)
    {
        for (uint256 i = 0; i < hashtags.length; i++) {
            if (
                keccak256(abi.encodePacked(hashtags[i])) ==
                keccak256(abi.encodePacked(hashtag))
            ) {
                return true;
            }
        }
        return false;
    }

    /// @notice Returns whether list of address contains address
    /// @param addresses list to search in
    /// @param addr the address to search
    /// @return yesno
    function followContains(address[] memory addresses, address addr)
        private
        pure
        returns (bool)
    {
        for (uint256 i = 0; i < addresses.length; i++) {
            if (addresses[i] == addr) {
                return true;
            }
        }
        return false;
    }
}
