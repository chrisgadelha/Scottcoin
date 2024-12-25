# 🌐 Scottcoin Frontend

The modern and responsive web interface for the Scottcoin (SCOTT) token.

## ✨ Features

- **Wallet Integration**: Seamless connection with MetaMask and other Web3 wallets
- **Token Management**: View balance, transfer tokens, and check transaction history
- **Interactive Quiz**: Earn SCOTT tokens by testing your blockchain knowledge
- **Staking Interface**: Stake tokens and track rewards
- **Responsive Design**: Beautiful UI that works on all devices

## 🛠️ Built With

- React 18
- TypeScript
- Chakra UI
- Web3.js
- Vite
- React Icons

## 🚀 Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

Add the following to your `.env`:
```
VITE_CONTRACT_ADDRESS=your_contract_address
VITE_NETWORK_ID=11155111  # Sepolia testnet
```

3. Start development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## 📁 Project Structure

```
src/
├── components/         # React components
├── contexts/          # React contexts
├── hooks/             # Custom hooks
├── types/             # TypeScript types
└── utils/             # Utility functions
```

## 🎨 UI Components

- **Header**: Main navigation and branding
- **WalletInfo**: Displays wallet connection and balance
- **TokenActions**: Transfer and management interface
- **Quiz**: Interactive blockchain quiz
- **Staking**: Token staking interface
- **TransactionHistory**: List of token transactions

## 🔧 Configuration

The frontend connects to the Scottcoin smart contract on the Sepolia testnet. Make sure your wallet is configured for Sepolia and has some test ETH for transactions.

## 📱 Responsive Design

The interface is optimized for:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.
