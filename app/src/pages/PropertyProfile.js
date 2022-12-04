import React, { useEffect, useState } from "react";
import { NavLink as Link, useParams, useHistory } from "react-router-dom";
import {
  Flex,
  Box,
  Heading,
  Text,
  Stack,
  Button,
  Divider,
  UnorderedList,
  ListItem,
  Icon,
  Input,
  FormControl,
  FormLabel,
  Link as UILink,
  Spinner,
} from "@chakra-ui/react";
import { ExternalLinkIcon, AddIcon, RepeatClockIcon } from "@chakra-ui/icons";
import { v4 as uuid } from "uuid";

import CustomMap from "../components/CustomMap";
import CustomModal from "../components/Modal";

import isUserRegistered from "../ethereum/isUserRegistered";
import fetchPropertyDetails from "../ethereum/fetchPropertyDetails";
import fetchUserDetails from "../ethereum/fetchUserDetails";
import transferProperty from "../ethereum/transferProperty";
import createBuyOrder from "../ethereum/createBuyOrder";

import AreaIcon from "../components/icons/AreaIcon";
import UserIcon from "../components/icons/UserIcon";
import HomeIcon from "../components/icons/HomeIcon";
import { LinkIcon } from "@chakra-ui/icons";

import pushNotification from "../pushNotification";

export default function PropertyProfile() {
  const history = useHistory();
  const { id } = useParams();

  const [userAddress, setUserAddress] = useState(null);
  const [property, setProperty] = useState({});
  const [buyerAddress, setBuyerAddress] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (typeof window.ethereum !== "undefined") {
        const { ethereum } = window;
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });

        console.log(accounts);

        if (accounts !== 0) {
          const userAdd = accounts[0];
          console.log(userAdd);

          setUserAddress(userAdd.toLowerCase());

          const response = await isUserRegistered(userAdd);
          console.log(response);

          if (!response) {
            history.push(`/`);
          } else {
            console.log(id);

            const propertyDetailsRes = await fetchPropertyDetails(id);

            console.log(propertyDetailsRes);

            const ownerDetailsRes = await fetchUserDetails(
              propertyDetailsRes[6]
            );

            const pastOwnerAddresses = propertyDetailsRes[7];

            const pastOwnerNames = await Promise.all(
              pastOwnerAddresses.map(async (add) => {
                const ownerDetailsRes = await fetchUserDetails(add);

                return ownerDetailsRes[0];
              })
            );

            const propertyDetails = {
              id: id,
              name: propertyDetailsRes[0],
              dimensions: propertyDetailsRes[2],
              pincode: propertyDetailsRes[3],
              propertyAddress: propertyDetailsRes[1],
              lat: propertyDetailsRes[4],
              lng: propertyDetailsRes[5],
              currentOwnerAddress: propertyDetailsRes[6].toLowerCase(),
              currentOwnerName: ownerDetailsRes[0],
              pastOwnerAddresses: pastOwnerAddresses,
              pastOwnerNames: pastOwnerNames,
              propertyFileUrl: propertyDetailsRes[8],
            };

            console.log(propertyDetails);

            setProperty(propertyDetails);
          }
        }
      }
    })();
  }, []);

  function renderPastOwners(pastOwnerNames) {
    return pastOwnerNames.map((ownerName) => {
      return <ListItem key={ownerName}>{ownerName}</ListItem>;
    });
  }

  async function onTransferProperty() {
    setLoading(true);

    await transferProperty(id, buyerAddress);

    setLoading(false);
    console.log("done");

    pushNotification(
      buyerAddress,
      "You just owned a property!",
      `Property - ${id} has been successfully transfered to you.`
    );
    pushNotification(
      userAddress,
      "You just transfered your property!",
      `Property - ${id} has been successfully transfered.`
    );

    setIsModalOpen(false);
    setBuyerAddress(null);

    // window.location.reload();
  }

  async function buyRequest() {
    setLoading(true);

    await createBuyOrder(uuid(), id);

    setLoading(false);
    console.log("done");

    pushNotification(
      userAddress,
      "Buy request successfully created!",
      `Buy request for Property - ${id} has been successfully created`
    );

    const propertyDetailsRes = await fetchPropertyDetails(id);

    pushNotification(
      propertyDetailsRes[6],
      "You got a new Buy request!",
      `A new Buy request for your Property - ${id} has been created`
    );

    history.push(`/user/${userAddress}`);
  }

  return (
    <Flex
      style={{
        marginTop: "20px",
        marginBottom: "40px",
        overflowX: "hidden",
      }}
    >
      <Box width="30%" p={4} m={4} my={0} borderWidth="1px" borderRadius="lg">
        <Heading size="lg" fontSize="40px" mt={2}>
          {property.name}
        </Heading>
        <Text color="gray.500">{id}</Text>
        <Stack spacing={3} mt={6}>
          <Flex alignItems="center" fontSize="xl">
            <Icon as={HomeIcon} mr={2} />
            <p style={{ marginLeft: "2px" }}>{property.propertyAddress}</p>
          </Flex>
          <Flex alignItems="center" fontSize="xl">
            <Icon as={AreaIcon} mr={4} />
            <p style={{ marginLeft: "2px" }}>{property.dimensions} sqft.</p>
          </Flex>
          <Flex
            color="purple.300"
            fontSize="xl"
            as={Link}
            alignItems="center"
            to={`/user/${property.currentOwnerAddress}`}
          >
            <Icon as={UserIcon} mr={2} />
            <p style={{ marginLeft: "2px" }}>{property.currentOwnerName}</p>
          </Flex>
          <Flex alignItems="center" fontSize="xl">
            <Icon as={LinkIcon} mr={1.5} />
            <UILink
              isExternal
              color="purple.500"
              href={property.propertyFileUrl}
            >
              {" "}
              Property File stored on IPFS{" "}
            </UILink>
          </Flex>
        </Stack>
        {userAddress && userAddress === property.currentOwnerAddress ? (
          <Box mt={6} width="100%">
            <Button
              width="100%"
              leftIcon={<ExternalLinkIcon />}
              colorScheme="purple"
              variant="outline"
              onClick={() => setIsModalOpen(true)}
            >
              Transfer Property
            </Button>
          </Box>
        ) : (
          <Box mt={6} width="100%">
            <Button
              leftIcon={!loading && <AddIcon />}
              colorScheme="purple"
              variant="outline"
              onClick={buyRequest}
              width="100%"
            >
              {loading ? <Spinner></Spinner> : <p>Buy Request</p>}
            </Button>
          </Box>
        )}
        {property &&
          property.pastOwnerNames &&
          property.pastOwnerNames.length > 0 && (
            <>
              <Divider my={6} />
              <Text fontSize="xl" mb={4}>
                <RepeatClockIcon mr={2} />
                Past Owners
              </Text>
              <UnorderedList>
                {renderPastOwners(property.pastOwnerNames)}
              </UnorderedList>
            </>
          )}
      </Box>
      <Box width="70%" pl={2} pr={4}>
        {Object.keys(property).length > 0 && (
          <CustomMap properties={[property]} />
        )}
      </Box>
      <CustomModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Flex direction="column">
          <FormControl>
            <FormLabel>Transfer To Address</FormLabel>
            <Input
              mt="2"
              type="text"
              placeholder="Enter address"
              onChange={(e) => setBuyerAddress(e.target.value)}
              value={buyerAddress}
            />
          </FormControl>
          <Button
            type="button"
            bg="purple.500"
            mt="5"
            ml="auto"
            onClick={onTransferProperty}
            width={60}
          >
            {loading ? <Spinner></Spinner> : <p>Transfer</p>}
          </Button>
        </Flex>
      </CustomModal>
    </Flex>
  );
}
