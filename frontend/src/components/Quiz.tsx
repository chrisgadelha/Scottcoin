import { useState } from 'react';
import {
  Box,
  VStack,
  Text,
  Button,
  Checkbox,
  useToast,
  Heading,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import { ethers } from 'ethers';
import { FaBrain } from 'react-icons/fa';

interface Question {
  text: string;
  explanation: string;
}

const questions: Question[] = [
  {
    text: "Bitcoin was the first implementation of blockchain technology.",
    explanation: "While Bitcoin was the first successful cryptocurrency, blockchain concepts were described earlier in academic papers."
  },
  {
    text: "Smart contracts can only be deployed on the Ethereum network.",
    explanation: "Many blockchain platforms support smart contracts, including Solana, Cardano, and others."
  },
  {
    text: "Proof of Work (PoW) consensus requires computational power to validate transactions.",
    explanation: "PoW miners compete to solve complex mathematical puzzles, consuming significant computational power."
  },
  {
    text: "Public blockchains allow anyone to participate in the network.",
    explanation: "Public blockchains are permissionless and open for anyone to join, unlike private blockchains."
  },
  {
    text: "NFTs can only be used for digital art.",
    explanation: "NFTs can represent any unique digital or real-world asset, not just art."
  }
];

export function Quiz() {
  const [answers, setAnswers] = useState<boolean[]>(new Array(5).fill(false));
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  async function handleSubmit() {
    try {
      setIsLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const tokenAddress = 'NOVO_ENDEREÇO_DO_CONTRATO';
      const tokenAbi = [
        "function submitQuizAnswers(bool[5] answers) external",
        "function hasCompletedQuiz(address) view returns (bool)"
      ];
      
      const contract = new ethers.Contract(tokenAddress, tokenAbi, signer);
      
      // Check if user has already completed the quiz
      const hasCompleted = await contract.hasCompletedQuiz(await signer.getAddress());
      if (hasCompleted) {
        toast({
          title: 'Quiz already completed',
          description: 'You can only complete the quiz once',
          status: 'warning',
          duration: 5000,
        });
        return;
      }

      const tx = await contract.submitQuizAnswers(answers);
      await tx.wait();
      
      setSubmitted(true);
      toast({
        title: 'Quiz submitted!',
        description: 'Check your wallet for SCOTT tokens if you got all answers correct!',
        status: 'success',
        duration: 5000,
      });
    } catch (error) {
      console.error('Quiz submission error:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit quiz',
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
            <FaBrain />
            Blockchain Quiz Challenge
          </Heading>
          <Text color="whiteAlpha.800">
            Answer all questions correctly to earn 10 SCOTT tokens! You can only participate once.
          </Text>
        </Box>

        <Alert status="info" borderRadius="md">
          <AlertIcon />
          <Box>
            <AlertTitle>How it works</AlertTitle>
            <AlertDescription>
              1. Read each statement carefully<br />
              2. Mark it as True or False<br />
              3. Submit your answers<br />
              4. Get 10 SCOTT tokens for all correct answers!
            </AlertDescription>
          </Box>
        </Alert>

        {questions.map((question, index) => (
          <Box key={index} p={4} borderRadius="md" bg="whiteAlpha.50">
            <VStack align="stretch" spacing={2}>
              <Text color="whiteAlpha.900" fontWeight="500">
                {index + 1}. {question.text}
              </Text>
              <Checkbox
                isChecked={answers[index]}
                onChange={(e) => {
                  const newAnswers = [...answers];
                  newAnswers[index] = e.target.checked;
                  setAnswers(newAnswers);
                }}
                colorScheme="purple"
                isDisabled={submitted}
              >
                Mark as True
              </Checkbox>
              {submitted && (
                <Text fontSize="sm" color="purple.300" fontStyle="italic">
                  {question.explanation}
                </Text>
              )}
            </VStack>
          </Box>
        ))}

        <Button
          colorScheme="purple"
          size="lg"
          onClick={handleSubmit}
          isLoading={isLoading}
          loadingText="Submitting..."
          isDisabled={submitted}
          _hover={{ transform: 'scale(1.02)' }}
          transition="all 0.2s"
        >
          Submit Answers
        </Button>
      </VStack>
    </Box>
  );
} 