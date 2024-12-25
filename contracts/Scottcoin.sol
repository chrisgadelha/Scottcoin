// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Scottcoin is ERC20, Ownable {
    // Staking variables
    mapping(address => uint256) public stakingBalance;
    mapping(address => uint256) public lastStakeTime;
    
    // Quiz variables
    mapping(address => bool) public hasCompletedQuiz;
    uint256 public constant QUIZ_REWARD = 10 * 10**18; // 10 SCOTT
    
    // Quiz answers (true/false for each question)
    bool[5] private quizAnswers = [true, false, true, true, false];
    
    constructor() ERC20("Scottcoin", "SCOTT") Ownable(msg.sender) {
        _mint(msg.sender, 10000 * 10 ** decimals());
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
    
    // Staking functions
    function stake(uint256 amount) public {
        require(amount > 0, "Cannot stake 0 tokens");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        
        _transfer(msg.sender, address(this), amount);
        stakingBalance[msg.sender] += amount;
        lastStakeTime[msg.sender] = block.timestamp;
    }
    
    function unstake() public {
        uint256 stakedAmount = stakingBalance[msg.sender];
        require(stakedAmount > 0, "No tokens staked");
        
        // Calculate and mint rewards
        uint256 reward = calculateReward(msg.sender);
        if (reward > 0) {
            _mint(msg.sender, reward);
        }
        
        // Return staked tokens
        _transfer(address(this), msg.sender, stakedAmount);
        stakingBalance[msg.sender] = 0;
        lastStakeTime[msg.sender] = 0;
    }
    
    function calculateReward(address account) public view returns (uint256) {
        uint256 stakedAmount = stakingBalance[account];
        if (stakedAmount == 0) return 0;
        
        uint256 timeStaked = block.timestamp - lastStakeTime[account];
        // 1% APR (approximately 0.00273% per day)
        return (stakedAmount * timeStaked * 1) / (365 days * 100);
    }
    
    // Quiz functions
    function submitQuizAnswers(bool[5] calldata answers) external {
        require(!hasCompletedQuiz[msg.sender], "Quiz already completed");
        
        bool allCorrect = true;
        for (uint i = 0; i < 5; i++) {
            if (answers[i] != quizAnswers[i]) {
                allCorrect = false;
                break;
            }
        }
        
        hasCompletedQuiz[msg.sender] = true;
        
        if (allCorrect) {
            _mint(msg.sender, QUIZ_REWARD);
        }
    }
    
    // View functions
    function getStakingBalance(address account) external view returns (uint256) {
        return stakingBalance[account];
    }
    
    function getPendingReward(address account) external view returns (uint256) {
        return calculateReward(account);
    }
} 