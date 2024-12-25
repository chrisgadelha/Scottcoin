import { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Text,
  Button,
  Input,
  useToast,
  Heading,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  InputGroup,
  InputRightAddon,
} from '@chakra-ui/react';
import { ethers } from 'ethers';
import { FaLock, FaUnlock, FaCoins } from 'react-icons/fa';

export function Staking() {
  const [stakeAmount, setStakeAmount] = useState('');
  const [stakedBalance, setStakedBalance] = useState('0');
  const [pendingRewards, setPendingRewards] = useState('0');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  async function updateStakingInfo() {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      
      const tokenAddress = 'NOVO_ENDEREÇO_DO_CONTRATO';
      const tokenAbi = [
        "function getStakingBalance(address) view returns (uint256)",
        "function getPendingReward(address) view returns (uint256)"
      ];
      
      const contract = new ethers.Contract(tokenAddress, tokenAbi, provider);
      
      const balance = await contract.getStakingBalance(address);
      const rewards = await contract.getPendingReward(address);
      
      setStakedBalance(ethers.formatEther(balance));
      setPendingRewards(ethers.formatEther(rewards));
    } catch (error) {
      console.error('Error updating staking info:', error);
    }
  }

  useEffect(() => {
    if (window.ethereum) {
      updateStakingInfo();
      const interval = setInterval(updateStakingInfo, 60000); // Update every minute
      return () => clearInterval(interval);
    }
  }, []);

  async function handleStake() {
    if (!stakeAmount) {
      toast({
        title: 'Error',
        description: 'Please enter an amount to stake',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    try {
      setIsLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const tokenAddress = '0x8Eb1eEBfC0589dae5ac4adC63567cb670d907D6e';
      const tokenAbi = [
        "function stake(uint256 amount) public",
        "function approve(address spender, uint256 amount) public returns (bool)"
      ];
      
      const contract = new ethers.Contract(tokenAddress, tokenAbi, signer);
      
      // First approve the contract to spend tokens
      const amount = ethers.parseEther(stakeAmount);
      const approveTx = await contract.approve(tokenAddress, amount);
      await approveTx.wait();
      
      // Then stake
      const stakeTx = await contract.stake(amount);
      await stakeTx.wait();
      
      toast({
        title: 'Success',
        description: 'Tokens staked successfully',
        status: 'success',
        duration: 5000,
      });
      
      setStakeAmount('');
      updateStakingInfo();
    } catch (error) {
      console.error('Staking error:', error);
      toast({
        title: 'Error',
        description: 'Failed to stake tokens',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleUnstake() {
    try {
      setIsLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const tokenAddress = '0x8Eb1eEBfC0589dae5ac4adC63567cb670d907D6e';
      const tokenAbi = ["function unstake() public"];
      
      const contract = new ethers.Contract(tokenAddress, tokenAbi, signer);
      const tx = await contract.unstake();
      await tx.wait();
      
      toast({
        title: 'Success',
        description: 'Tokens unstaked successfully',
        status: 'success',
        duration: 5000,
      });
      
      updateStakingInfo();
    } catch (error) {
      console.error('Unstaking error:', error);
      toast({
        title: 'Error',
        description: 'Failed to unstake tokens',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Box w="full" p={6} borderRadius="xl" bg="whiteAlpha.100" backdropFilter="blur(10px)" boxShadow="xl">
      <VStack spacing={6} align="stretch">
        <Box textAlign="center">
          <Heading size="md" mb={2} display="flex" alignItems="center" justifyContent="center" gap={2}>
            <FaCoins />
            SCOTT Staking
          </Heading>
          <Text color="whiteAlpha.800">
            Stake your SCOTT tokens and earn 1% APR rewards!
          </Text>
        </Box>

        <Alert status="info" borderRadius="md">
          <AlertIcon />
          <Box>
            <AlertTitle>How Staking Works</AlertTitle>
            <AlertDescription>
              1. Enter the amount of SCOTT to stake<br />
              2. Approve and stake your tokens<br />
              3. Earn rewards over time<br />
              4. Unstake anytime to claim rewards
            </AlertDescription>
          </Box>
        </Alert>

        <VStack spacing={4}>
          <Stat>
            <StatLabel color="whiteAlpha.700">Currently Staked</StatLabel>
            <StatNumber>{Number(stakedBalance).toFixed(2)} SCOTT</StatNumber>
            <StatHelpText>Pending Rewards: {Number(pendingRewards).toFixed(4)} SCOTT</StatHelpText>
          </Stat>

          <InputGroup>
            <Input
              type="number"
              placeholder="Amount to stake"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
              bg="whiteAlpha.50"
              border="1px solid"
              borderColor="whiteAlpha.200"
              _hover={{ borderColor: 'purple.400' }}
              _focus={{ borderColor: 'purple.500', boxShadow: '0 0 0 1px var(--chakra-colors-purple-500)' }}
            />
            <InputRightAddon children="SCOTT" bg="whiteAlpha.200" color="whiteAlpha.900" />
          </InputGroup>

          <Button
            leftIcon={<FaLock />}
            colorScheme="purple"
            onClick={handleStake}
            isLoading={isLoading}
            loadingText="Staking..."
            isDisabled={!stakeAmount}
            w="full"
            _hover={{ transform: 'scale(1.02)' }}
            transition="all 0.2s"
          >
            Stake Tokens
          </Button>

          <Button
            leftIcon={<FaUnlock />}
            variant="outline"
            colorScheme="purple"
            onClick={handleUnstake}
            isLoading={isLoading}
            loadingText="Unstaking..."
            isDisabled={Number(stakedBalance) <= 0}
            w="full"
            _hover={{ transform: 'scale(1.02)', bg: 'whiteAlpha.100' }}
            transition="all 0.2s"
          >
            Unstake All
          </Button>
        </VStack>
      </VStack>
    </Box>
  );
} 