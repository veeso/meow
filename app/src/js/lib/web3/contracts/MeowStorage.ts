export const ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "recipient",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "meowId",
        type: "uint256",
      },
    ],
    name: "MeowPublished",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_id",
        type: "uint256",
      },
    ],
    name: "getMeowById",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "text",
            type: "string",
          },
          {
            internalType: "string[]",
            name: "hashtags",
            type: "string[]",
          },
          {
            internalType: "uint128",
            name: "epoch",
            type: "uint128",
          },
        ],
        internalType: "struct MeowStorage.Meow",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_hashtag",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_offset",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_count",
        type: "uint256",
      },
    ],
    name: "getMeowsByHashtag",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "text",
            type: "string",
          },
          {
            internalType: "string[]",
            name: "hashtags",
            type: "string[]",
          },
          {
            internalType: "uint128",
            name: "epoch",
            type: "uint128",
          },
        ],
        internalType: "struct MeowStorage.Meow[]",
        name: "",
        type: "tuple[]",
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
      {
        internalType: "uint256",
        name: "_offset",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_count",
        type: "uint256",
      },
    ],
    name: "getMeowsForProfile",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "text",
            type: "string",
          },
          {
            internalType: "string[]",
            name: "hashtags",
            type: "string[]",
          },
          {
            internalType: "uint128",
            name: "epoch",
            type: "uint128",
          },
        ],
        internalType: "struct MeowStorage.Meow[]",
        name: "",
        type: "tuple[]",
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
        internalType: "string",
        name: "_text",
        type: "string",
      },
      {
        internalType: "string[]",
        name: "_hashtags",
        type: "string[]",
      },
      {
        internalType: "uint128",
        name: "_epoch",
        type: "uint128",
      },
    ],
    name: "publish",
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
];

export const MEOW_STORAGE_ADDRESS =
  "0x30eBEE43A1f7Ba89C78Eb4Adde3ada425DAA473d";
