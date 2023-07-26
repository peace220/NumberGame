import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Abijson from './artifacts/contracts/NumberGame.sol/NumberGame.json';
//css
import style from './MainInterface.module.css';

const CONTRACT_ADDRESS = '0x588CfE7FDda3C122B90dc8302116376339e55d16'; // address of the contract

// Main Function
function App() {
  const [userInput, setUserInput] = useState();
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [targetNumber, setTargetNumber] = useState(null);
  const [TempEtherBet, setTempEB] = useState();
  const [EtherBet, setEtherBet] = useState();
  const [GuessMessage, setGuessMessage] = useState(null);

//auto initialized needed to connect to wallet
  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
      window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then(result => {
          accountChangeHandler(result[0]);
        })
        .catch(error => {
          console.error('Error connecting wallet:', error);
        });
      const tempProvider = new ethers.providers.Web3Provider(window.ethereum);
      const tempSigner = tempProvider.getSigner();
      const tempContract = new ethers.Contract(CONTRACT_ADDRESS, Abijson, tempSigner);

      setContract(tempContract);
    } else {
      console.error('MetaMask extension not found.');
    }
    };
    init();
    window.ethereum.on('accountsChanged', accounts => {
      setDefaultAccount(accounts[0]);
    });
  }, []);

  const accountChangeHandler = (newAccount) => {
    setDefaultAccount(newAccount);
  };

//passing value to smart contract
  async function JoinGame(){
    try{
        const valueToSend = ethers.utils.parseEther('0.00005'); 
    
        const tx = await contract.joinGame({ value: valueToSend, gasLimit: 100000 });// send the ethers and gas to the smart contract
        await tx.wait();
    
        alert('Transaction Receipt:');
    } catch(error){
        alert(error);
    }
}

  async function Guess(){
    if(contract && defaultAccount){
      try{
        const valueToSend = ethers.utils.parseEther(EtherBet);
        const guessing = await contract
        .makeGuess(userInput, { from: defaultAccount, value: valueToSend, gasLimit: 100000})
        await guessing.wait();
        setGuessMessage(`Next Player ${defaultAccount}`);
        }catch(error){
        alert(error);
        }
    }else{
      alert('Contract or user token is not found!')
    }
    
}

async function GetNumber(){
  try{
    const Number = await contract.getTargetNumber({from: defaultAccount, gasLimit: 100000});
    setTargetNumber(Number.toString());
  }catch(error){
    alert(error);
  }
}

// UI PART
  
  const HandleFormSubmit = (event)=>{
    event.preventDefault();
    
    const intValue = parseInt(userInput, 10);
    const tempbet = parseFloat(TempEtherBet);
    if (isNaN(intValue) && isNaN(tempbet)) {
      alert('Please enter a valid number.');
    }

    if(tempbet<0.00005){
      alert("Please Bet more than the 0.00005 ether");
    }

    if (intValue >= 1 && intValue <= 99){
      setEtherBet(TempEtherBet);
      Guess();
    } 
    else {
      alert('Not nice!');
    }
  }

  const handleEtherBetInput = event =>{
    setTempEB(event.target.value);
  }
  const handleGuessInput = event =>{
    setUserInput(event.target.value);
  }


  return (
    <div>
      <h3>{"Get/Set Interaction with contract!"}</h3>
      {defaultAccount && <h3> Address: {defaultAccount} </h3>}
      {contract && <p>Contract instance: {CONTRACT_ADDRESS}</p>}

      <div className={style.Join_Game_Button}> 
        <button onClick={JoinGame}>Join Game</button>
        <input
          type="text"
          id="GuessValue"
          name="GuessValue"
          placeholder='Enter your Bet'
          onChange={handleEtherBetInput}
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
        <button onClick={HandleFormSubmit}>Guess</button>
        <button>Withdraw</button>
        <button onClick={GetNumber}>Get Number</button>
        <p>Random Number: {targetNumber}</p>
      </div>
      <h2>Bet Amount: {TempEtherBet}</h2>
    </div>
  );
}

export default App;
