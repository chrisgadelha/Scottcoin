import { useEffect, useState } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Link,
  Heading,
  HStack,
  Icon,
} from '@chakra-ui/react';
import { ethers, EventLog } from 'ethers';
import { FaExchangeAlt } from 'react-icons/fa';

interface Transaction {
  from: string;
  to: string;
  amount: string;
  timestamp: number;
  hash: string;
}

export function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const tokenAddress = '0x8Eb1eEBfC0589dae5ac4adC63567cb670d907D6e';
        const tokenAbi = [
          "event Transfer(address indexed from, address indexed to, uint256 value)"
        ];
        
        const contract = new ethers.Contract(tokenAddress, tokenAbi, provider);
        const filter = contract.filters.Transfer();
        const events = await contract.queryFilter(filter, -1000);

        const txs = await Promise.all(
          events.map(async (event) => {
            const log = event as EventLog;
            const block = await event.getBlock();
            return {
              from: log.args[0],
              to: log.args[1],
              amount: ethers.formatEther(log.args[2] || 0),
              timestamp: block.timestamp,
              hash: event.transactionHash,
            };
          })
        );

        setTransactions(txs.reverse());
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    }

    if (window.ethereum) {
      fetchTransactions();
    }
  }, []);

  function formatAddress(address: string) {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  function formatTimestamp(timestamp: number) {
    return new Date(timestamp * 1000).toLocaleString();
  }

  return (
    <Box w="full" p={6} borderRadius="xl" bg="whiteAlpha.100" backdropFilter="blur(10px)" boxShadow="xl">
      <HStack spacing={2} mb={4}>
        <Icon as={FaExchangeAlt} color="purple.400" />
        <Heading size="md" color="whiteAlpha.900">Recent Transactions</Heading>
      </HStack>
      
      <Box overflowX="auto">
        <Table variant="simple" size="sm">
          <Thead>
            <Tr>
              <Th color="whiteAlpha.600">Time</Th>
              <Th color="whiteAlpha.600">From</Th>
              <Th color="whiteAlpha.600">To</Th>
              <Th color="whiteAlpha.600">Amount</Th>
              <Th color="whiteAlpha.600">Tx Hash</Th>
            </Tr>
          </Thead>
          <Tbody>
            {transactions.map((tx, index) => (
              <Tr key={index} _hover={{ bg: 'whiteAlpha.50' }}>
                <Td color="whiteAlpha.800">{formatTimestamp(tx.timestamp)}</Td>
                <Td color="whiteAlpha.800">{formatAddress(tx.from)}</Td>
                <Td color="whiteAlpha.800">{formatAddress(tx.to)}</Td>
                <Td color="whiteAlpha.800">{Number(tx.amount).toFixed(2)} SCOTT</Td>
                <Td>
                  <Link
                    href={`https://sepolia.etherscan.io/tx/${tx.hash}`}
                    isExternal
                    color="purple.400"
                    _hover={{ color: 'purple.300' }}
                  >
                    {formatAddress(tx.hash)}
                  </Link>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
} 