// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract NumberGame {
    address payable public owner;
    address payable public player1;
    address payable public player2;
    uint256 public player1Bet;
    uint256 public player2Bet;
    uint256 private minimumBet;
    uint256 private targetNumber;
    uint256 private player1Guess;
    uint256 private player2Guess;
    bool private player1BetStatus = false;
    bool private player2BetStatus = false;
    bool private playersBetStatus = false;
    bool public gameEnded;
    address public currentPlayer;
    
    constructor() {
        owner = payable(msg.sender);
        generateTargetNumber();
    }

    function generateTargetNumber() private {
        require(
            msg.sender == owner || msg.sender == player1 || msg.sender == player2,
            "Only the owner can generate the target number"
        );
        targetNumber =
            (uint256(
                keccak256(abi.encodePacked(block.timestamp, block.difficulty))
            ) % 10) +
            1;
    }

    

    function joinGame() public payable {

        require(
            player1 == address(0) || player2 == address(0),
            "Game is already full"
        );
        require(msg.sender != player1, "you have already joined the game");
        require(msg.sender != owner, "Owner cannot join the game");
        require(msg.value >=  0.00005 ether , "Please send more ether to join the game");

        if (player1 == address(0)) {
            player1 = payable(msg.sender);
            minimumBet = msg.value;
            player1Bet += msg.value;
            player1BetStatus = true;
        } else if (player2 == address(0)) {
            require(msg.value >=  minimumBet , "The ether needed to join needs to be higher");
            player2 = payable(msg.sender);
            player2Bet += msg.value;
            player2BetStatus = true;
        }
        gameEnded = false;
    }

    function makeGuess(uint256 guessNumber) public payable{
        require(!gameEnded, "Game has already ended");
        require(msg.sender == player1 || msg.sender == player2, "Not a player");
        require(msg.value >=  0.00005 ether , "Please send more ether to join the game");
        require(msg.value >=  minimumBet, "Please send ether with your guess equal or higher than the entry fee");

        if (msg.sender == player1) {
            player1 = payable(msg.sender);
            player1Bet += msg.value;
            player1Guess = guessNumber;
            player1BetStatus = true;
        } else if (msg.sender == player2) {
            player2 = payable(msg.sender);
            player2Bet += msg.value;
            player2Guess = guessNumber;
            player2BetStatus = true;
        }

        playersBetStatus = player1BetStatus && player2BetStatus;

        if(playersBetStatus == true){
            Result(player1Guess,player2Guess);
        }else{
            require(playersBetStatus != true, "Not all Player have enter their guess");
        }
    }

    

    function Result(uint256 p1Guess, uint256 p2Guess) public {
        require(!gameEnded, "Game has already ended");
        require(p1Guess > 0 && p1Guess <= 10, "Guess must be between 1 and 10");
        require(p2Guess > 0 && p2Guess <= 10, "Guess must be between 1 and 10");

        if (p1Guess == targetNumber && p2Guess == targetNumber) {
            gameEnded = true;
            uint256 totalBet = player1Bet +player2Bet;
            uint256 player1Share = (address(this).balance * player1Bet) / totalBet;
            uint256 player2Share = (address(this).balance * player2Bet) / totalBet;
            payable(player1).transfer(player1Share);
            payable(player2).transfer(player2Share);
            generateTargetNumber();
            player1 = payable(address(0));
            player2 = payable(address(0));
            player1Bet = 0;
            player2Bet = 0;
        } else if(p1Guess == targetNumber){
            gameEnded = true;
            payable(player1).transfer(address(this).balance);
            generateTargetNumber();
            player1 = payable(address(0));
            player2 = payable(address(0));
            player1Bet = 0;
            player2Bet = 0;
        }else if(p2Guess == targetNumber){
            gameEnded = true;
            payable(player2).transfer(address(this).balance);
            generateTargetNumber();
            player1 = payable(address(0));
            player2 = payable(address(0));
            player1Bet = 0;
            player2Bet = 0;
        }
    }

    function withdraw() public {
        require(msg.sender == player1 || msg.sender == player2, "Not a player");

        if (msg.sender == player1) {
            uint256 amount = player1Bet / 2;
            require(amount >= minimumBet, "No balance to withdraw");
            payable(player1).transfer(amount);
            player1 = payable(address(0));
            player1Bet = 0;

        } if(msg.sender == player2) {
            uint256 amount = player2Bet / 2;
            require(amount >= minimumBet, "No balance to withdraw");
            payable(player2).transfer(amount);
            player2 = payable(address(0));
            player2Bet = 0;
        }
    }

    function setTargetNumber(uint256 newTargetNumber) public {
    require(msg.sender == owner, "Only the owner can set the target number");
    targetNumber = newTargetNumber;
    }

    function getTargetNumber() public view returns (uint256) {
        
        require(msg.sender == owner,"Only the owner can view the target number");

        return targetNumber;
    }

}