import { Box, ChakraProvider, Container, extendTheme, VStack } from '@chakra-ui/react';
import { Header } from './components/Header';
import { WalletInfo } from './components/WalletInfo';
import { TokenActions } from './components/TokenActions';
import { TransactionHistory } from './components/TransactionHistory';

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: 'gray.900',
        color: 'white'
      }
    }
  },
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  }
});

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Box minH="100vh" bg="gray.900" backgroundImage="radial-gradient(circle at 50% 50%, rgba(50, 50, 150, 0.2) 0%, transparent 100%)">
        <Container maxW="container.xl" py={8}>
          <VStack spacing={8}>
            <Header />
            <WalletInfo />
            <TokenActions />
            <TransactionHistory />
          </VStack>
        </Container>
      </Box>
    </ChakraProvider>
  );
}

export default App;
