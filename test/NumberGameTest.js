const { expect } = require("chai");

describe("NumberGame Contract", function(){
    async function deployToken(){
        const [owner, Player1, Player2] = await ethers.getSigners();
        const hardhatContract = await ethers.deployContract("NumberGame");

        return {hardhatContract,owner,Player1,Player2};
    }
    

    it("Should allow 2 player to join the game"), async function (){
        const initialBet = ethers.utils.oarseEther("0.00005");
        const {hardhatContract, Player1,Player2} = await loadFixture(deployToken);
        await hardhatContract.connect(Player1).joinGame({value: initialBet});
        await hardhatContract.connect(Player2).joinGame({value: initialBet})
        expect(await hardhatContract.Player1()).to.equal(Player1.address);
        expect(await hardhatContract.Player2()).to.equal(Player2.address);
    }
})