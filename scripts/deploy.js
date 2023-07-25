const hre = require("hardhat");

async function main() {
    const NumberGame = await hre.ethers.getContractFactory("NumberGame");
    const Numbergame = await NumberGame.deploy();
    
    console.log("NumberGame contract address:");
}

main()
.then(() => process.exit(0))
.catch((error) => {
    console.error(error);
    process.exit(1);
}); 