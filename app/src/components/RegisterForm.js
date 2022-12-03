import React, { useState } from 'react';
import {
  chakra,
  Box,
  Flex,
  useColorModeValue,
  SimpleGrid,
  GridItem,
  Stack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Spinner,
} from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';

import registerUser from "../ethereum/registerUser";

export default function Component() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [loading, setLoading] = useState(false);

  const history = useHistory();

  async function handleSubmit(e) {
    e.preventDefault();

    if (typeof window.ethereum !== "undefined") { 

        setLoading(true);

        const { ethereum } = window;
        const accounts = await ethereum.request({method: 'eth_requestAccounts'});

        console.log(accounts);

        if(accounts !== 0){
          const userAddress = accounts[0];
          console.log(userAddress);

          await registerUser(name, email, mobileNo);

          setLoading(false);
          console.log("done");

          history.push(`/user/${userAddress}`);
        }
    }
  }

  return (
    <Box bg={useColorModeValue('gray.50', 'inherit')} p={10}>
      <Flex mt={[10, 0]} w="full" justifyContent="center">
        <Flex
          justifyContent="center"
          w="full"
          display={{ base: 'initial', md: 'grid' }}
          columns={{ md: 3 }}
          spacing={{ md: 6 }}
        >
          <GridItem mt={[5, null, 0]} colSpan={{ md: 2 }}>
            <chakra.form
              onSubmit={handleSubmit}
              shadow="base"
              rounded={[null, 'md']}
              overflow={{ sm: 'hidden' }}
            >
              <Stack
                px={4}
                py={5}
                p={[null, 6]}
                bg={useColorModeValue('white', 'gray.700')}
                spacing={6}
              >
                <SimpleGrid columns={6} spacing={6}>
                  <FormControl as={GridItem} colSpan={[6, 6]}>
                    <FormLabel
                      htmlFor="first_name"
                      fontSize="sm"
                      fontWeight="md"
                      color={useColorModeValue('gray.700', 'gray.50')}
                    >
                      Name
                    </FormLabel>
                    <Input
                      type="text"
                      name="first_name"
                      id="first_name"
                      autoComplete="given-name"
                      mt={1}
                      focusBorderColor="brand.400"
                      shadow="sm"
                      size="sm"
                      w="full"
                      rounded="md"
                      value={name}
                      onChange={e => setName(e.target.value)}
                    />
                  </FormControl>

                  <FormControl as={GridItem} colSpan={[6, 6]}>
                    <FormLabel
                      htmlFor="email_address"
                      fontSize="sm"
                      fontWeight="md"
                      color={useColorModeValue('gray.700', 'gray.50')}
                    >
                      Email address
                    </FormLabel>
                    <Input
                      type="text"
                      name="email_address"
                      id="email_address"
                      autoComplete="email"
                      mt={1}
                      focusBorderColor="brand.400"
                      shadow="sm"
                      size="sm"
                      w="full"
                      rounded="md"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </FormControl>

                  <FormControl as={GridItem} colSpan={[6, 6]}>
                    <FormLabel
                      htmlFor="mobile_number"
                      fontSize="sm"
                      fontWeight="md"
                      color={useColorModeValue('gray.700', 'gray.50')}
                    >
                      Phone number
                    </FormLabel>
                    <Input
                      type="tel"
                      name="mobile_number"
                      id="mobile_number"
                      mt={1}
                      focusBorderColor="brand.400"
                      shadow="sm"
                      size="sm"
                      w="full"
                      rounded="md"
                      value={mobileNo}
                      onChange={e => setMobileNo(e.target.value)}
                    />
                  </FormControl>

                  <Button
                    gridColumnStart={6}
                    type="submit"
                    colorScheme="purple"
                    width={40}
                  >
                    {loading ? <Spinner></Spinner> : <p>Register</p>}
                  </Button>
                </SimpleGrid>
              </Stack>
            </chakra.form>
          </GridItem>
        </Flex>
      </Flex>
    </Box>
  );
}
