import { Box, Heading, HStack, Text } from '@chakra-ui/react';
import { FaCoins } from 'react-icons/fa';

export function Header() {
  return (
    <Box w="full" p={6} borderRadius="xl" bg="whiteAlpha.100" backdropFilter="blur(10px)" boxShadow="xl">
      <HStack spacing={4} justify="center">
        <FaCoins size={32} color="#FFD700" />
        <Box>
          <Heading size="lg" bgGradient="linear(to-r, cyan.400, purple.500)" bgClip="text">
            Scottcoin (SCOTR)
          </Heading>
          <Text fontSize="sm" color="whiteAlpha.700">
            Your Gateway to the Future of Digital Assets
          </Text>
        </Box>
      </HStack>
    </Box>
  );
} 