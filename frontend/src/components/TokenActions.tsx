import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
  InputGroup,
  InputRightAddon,
} from '@chakra-ui/react';
import { ethers } from 'ethers';
import { FaPaperPlane } from 'react-icons/fa';

export function TokenActions() {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  async function handleTransfer() {
    if (!recipient || !amount) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    try {
      setIsLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const tokenAddress = 'NOVO_ENDEREÇO_DO_CONTRATO';
      const tokenAbi = [
        "function transfer(address to, uint256 amount) returns (bool)"
      ];
      
      const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, signer);
      const amountInWei = ethers.parseEther(amount);
      
      const tx = await tokenContract.transfer(recipient, amountInWei);
      await tx.wait();

      toast({
        title: 'Success',
        description: 'Transfer completed successfully',
        status: 'success',
        duration: 5000,
      });

      setRecipient('');
      setAmount('');
    } catch (error) {
      console.error('Transfer error:', error);
      toast({
        title: 'Error',
        description: 'Failed to transfer tokens',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Box w="full" p={6} borderRadius="xl" bg="whiteAlpha.100" backdropFilter="blur(10px)" boxShadow="xl">
      <VStack spacing={4}>
        <FormControl>
          <FormLabel color="whiteAlpha.900">Recipient Address</FormLabel>
          <Input
            placeholder="0x..."
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            bg="whiteAlpha.50"
            border="1px solid"
            borderColor="whiteAlpha.200"
            _hover={{ borderColor: 'purple.400' }}
            _focus={{ borderColor: 'purple.500', boxShadow: '0 0 0 1px var(--chakra-colors-purple-500)' }}
          />
        </FormControl>

        <FormControl>
          <FormLabel color="whiteAlpha.900">Amount</FormLabel>
          <InputGroup>
            <Input
              type="number"
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              bg="whiteAlpha.50"
              border="1px solid"
              borderColor="whiteAlpha.200"
              _hover={{ borderColor: 'purple.400' }}
              _focus={{ borderColor: 'purple.500', boxShadow: '0 0 0 1px var(--chakra-colors-purple-500)' }}
            />
            <InputRightAddon children="SCOTT" bg="whiteAlpha.200" color="whiteAlpha.900" />
          </InputGroup>
        </FormControl>

        <Button
          leftIcon={<FaPaperPlane />}
          colorScheme="purple"
          isLoading={isLoading}
          loadingText="Transferring..."
          onClick={handleTransfer}
          w="full"
          _hover={{ transform: 'scale(1.02)' }}
          transition="all 0.2s"
        >
          Transfer Tokens
        </Button>
      </VStack>
    </Box>
  );
} 