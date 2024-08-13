const hre = require("hardhat");

async function main() {
  await hre.run('compile');
  console.log("Compilation complete!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});