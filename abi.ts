export const ABI = [
    {
      "inputs": [],
      "name": "checkExpiration",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "payable": null,
      "signature": "0xd43f28fd"
    },
    {
      "inputs": [],
      "name": "deleteData",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "constant": null,
      "payable": null,
      "signature": "0xe0ba432a"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_additionalDuration",
          "type": "uint256"
        }
      ],
      "name": "extendExpiration",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "constant": null,
      "payable": null,
      "signature": "0x0a114a70"
    },
    {
      "inputs": [],
      "name": "getData",
      "outputs": [
        {
          "internalType": "bytes",
          "name": "",
          "type": "bytes"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true,
      "payable": null,
      "signature": "0x3bc5de30"
    },
    {
      "inputs": [
        {
          "internalType": "bytes",
          "name": "_data",
          "type": "bytes"
        },
        {
          "internalType": "uint256",
          "name": "_duration",
          "type": "uint256"
        }
      ],
      "name": "storeData",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "constant": null,
      "payable": null,
      "signature": "0x675e742f"
    },
    {
      "inputs": [
        {
          "internalType": "bytes",
          "name": "_data",
          "type": "bytes"
        },
        {
          "internalType": "uint256",
          "name": "_duration",
          "type": "uint256"
        }
      ],
      "name": "updateData",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "constant": null,
      "payable": null,
      "signature": "0x7ef8b1f0"
    }
  ]
  