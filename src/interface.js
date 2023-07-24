import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Abijson from './Contract/Abi.json';
//css
import style from './MainInterface.module.css';

const CONTRACT_ADDRESS = '0xd9145CCE52D386f254917e481eB44e9943F39138'; // Replace this with your actual contract address
const [EtherBet, setEtherBet] = useState("0.00005");


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
  try{
    const valueToSend = ethers.utils.parseEther(EtherBet);
    const guessing = await contract.makeGuess({ value: valueToSend, gasLimit: 50000})
    await guessing.wait();
  }catch(error){
    alert(error);
  }

}

// Main Function
function App() {
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [targetNumber, setTargetNumber] = useState(null);
  const [TempEtherBet] = useState(null);
  

  useEffect(() => {
    const init = async () => {
      connectWalletHandler();
      const tempProvider = new ethers.providers.Web3Provider(window.ethereum);
      const tempSigner = tempProvider.getSigner();
      const tempContract = new ethers.Contract(CONTRACT_ADDRESS, Abijson, tempSigner);
  
      setContract(tempContract);
    };
  
    init();
    window.ethereum.on('accountsChanged', accounts => {
      setDefaultAccount(accounts);
    });
  }, []);

  const guess = () =>{
    if(contract && defaultAccount){
      Guess()
    }else{
      alert('Contract or user token is not found!')
    }
  }
  const joinGame  = async ()=>{
    if(contract && defaultAccount){
      try{
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        // Connect the provider to the signer
        const signer = provider.getSigner(defaultAccount);

        await JoinGame(signer);

      }catch (error) {
        alert('Error joining game:');
      }
    }else{
      alert('Please connect your wallet first.');
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
  };

  const fetchTargetNumber = async () => {
    try {

      const result = await contract.getTargetNumber();

      // Update the state with the fetched target number
      setTargetNumber(result.toString());
      alert(targetNumber);
    } catch (error) {
      alert('Error fetching target number:'+ error);
    }
  };


// UI PART
  const [userInput, setUserInput] = useState('');
  const HandleFormSubmit = (event)=>{
    event.preventDefault();

    const intValue = parseInt(userInput, 10);
    const tempbet = parseInt(TempEtherBet, 10);
    if (isNaN(intValue) || isNaN(tempbet)) {
      alert('Please enter a valid number.');
    }

    if(tempbet<0.00005){
      alert("Please Bet more than the 0.00005 ether");
    }else{
      setEtherBet(TempEtherBet);
    }

    if (intValue >= 1 && intValue <= 99){
      alert("Nice");
      guess();
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
          placeholder='Enter your Bet'
          value={TempEtherBet}
        />
        <input
          type="text"
          id="GuessValue"
          name="GuessValue"
          placeholder='Enter your Guessing Number'
          onChange={handleGuessInput}
          value={userInput}
        />
        <h2>Message: {userInput}</h2>
        <button onClick={HandleFormSubmit}>Guess</button>
        <button>Withdraw</button>
        <button onClick={fetchTargetNumber}>Get Number</button>
        <p>Random Number: {targetNumber}</p>
      </div>

    </div>
  );
}

export default App;
