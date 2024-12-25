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
  Icon,
  HStack,
} from '@chakra-ui/react';
import { ethers } from 'ethers';
import { FaBrain, FaCheck, FaTimes } from 'react-icons/fa';

interface Question {
  text: string;
  explanation: string;
  correctAnswer: boolean;
}

const questions: Question[] = [
  {
    text: "Bitcoin was the first implementation of blockchain technology.",
    explanation: "While Bitcoin was the first successful cryptocurrency, blockchain concepts were described earlier in academic papers.",
    correctAnswer: true
  },
  {
    text: "Smart contracts can only be deployed on the Ethereum network.",
    explanation: "Many blockchain platforms support smart contracts, including Solana, Cardano, and others.",
    correctAnswer: false
  },
  {
    text: "Proof of Work (PoW) consensus requires computational power to validate transactions.",
    explanation: "PoW miners compete to solve complex mathematical puzzles, consuming significant computational power.",
    correctAnswer: true
  },
  {
    text: "Public blockchains allow anyone to participate in the network.",
    explanation: "Public blockchains are permissionless and open for anyone to join, unlike private blockchains.",
    correctAnswer: true
  },
  {
    text: "NFTs can only be used for digital art.",
    explanation: "NFTs can represent any unique digital or real-world asset, not just art.",
    correctAnswer: false
  }
];

export function Quiz() {
  const [answers, setAnswers] = useState<boolean[]>(new Array(5).fill(false));
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [allCorrect, setAllCorrect] = useState(false);
  const toast = useToast();

  async function handleSubmit() {
    try {
      setIsLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const tokenAddress = '0xB47d6CD97E198b001Ec46ed716d73b5f07452160';
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

      // Check if all answers are correct before submitting
      const isAllCorrect = answers.every((answer, index) => answer === questions[index].correctAnswer);
      setAllCorrect(isAllCorrect);

      const tx = await contract.submitQuizAnswers(answers);
      await tx.wait();
      
      setSubmitted(true);
      toast({
        title: isAllCorrect ? 'Congratulations!' : 'Quiz completed',
        description: isAllCorrect 
          ? 'You got all answers correct and received 10 SCOTT tokens!' 
          : 'Some answers were incorrect. Try again with a different wallet to earn tokens.',
        status: isAllCorrect ? 'success' : 'info',
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
                <Box>
                  <HStack spacing={2} color={answers[index] === question.correctAnswer ? "green.300" : "red.300"}>
                    <Icon as={answers[index] === question.correctAnswer ? FaCheck : FaTimes} />
                    <Text fontWeight="500">
                      {answers[index] === question.correctAnswer ? "Correct!" : "Incorrect!"}
                    </Text>
                  </HStack>
                  <Text fontSize="sm" color="purple.300" fontStyle="italic" mt={1}>
                    {question.explanation}
                  </Text>
                </Box>
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

        {submitted && (
          <Alert
            status={allCorrect ? "success" : "warning"}
            variant="subtle"
            borderRadius="md"
          >
            <AlertIcon />
            <AlertDescription>
              {allCorrect
                ? "Congratulations! You answered all questions correctly and earned 10 SCOTT tokens!"
                : "Some answers were incorrect. You can try again with a different wallet to earn tokens."}
            </AlertDescription>
          </Alert>
        )}
      </VStack>
    </Box>
  );
} 