# 🪙 Scottcoin (SCOTT)

A modern ERC-20 token with interactive features built on the Ethereum blockchain.


## 🌟 Features

- **ERC-20 Token**: Fully compliant with the ERC-20 standard
- **Interactive Quiz**: Earn 10 SCOTT tokens by correctly answering blockchain-related questions
- **Staking System**: Stake your SCOTT tokens to earn rewards
- **Modern UI**: Beautiful and responsive interface built with React and Chakra UI
- **Web3 Integration**: Seamless connection with MetaMask and other Web3 wallets

## 🚀 Live Demo

Visit [Scottcoin dApp](https://scottcoin.vercel.app/) to interact with the token on Sepolia testnet.

## 🛠️ Technology Stack

### Smart Contracts
- Solidity
- Hardhat
- OpenZeppelin
- Ethers.js

### Frontend
- React
- TypeScript
- Chakra UI
- Web3.js
- Vite

## 🏗️ Project Structure

```
scottcoin/
├── contracts/           # Smart contract source files
│   └── Scottcoin.sol   # Main ERC-20 token contract
├── frontend/           # React frontend application
├── scripts/            # Deployment and utility scripts
└── test/              # Contract test files
```

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/chrisgadelha/Scottcoin
cd scottcoin
```

2. Install dependencies:
```bash
# Install contract dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
```

3. Set up environment variables:
```bash
# In root directory
cp .env.example .env
# Add your configuration

# In frontend directory
cp .env.example .env
# Add your configuration
```

## 🔧 Development

1. Start local blockchain:
```bash
npx hardhat node
```

2. Deploy contracts:
```bash
npx hardhat run scripts/deploy.ts --network localhost
```

3. Start frontend:
```bash
cd frontend
npm run dev
```

## 🧪 Testing

Run the test suite:
```bash
npx hardhat test
```

## 📱 Features in Detail

### Quiz System
- Answer 5 blockchain-related questions
- Get rewarded with 10 SCOTT tokens for correct answers
- One attempt per wallet address

### Staking
- Stake your SCOTT tokens
- Earn daily rewards
- Flexible unstaking

## 🌐 Deployment

The smart contract is deployed on:
- Sepolia Testnet: `0xB47d6CD97E198b001Ec46ed716d73b5f07452160`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenZeppelin for secure contract implementations
- Hardhat development environment
- Chakra UI for the beautiful interface
- The Ethereum community

## 📞 Contact

- GitHub: [@chrisgadelha](https://github.com/chrisgadelha)
- X.com: [@GadelhaWeb3](https://x.com/GadelhaWeb3)
