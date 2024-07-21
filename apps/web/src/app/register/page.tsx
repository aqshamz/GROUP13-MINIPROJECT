"use client"
import { useState } from 'react';
import { Container, Text, FormControl, FormLabel, Input, Button, Card, CardBody, useToast, Select } from '@chakra-ui/react';
import { register } from '../../api/auth';
import { deleteCookie, setCookies, getCookie } from '@/actions/cookies';
import { useRouter } from "next/navigation";

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [referralCode, setReferralCode] = useState('');

  const toast = useToast();
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const registerdata = await register(username, email, password, role, referralCode);

      toast({
        title: registerdata.message,
        duration: 5000,
        isClosable: true,
        status: 'success',
      });
      router.push("/login");      
      
    } catch (error) {
      let errorMessage = 'Registration failed';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({
        title: errorMessage,
        duration: 5000,
        isClosable: true,
        status: 'error',
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
              <FormLabel>Username</FormLabel>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </FormControl>
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
              <FormLabel>Account Type</FormLabel>
              <Select placeholder='Register As ?' onChange={(e) => setRole(e.target.value)}>
                <option value='Customer'>Users</option>
                <option value='Organizer'>Event Organizer</option>
              </Select>
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Referral Code</FormLabel>
              <Input
                type="text"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
              />
            </FormControl>
            <FormControl mt={4}>
              <Button color={"blue.500"} type="submit">
                Create
              </Button>
            </FormControl>
          </CardBody>
        </Card>
      </form>
    </Container>
  );
};

export default RegisterPage;
