//dependency
import { ethers } from 'ethers';

//functions
export async function JoinGame(wallet){
    
    try{
        const contract = new ethers.Contract(CONTRACT_ADDRESS, Abijson, wallet);
        const valueToSend = ethers.utils.parseEther('0.00005'); 
    
        const tx = await contract.joinGame({ value: valueToSend, gasLimit: 50000 });// send the ethers and gas to the smart contract
        await tx.wait();
    
        alert('Transaction Receipt:');
    } catch(error){
        alert(error);
    }
}

export async function Guess(EtherBet){
        
        try{
        const valueToSend = ethers.utils.parseEther(EtherBet);
        const guessing = await contract.makeGuess({ value: valueToSend, gasLimit: 50000})
        await guessing.wait();
        }catch(error){
        alert(error);
        }
    
}

