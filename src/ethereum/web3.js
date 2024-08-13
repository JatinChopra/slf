const Web3 = require('web3');

let web3;
if (
  typeof window!== "undefined" &&
  typeof window.ethereum !== "undefined"
) {
  // We are in the browser and metamask is running.
  window.ethereum.request({ method: "eth_requestAccounts" });
  console.log("setting up browser window provider");
  web3 = new Web3(window.ethereum);
} else {
  // We are on the server *OR* the user is not running metamask
  const provider = new Web3.providers.HttpProvider(
    "https://sepolia.infura.io/v3/f8c0a7ffdfd14ad8bea63a2833ceadf3"
  );
  console.log("Setting up our own provider");
  web3 = new Web3(provider);
}

export default web3;
