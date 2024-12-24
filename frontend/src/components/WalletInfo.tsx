import { useState, useEffect } from 'react';
import { Box, Button, Grid, GridItem, Stat, StatLabel, StatNumber, Text, useToast } from '@chakra-ui/react';
import { ethers } from 'ethers';
import { FaWallet, FaEthereum, FaCoins } from 'react-icons/fa';

export function WalletInfo() {
  const [account, setAccount] = useState<string>('');
  const [balance, setBalance] = useState<string>('0');
  const [tokenBalance, setTokenBalance] = useState<string>('0');
  const toast = useToast();

  async function connectWallet() {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        setAccount(account);
        
        const provider = new ethers.BrowserProvider(window.ethereum);
        const balance = await provider.getBalance(account);
        setBalance(ethers.formatEther(balance));

        // Add your token contract address here
        const tokenAddress = '0x8Eb1eEBfC0589dae5ac4adC63567cb670d907D6e';
        const tokenAbi = ["function balanceOf(address) view returns (uint256)"];
        const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, provider);
        const tokenBalance = await tokenContract.balanceOf(account);
        setTokenBalance(ethers.formatEther(tokenBalance));
      } else {
        toast({
          title: 'MetaMask not found',
          description: 'Please install MetaMask to use this dApp',
          status: 'error',
          duration: 5000,
        });
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast({
        title: 'Connection Error',
        description: 'Failed to connect wallet',
        status: 'error',
        duration: 5000,
      });
    }
  }

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        setAccount(accounts[0] || '');
      });
    }
  }, []);

  return (
    <Box w="full" p={6} borderRadius="xl" bg="whiteAlpha.100" backdropFilter="blur(10px)" boxShadow="xl">
      {!account ? (
        <Button
          leftIcon={<FaWallet />}
          colorScheme="purple"
          size="lg"
          onClick={connectWallet}
          w="full"
          _hover={{ transform: 'scale(1.02)' }}
          transition="all 0.2s"
        >
          Connect Wallet
        </Button>
      ) : (
        <Grid templateColumns="repeat(3, 1fr)" gap={6}>
          <GridItem>
            <Stat>
              <StatLabel color="whiteAlpha.700">Wallet Address</StatLabel>
              <StatNumber fontSize="md" isTruncated>
                {account}
              </StatNumber>
            </Stat>
          </GridItem>
          <GridItem>
            <Stat>
              <StatLabel color="whiteAlpha.700">ETH Balance</StatLabel>
              <StatNumber>
                <Text display="flex" alignItems="center" gap={2}>
                  <FaEthereum />
                  {Number(balance).toFixed(4)}
                </Text>
              </StatNumber>
            </Stat>
          </GridItem>
          <GridItem>
            <Stat>
              <StatLabel color="whiteAlpha.700">SCOTT Balance</StatLabel>
              <StatNumber>
                <Text display="flex" alignItems="center" gap={2}>
                  <FaCoins />
                  {Number(tokenBalance).toFixed(2)}
                </Text>
              </StatNumber>
            </Stat>
          </GridItem>
        </Grid>
      )}
    </Box>
  );
} 