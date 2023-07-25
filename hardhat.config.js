require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.0",
  paths:{
    artifacts: './src/artifacts'
  },
  networks: {
    hardhat: {
      forking: {
        url: "https://mainnet.infura.io/v3/85a57ba9e7114c5d9feec2e559706017"
      }
    }
  }
};
