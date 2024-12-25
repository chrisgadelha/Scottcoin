import { Box, Heading, HStack, Text } from '@chakra-ui/react';
import { FaCoins } from 'react-icons/fa';

export function Header() {
  return (
    <Box 
      w="full" 
      p={6} 
      borderRadius="xl" 
      bg="rgba(23, 25, 35, 0.9)"
      backdropFilter="blur(10px)" 
      boxShadow="0 4px 30px rgba(0, 0, 0, 0.3)"
      position="relative"
      _after={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: 'xl',
        background: 'linear-gradient(135deg, rgba(46, 144, 255, 0.1) 0%, rgba(128, 0, 255, 0.1) 100%)',
        pointerEvents: 'none',
        opacity: 0.7,
      }}
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: 'xl',
        border: '1px solid',
        borderColor: 'whiteAlpha.200',
        pointerEvents: 'none',
      }}
    >
      <HStack spacing={4} justify="center" position="relative" zIndex={1}>
        <Box 
          bg="rgba(255, 255, 255, 0.1)"
          p={3}
          borderRadius="full"
          boxShadow="0 0 20px rgba(255, 215, 0, 0.2)"
          border="1px solid rgba(255, 215, 0, 0.3)"
          transition="all 0.3s ease"
          _hover={{
            transform: 'scale(1.05)',
            boxShadow: '0 0 25px rgba(255, 215, 0, 0.3)',
          }}
        >
          <FaCoins size={32} color="#FFD700" style={{ filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.5))' }} />
        </Box>
        <Box>
          <Heading 
            size="lg" 
            bgGradient="linear(to-r, #4FACFE, #00F2FE, #A8EDEA, #B721FF)"
            bgClip="text"
            letterSpacing="wide"
          >
            Scottcoin (SCOTT)
          </Heading>
          <Text 
            fontSize="sm" 
            color="whiteAlpha.800"
            textShadow="0 0 10px rgba(255, 255, 255, 0.1)"
          >
            Your Gateway to the Future of Digital Assets
          </Text>
        </Box>
      </HStack>
    </Box>
  );
} 