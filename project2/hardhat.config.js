
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-waffle");

require("dotenv").config();

const alchemyUrl = process.env.ALCHEMY_URL;
//const alchemyUrl = `https://eth-mainnet.alchemyapi.io/v2/W3b9XHv9Gmj0aVKngpTczd-onGB8wYQU`;

module.exports = {
  solidity: {
    version: "0.8.8",
  },
  networks: {
    hardhat: {
      forking: {
        url: alchemyUrl,
        blockNumber: 4043801 // blockNumber to fork mainnet from
      }
    }
  }
}