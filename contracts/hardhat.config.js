require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

const Infura_privatekey = process.env.INFURA_API_KEY;
const Georli_privatekey = process.env.GEORLI_PRIVATE_KEY;

module.exports = {
  solidity: "0.8.0",
  paths:{
    artifacts: './src/artifacts'
  },
  networks: {
    georli: {
      url: `https://goerli.infura.io/v3/${Infura_privatekey}`,
      accounts: [Georli_privatekey]
    }
  }
};