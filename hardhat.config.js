require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  paths:{
    sources:"./src/ethereum/contracts",
    artifacts:"./src/ethereum/build"
  }
};
