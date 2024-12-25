import {
  Box,
  Text,
  Link,
  HStack,
  useClipboard,
  IconButton,
  Tooltip,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { FaCopy, FaExternalLinkAlt } from 'react-icons/fa';

const CONTRACT_ADDRESS = '0xB47d6CD97E198b001Ec46ed716d73b5f07452160';

export function NetworkInfo() {
  const { hasCopied, onCopy } = useClipboard(CONTRACT_ADDRESS);

  return (
    <Alert status="info" variant="subtle" borderRadius="xl">
      <AlertIcon />
      <Box fontSize="sm">
        <Text mb={2}>
          To interact with this dApp, you need some faucet in Sepolia. You can get it here:
          <Link href="https://cloud.google.com/application/web3/faucet" isExternal ml={1} color="purple.300">
            Sepolia ETH <FaExternalLinkAlt style={{ display: 'inline', marginBottom: '2px' }} />
          </Link>
        </Text>
        <HStack spacing={2} alignItems="center">
          <Text>Contract Address:</Text>
          <Text color="purple.300" fontFamily="monospace">{CONTRACT_ADDRESS}</Text>
          <Tooltip label={hasCopied ? "Copied!" : "Copy address"}>
            <IconButton
              aria-label="Copy contract address"
              icon={<FaCopy />}
              size="xs"
              onClick={onCopy}
              variant="ghost"
              colorScheme="purple"
            />
          </Tooltip>
          <Text>(you may need to import this token manually in MetaMask)</Text>
        </HStack>
      </Box>
    </Alert>
  );
} 