"use client"
import { useState } from 'react';
import { Container, Text, FormControl, FormLabel, Input, Button, Card, CardBody, useToast } from '@chakra-ui/react';
import { register } from '../../api/auth';
import { deleteCookie, setCookies, getCookie } from '@/actions/cookies';
import { useRouter } from "next/navigation";

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const toast = useToast();
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const registerdata = await register(email, password);
      toast({
        title: 'Register Success.',
        duration: 5000,
        isClosable: true,
      });
      router.push("/login");      
    } catch (error) {
      toast({
        title: 'Register failed.',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Container>
      <Text as={"h1"}>Register</Text>
      <hr />
      <form onSubmit={handleRegister}>
        <Card>
          <CardBody>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            <FormControl mt={4}>
              <Button color={"blue.500"} type="submit">
                Submit
              </Button>
            </FormControl>
          </CardBody>
        </Card>
      </form>
    </Container>
  );
};

export default RegisterPage;
