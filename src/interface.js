import React, { useState, useEffect } from 'react';
const ethers = require("ethers")
import Abijson from './Abi.json';
//css
import style from './MainInterface.module.css';

const CONTRACT_ADDRESS = '0x123456789ABCDEF'; // Replace this with your actual contract address

async function JoinGame(){
try{
  const valueToSend = ethers.utils.parseEther('0.00006');

  const tx = await contract.joinGame({ value: valueToSend, gasLimit: 50000 });// send the ethers and gas to the smart contract
  await tx.wait();

  console.log('Transaction Receipt:', tx);
} catch(error){

}
}
async function Guess(){

}
function App() {
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    connectWalletHandler();
  }, []);

  const guess = () =>{
    Guess();
  }
  const joingame = ()=>{
    connectWalletHandler();
    JoinGame();
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
  };

  const accountChangeHandler = newAccount => {
    setDefaultAccount(newAccount);
    updateEthers();
  };

  return (
    <div>
      <h3>{"Get/Set Interaction with contract!"}</h3>
      <button onClick={connectWalletHandler}>Connect Wallet</button>
      {defaultAccount && <h3> Address: {defaultAccount} </h3>}
      {contract && <p>Contract instance: {contract.address}</p>}

      <div className={style.Join_Game_Button}> 
        <button onClick={joingame}>Join Game</button>
        <input className={style.Guess_Text_Field}></input>
        <button onClick={guess}>Guess</button>
      </div>

      
      
    </div>
  );
}

export default App;
