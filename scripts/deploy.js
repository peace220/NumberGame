async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    console.log("Account balance:", (await deployer.getBalance()).toString());

    const Numbergame = await ethers.getContractFactory("NumberGame");
    const contract = await Numbergame.deploy();

    console.log("NumberGame address:", await contract.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
    console.error(error);
    process.exit(1);
});