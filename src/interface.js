import React, { useState, useEffect } from 'react';
const ethers = require("ethers")
import Abijson from './Abi.json';
//css
import style from './MainInterface.module.css';

const CONTRACT_ADDRESS = '0x123456789ABCDEF'; // Replace this with your actual contract address

//Smart Contract
async function JoinGame(Contract, wallet){
try{

  const contract = new ethers.Contract(CONTRACT_ADDRESS, Abijson, wallet);

  const valueToSend = ethers.utils.parseEther('0.0005');

  const tx = await contract.joinGame({ value: valueToSend, gasLimit: 50000 });// send the ethers and gas to the smart contract
  await tx.wait();

  alert('Transaction Receipt:');
} catch(error){
  alert('Error:');
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
  const joingame = async ()=>{
    connectWalletHandler();
    if(contract && defaultAccount){
      try{
        const wallet = new ethers.Wallet(defaultAccount);

        await joinGame(contract, wallet);

        alert('Game joined successfully');
      }catch (error) {
        alert('Error joining game:');
      }
    }else{
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

  const updateEthers = () => {
    const tempProvider = new ethers.providers.Web3Provider(window.ethereum);
    const tempSigner = tempProvider.getSigner();
    const tempContract = new ethers.Contract(CONTRACT_ADDRESS, Abijson, tempSigner);

    setContract(tempContract);
    alert(tempContract);
  };

  const accountChangeHandler = newAccount => {
    setDefaultAccount(newAccount);
    updateEthers();
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
      {contract && <p>Contract instance: {contract.address}</p>}

      <div className={style.Join_Game_Button}> 
        <button onClick={joingame}>Join Game</button>
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
