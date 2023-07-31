const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");

describe("NumberGame Contract", function(){
    async function deployToken(){
        const [owner,Player1, Player2] = await ethers.getSigners();
        const hardhatContract = await ethers.deployContract("NumberGame");
        await hardhatContract.deployed();

        return {hardhatContract,Player1,Player2,owner};
    }
    
    describe("Start Game", function(){
        it("Should allow 2 player to join the game", async function (){
        const initialBet = ethers.utils.parseEther("0.0001");
        const {hardhatContract, Player1,Player2} = await loadFixture(deployToken);
        await hardhatContract.connect(Player1).joinGame({value: initialBet});
        await hardhatContract.connect(Player2).joinGame({value: initialBet});
        expect(await hardhatContract.player1()).to.equal(Player1.address);
        expect(await hardhatContract.player2()).to.equal(Player2.address);

        //chcek the  contract balance equal to the total of both player initial bet.
        const contractAddress = hardhatContract.address;
        const contractBalance = await ethers.provider.getBalance(contractAddress);
        const balanceInEther = ethers.utils.formatEther(contractBalance);
        expect(await balanceInEther).to.equal("0.0002");
        });

        it("Owner should not join the game", async function() {
            const { hardhatContract, owner } = await loadFixture(deployToken);
            const initialBet = ethers.utils.parseEther("0.0001");
        
            // Use the owner signer directly, not the owner address
            await expect(hardhatContract.connect(owner).joinGame({ value: initialBet })).to.be.revertedWith('Owner cannot join the game');
        });
        

    });
    
});