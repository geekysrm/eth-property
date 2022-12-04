import React from "react";
import { Flex, Heading, Box, Image } from "@chakra-ui/react";

export default function Tech() {
  return (
    <Flex justifyContent="center" alignItems="center" flexDirection="column">
      <Heading fontWeight="extrabold" letterSpacing="tight" size="lg" mb={5}>
        Technolgies Used
      </Heading>
      <Flex justifyContent="center" alignItems="center">
        <Box mx={10}>
          <Image
            src="/images/ethereum-logo.png"
            alt="ethereum"
            boxSize="80px"
            objectFit="contain"
          />
        </Box>
        <Box mx={10}>
          <Image
            src="/images/push.png"
            alt="Push Protocol"
            boxSize="80px"
            objectFit="contain"
          />
        </Box>
        <Box mx={10}>
          <Image
            src="/images/ipfs.png"
            alt="IPFS"
            boxSize="80px"
            objectFit="contain"
          />
        </Box>
        <Box mx={10}>
          <Image
            src="/images/lighthouse.png"
            alt="LightHouse"
            boxSize="80px"
            objectFit="contain"
          />
        </Box>

        <Box mx={6}>
          <Image
            src="/images/react-logo.png"
            alt="React"
            boxSize="120px"
            objectFit="contain"
          />
        </Box>
        <Box mx={6}>
          <Image
            src="/images/chakraui-logo.png"
            alt="ChakraUI"
            boxSize="70px"
            objectFit="contain"
          />
        </Box>
      </Flex>
    </Flex>
  );
}
