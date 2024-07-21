"use client"
import { useState } from 'react';
import { Container, Text, FormControl, FormLabel, Input, Button, Card, CardBody, useToast } from '@chakra-ui/react';
import { login } from '../../api/auth';
import { deleteCookie, setCookies, getCookie } from '@/actions/cookies';
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const toast = useToast();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const logindata = await login(email, password);
      await deleteCookie("authToken");
      await setCookies("authToken", logindata.data.token);
      router.push("/");      
    } catch (error) {
      toast({
        title: 'Login failed.',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Container>
      <Text as={"h1"}>Login</Text>
      <hr />
      <form onSubmit={handleLogin}>
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

export default LoginPage;
