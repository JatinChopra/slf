import web3 from "./web3";

const compiledMusicNFT = require('./build/src/ethereum/contracts/MusicNFT.sol/MusicNFT.json');

// create a function that takes an address
// create the campaign instance
// then return that

const MusicNFTcontract =   
  new web3.eth.Contract(compiledMusicNFT.abi, "0x475958Fc6C61d8EebE358fCd5FE55E97582D6D14");
;

export default MusicNFTcontract;
