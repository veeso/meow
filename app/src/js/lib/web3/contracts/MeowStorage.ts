import { BigNumber } from "ethers";
import { Profile } from "./UserStorage";

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
    inputs: [],
    name: "getLastMeowId",
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
            name: "meow",
            type: "tuple",
          },
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
                name: "biography",
                type: "string",
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
        internalType: "struct MeowStorage.MeowWithProfile",
        name: "",
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
  "0xdD1a0F32f262020A1e45FE46E68fb92475F7F058";

// types

export interface MeowWithProfile {
  meow: Meow;
  profile: Profile;
}

export interface Meow {
  epoch: string;
  id: BigNumber;
  hashtags: Array<string>;
  text: string;
}
