export const ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_sender",
        type: "address",
      },
    ],
    name: "addressToId",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_username",
        type: "string",
      },
    ],
    name: "createProfile",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_profileId",
        type: "uint256",
      },
    ],
    name: "follow",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_profileId",
        type: "uint256",
      },
    ],
    name: "getAvatar",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_profileId",
        type: "uint256",
      },
    ],
    name: "getFollowers",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_profileId",
        type: "uint256",
      },
    ],
    name: "getFollowing",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_profileId",
        type: "uint256",
      },
    ],
    name: "getProfile",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "bytes32",
            name: "username",
            type: "bytes32",
          },
          {
            internalType: "string",
            name: "avatarURI",
            type: "string",
          },
        ],
        internalType: "struct UserStorage.Profile",
        name: "profile",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getUserProfile",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "bytes32",
            name: "username",
            type: "bytes32",
          },
          {
            internalType: "string",
            name: "avatarURI",
            type: "string",
          },
        ],
        internalType: "struct UserStorage.Profile",
        name: "profile",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "ownerAddr",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_profileOwner",
        type: "address",
      },
    ],
    name: "profileExists",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_avatarURI",
        type: "string",
      },
    ],
    name: "setAvatar",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_managerAddr",
        type: "address",
      },
    ],
    name: "setManagerAddr",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_profileId",
        type: "uint256",
      },
    ],
    name: "unfollow",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export const USER_STORAGE_ADDRESS =
  "0x7d6655eE29E15d6E508C515a7aE7Cd670D08c25B";
