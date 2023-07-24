import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Abijson from './Abi.json';
//css
import style from './MainInterface.module.css';

const CONTRACT_ADDRESS = '0xd9145CCE52D386f254917e481eB44e9943F39138'; // Replace this with your actual contract address

//Smart Contract
async function JoinGame(wallet){
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
async function Guess(){

}

// Main Function
function App() {
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    connectWalletHandler();
  }, []);

  const guess = () =>{
    Guess();
  }
  const joinGame  = async ()=>{
    connectWalletHandler();
    if(contract && defaultAccount){
      try{
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        // Connect the provider to the signer
        const signer = provider.getSigner(defaultAccount);
        alert(signer);

        await JoinGame(signer);

      }catch (error) {
        alert('Error joining game:');
      }
    }else{
      alert('Please connect your wallet first.');
      alert(contract);
      alert(defaultAccount);
    }
  }

  const connectWalletHandler = () => {
    if (window.ethereum) {
      window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then(result => {
          accountChangeHandler(result[0]);
        })
        .catch(error => {
          console.error('Error connecting wallet:', error);
        });
    } else {
      console.error('MetaMask extension not found.');
    }

  };

  const accountChangeHandler = (newAccount) => {
    setDefaultAccount(newAccount);
    updateEthers();
  };


  const updateEthers = async () => {
    const tempProvider = new ethers.providers.Web3Provider(window.ethereum);
    const tempSigner = tempProvider.getSigner();
    const resolvedContractAddress = await tempProvider.resolveName(CONTRACT_ADDRESS);
    if (!ethers.utils.isAddress(resolvedContractAddress)) {
      console.error('Invalid contract address.');
      return;
    }
    const tempContract = new ethers.Contract(resolvedContractAddress, Abijson, tempSigner);

    setContract(tempContract);
  };



// UI PART
  const [userInput, setUserInput] = useState('');
  const HandleFormSubmit = (event)=>{
    event.preventDefault();

    const intValue = parseInt(userInput, 10);

    if (isNaN(intValue) ) {
      alert('Please enter a valid number.');
    } else if (intValue >= 1 && intValue <= 99){
      alert("Nice");
    } 
    else {
      alert('Not nice!');
    }
  }

  const handleGuessInput = event =>{
    setUserInput(event.target.value);
  }


  return (
    <div>
      <h3>{"Get/Set Interaction with contract!"}</h3>
      <button onClick={connectWalletHandler}>Connect Wallet</button>
      {defaultAccount && <h3> Address: {defaultAccount} </h3>}
      {contract && <p>Contract instance: {CONTRACT_ADDRESS}</p>}

      <div className={style.Join_Game_Button}> 
        <button onClick={joinGame}>Join Game</button>
        <input
          type="text"
          id="GuessValue"
          name="GuessValue"
          onChange={handleGuessInput}
          value={userInput}
        />
        <h2>Message: {userInput}</h2>
        <button onClick={HandleFormSubmit}>Guess</button>
        <button>Withdraw</button>
      </div>

      
      
    </div>
  );
}

export default App;
