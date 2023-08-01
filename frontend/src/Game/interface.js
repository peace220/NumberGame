import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Abijson from '../contractABI.json';

//css
import style from '../MainInterface.module.css';
const OWNER_ADDRESS = process.env.REACT_APP_OWNER_ADDRESS;
const CONTRACT_ADDRESS = "0x87728653fdec1fDbF4b914c87AECea58953ac7e8"; // address of the contract

// Main Functions
function App() {
  const userGuessInput = 0;
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [targetNumber, setTargetNumber] = useState(null);
  const [GuessMessage, setGuessMessage] = useState(null);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [Player1Bet, setPlayer1Bet] = useState(false);
  const [Player2Bet, setPlayer2Bet] = useState(false);
  const [Player1, setPlayer1] = useState(null);
  const [Player2, setPlayer2] = useState(null);
  const minimumBet = "";



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
      try {
        const player1Address = await contract.player1;
        alert(player1Address);
        const player2Address = await contract.player2;
        setPlayer1(player2Address);
      } catch (error) {
        alert( error);
      }
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
        
    } catch(error){
        alert(error);
    }
  }

  async function Guess(){
    const BothPlayerBet = Player1Bet && Player2Bet;
    if(BothPlayerBet == true){
      try{
        const guessing = await contract
        .makeGuess(userGuessInput, { from: defaultAccount, value: valueToSend, gasLimit: 100000})
        await guessing.wait();
        setGuessMessage(`Next Player ${defaultAccount}`);
        if(defaultAccount == Player1){
          setPlayer1Bet = true;
        } else if(defaultAccount == Player2){
          setPlayer2Bet = true;
        }
        }catch(error){
        alert(error);
        }
    };
    
  }

  async function GetNumber(){
    if(defaultAccount === OWNER_ADDRESS){
      try{
        const Number = await contract.getTargetNumber({from: defaultAccount, gasLimit: 100000});
        setTargetNumber(Number.toString());
        setTimeout(() => setTargetNumber(""), 5000 );
      }catch(error){
        alert(error);
      }
    }else{
      setShowErrorMessage(true);
      setTimeout(() => setShowErrorMessage(false), 5000);
    }
    
  }

  async function Withdraw(){
    try{
      await contract.withdraw({from:defaultAccount, gasLimit: 100000});
    } catch(error){
      alert(error);
    }
  }

  async function MakeBet(Value){
    try{
      const betValue = ethers.utils.parseEther(Value);
      await contract.makeBet({from: defaultAccount, value: betValue, gasLimit :100000});
    } catch(error){
      alert(error);
    }
  }

// UI PART
  
  const HandleFormSubmit = (event)=>{
    event.preventDefault();
    const InputBetElement = document.getElementById('BetValue');
    const intValue = parseInt(userGuessInput, 10);
    const tempbet = parseFloat(InputBetElement.value);
    if (isNaN(intValue) && isNaN(tempbet)) {
      alert('Please enter a valid number.');
    }

    if(tempbet< 0.00005){
      alert(`Please Bet more than the minimum bet amount${minimumBet}`);
    }else{
      MakeBet(InputBetElement);
    }

    if (intValue <= 1 && intValue >= 10){
      Guess();
    } 
    else {
      alert('Not nice!');
    }
  }

  return (
    <div className={style.Container}>
      <div className={style.LeftColumn}>
        {defaultAccount && <h3> Address: {defaultAccount} </h3>}

        <div className={style.Join_Game_Button}> 
          <input
            type="text"
            id="EntryBet"
            name="EntryBet"
            placeholder='Enter your Entry Bet'
          />
          <button onClick={JoinGame}>Join Game</button>
          <input
            type="text"
            id="BetValue"
            name="BetValue"
            placeholder='Enter your Bet'
          />
          <input
            type="text"
            id="GuessValue"
            name="GuessValue"
            placeholder='Enter your Guessing Number'
          />
          <button onClick={HandleFormSubmit}>Guess</button>
          <button onClick={Withdraw}>Withdraw</button>
          <button onClick={GetNumber}>Get Number</button>
          {showErrorMessage && <p>You are not authorized to show the target number</p>}
          <p>Player Turn: {GuessMessage}</p>
          <p>Random Number: {targetNumber}</p>
        </div>
      </div>
    </div>
  );
}

export default App;
