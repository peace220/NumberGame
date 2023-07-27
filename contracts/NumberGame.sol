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
            ) % 99) +
            1;
    }

    function joinGame() public payable {
        require(
            player1 == address(0) || player2 == address(0),
            "Game is already full"
        );
        require(msg.sender != player1, "you have already joined the game");
        require(msg.sender != owner, "Owner cannot join the game");
        require(msg.value >=  0.00005 ether , "Please send ether to join the game");

        if (player1 == address(0)) {
            player1 = payable(msg.sender);
            currentPlayer = player1;
            minimumBet = msg.value;
        } else if (player2 == address(0)) {
            require(msg.value >=  minimumBet , "The ether needed to join needs to be higher");
            player2 = payable(msg.sender);
            currentPlayer = (currentPlayer == player1) ? player1 : player2;
        }
        gameEnded = false;
    }

    function makeGuess(uint256 guess) public payable {
        require(!gameEnded, "Game has already ended");
        require(msg.sender == currentPlayer, "Not your turn");
        require(guess > 0 && guess <= 99, "Guess must be between 1 and 99");
        require(msg.value >=  minimumBet, "Please send ether with your guess equal or higher than the entry fee");

        if (guess == targetNumber) {
            gameEnded = true;
            payable(msg.sender).transfer(address(this).balance);
            generateTargetNumber();
            player1 = payable(address(0));
            player2 = payable(address(0));

        } else {
            if(currentPlayer == player1){
                player1Bet += msg.value;
            }else if (currentPlayer == player2){
                player2Bet += msg.value;
            }
            currentPlayer = (currentPlayer == player1) ? player2 : player1;
        }
    }

    function withdraw() public {
        require(msg.sender == player1 || msg.sender == player2, "Not a player");

        if (msg.sender == player1) {
            uint256 amount = player1Bet / 2;
            require(amount >= minimumBet, "No balance to withdraw");
            payable(player1).transfer(amount);
            player1 = payable(address(0));

        } if(msg.sender == player2) {
            uint256 amount = player2Bet / 2;
            require(amount >= minimumBet, "No balance to withdraw");
            payable(player2).transfer(amount);
            player2 = payable(address(0));
        }
    }

    function getTargetNumber() public view returns (uint256) {
        
        require(
            msg.sender == owner,
            "Only the owner can view the target number"
        );

        return targetNumber;
    }
}