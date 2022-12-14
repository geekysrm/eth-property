import React, { useState } from "react";
import {
  chakra,
  Box,
  Flex,
  useColorModeValue,
  SimpleGrid,
  GridItem,
  Text,
  Stack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Link,
  Spinner,
} from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import addProperty from "../ethereum/addProperty";

import uploadFile from "../ipfsFileUpload";

export default function AddPropertyForm() {
  const [propertyName, setPropertyName] = useState("");
  const [propertyAddress, setPropertyAddress] = useState("");
  const [zip, setZip] = useState("");
  const [propertyDimensions1, setPropertyDimensions1] = useState(null);
  const [propertyDimensions2, setPropertyDimensions2] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const [fileUploadLoading, setFileUploadLoading] = useState(false);
  const [fileIPFSUrl, setFileIPFSUrl] = useState(null);

  const [loading, setLoading] = useState(false);

  const history = useHistory();

  async function handleSubmit(e) {
    e.preventDefault();

    if (typeof window.ethereum !== "undefined") {
      setLoading(true);

      const { ethereum } = window;
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log(accounts);

      if (accounts !== 0) {
        const userAddress = accounts[0];
        console.log(userAddress);

        const dimensions =
          `${propertyDimensions1}X${propertyDimensions2}`.toString();

        await addProperty(
          uuidv4(),
          propertyName,
          propertyAddress,
          dimensions,
          zip,
          latitude,
          longitude,
          fileIPFSUrl
        );

        setLoading(false);
        console.log("done");

        history.push(`/user/${userAddress}`);
      }
    }
  }

  return (
    <Box bg={useColorModeValue("gray.50", "inherit")} p={10}>
      <Flex mt={[10, 0]} w="full" justifyContent="center">
        <Flex
          justifyContent="center"
          w="full"
          display={{ base: "initial", md: "grid" }}
          columns={{ md: 3 }}
          spacing={{ md: 6 }}
        >
          <GridItem mt={[5, null, 0]} colSpan={{ md: 2 }}>
            <chakra.form
              onSubmit={handleSubmit}
              shadow="base"
              rounded={[null, "md"]}
              overflow={{ sm: "hidden" }}
            >
              <Stack
                px={4}
                py={5}
                p={[null, 6]}
                bg={useColorModeValue("white", "gray.700")}
                spacing={6}
              >
                <SimpleGrid columns={6} spacing={6}>
                  <FormControl as={GridItem} colSpan={[6, 6]}>
                    <FormLabel
                      htmlFor="name"
                      fontSize="sm"
                      fontWeight="md"
                      color={useColorModeValue("gray.700", "gray.50")}
                    >
                      Property Name
                    </FormLabel>
                    <Input
                      placeholder="Antilla"
                      type="text"
                      name="name"
                      id="name"
                      mt={1}
                      focusBorderColor="brand.400"
                      shadow="sm"
                      size="sm"
                      w="full"
                      rounded="md"
                      value={propertyName}
                      onChange={(e) => setPropertyName(e.target.value)}
                      required
                    />
                  </FormControl>

                  <FormControl as={GridItem} colSpan={[6, 6]}>
                    <FormLabel
                      htmlFor="address"
                      fontSize="sm"
                      fontWeight="md"
                      color={useColorModeValue("gray.700", "gray.50")}
                    >
                      Property Address
                    </FormLabel>
                    <Input
                      placeholder="Altamount Road, Cumballa Hill, Mumbai, India"
                      type="text"
                      name="address"
                      id="address"
                      autoComplete="given-name"
                      mt={1}
                      focusBorderColor="brand.400"
                      shadow="sm"
                      size="sm"
                      w="full"
                      rounded="md"
                      value={propertyAddress}
                      onChange={(e) => setPropertyAddress(e.target.value)}
                      required
                    />
                  </FormControl>

                  <FormControl as={GridItem} colSpan={[6, 6]}>
                    <FormLabel
                      htmlFor="zip"
                      fontSize="sm"
                      fontWeight="md"
                      color={useColorModeValue("gray.700", "gray.50")}
                    >
                      ZipCode
                    </FormLabel>
                    <Input
                      placeholder="XXXXXX"
                      type="text"
                      name="zip"
                      id="zip"
                      mt={1}
                      focusBorderColor="brand.400"
                      shadow="sm"
                      size="sm"
                      w="full"
                      rounded="md"
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      required
                    />
                  </FormControl>

                  <FormControl as={GridItem} colSpan={[6, 6]}>
                    <FormLabel
                      htmlFor="dimensions"
                      fontSize="sm"
                      fontWeight="md"
                      color={useColorModeValue("gray.700", "gray.50")}
                    >
                      Property Dimensions (sqft.)
                    </FormLabel>
                    <Input
                      mr="4"
                      type="number"
                      name="dimensions"
                      id="dimensions"
                      mt={1}
                      focusBorderColor="brand.400"
                      shadow="sm"
                      size="sm"
                      w="40%"
                      rounded="md"
                      value={propertyDimensions1}
                      onChange={(e) => setPropertyDimensions1(e.target.value)}
                      required
                    />
                    <b>X</b>
                    <Input
                      ml="4"
                      type="number"
                      name="dimensions"
                      id="dimensions"
                      mt={1}
                      focusBorderColor="brand.400"
                      shadow="sm"
                      size="sm"
                      w="40%"
                      rounded="md"
                      value={propertyDimensions2}
                      onChange={(e) => setPropertyDimensions2(e.target.value)}
                      required
                    />
                  </FormControl>

                  {/* To add dropdown for popular land measuring units */}

                  <FormControl as={GridItem} colSpan={[6, 6]}>
                    <FormLabel
                      htmlFor="dimensions"
                      fontSize="sm"
                      fontWeight="md"
                      color={useColorModeValue("gray.700", "gray.50")}
                    >
                      Property File
                    </FormLabel>

                    {fileIPFSUrl ? (
                      <Link color="purple.500" href={fileIPFSUrl}>
                        {" "}
                        Property File stored on IPFS{" "}
                      </Link>
                    ) : fileUploadLoading ? (
                      <Spinner />
                    ) : (
                      <Input
                        type="file"
                        name="file"
                        id="file"
                        mt={1}
                        focusBorderColor="brand.400"
                        shadow="sm"
                        size="sm"
                        rounded="md"
                        onChange={async (e) => {
                          setFileUploadLoading(true);

                          const fileUrl = await uploadFile(e);

                          setFileUploadLoading(false);
                          setFileIPFSUrl(fileUrl);
                        }}
                        required
                      />
                    )}
                  </FormControl>

                  <FormControl display="flex" as={GridItem} colSpan={[6, 6]}>
                    <Box mr="5" w="40%">
                      <Text
                        fontSize="sm"
                        fontWeight="md"
                        color={useColorModeValue("gray.700", "gray.50")}
                      >
                        Latitude
                      </Text>
                      <Input
                        type="number"
                        name="latitude"
                        id="latitude"
                        mt={1}
                        focusBorderColor="brand.400"
                        shadow="sm"
                        size="sm"
                        rounded="md"
                        value={latitude}
                        onChange={(e) => setLatitude(e.target.value)}
                        required
                      />
                    </Box>

                    <Box ml="5" w="40%">
                      <Text
                        fontSize="sm"
                        fontWeight="md"
                        color={useColorModeValue("gray.700", "gray.50")}
                      >
                        Longitude
                      </Text>

                      <Input
                        type="number"
                        name="longitude"
                        id="longitude"
                        mt={1}
                        focusBorderColor="brand.400"
                        shadow="sm"
                        size="sm"
                        rounded="md"
                        value={longitude}
                        onChange={(e) => setLongitude(e.target.value)}
                        required
                      />
                    </Box>
                  </FormControl>

                  <Button
                    gridRowStart={7}
                    gridColumnStart={6}
                    type="submit"
                    colorScheme="purple"
                    width={40}
                  >
                    {loading ? <Spinner></Spinner> : <p>Add Property</p>}
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
