import React, { useEffect, useState } from 'react';
import { NavLink as Link, useParams, useHistory } from 'react-router-dom';
import {
  Flex,
  Box,
  Badge,
  Heading,
  Text,
  Stack,
  Button,
  Accordion,
  AccordionItem,
  AccordionIcon,
  AccordionButton,
  AccordionPanel,
  Icon,
} from '@chakra-ui/react';
import { PhoneIcon, EmailIcon, AddIcon } from '@chakra-ui/icons';

import isUserRegistered from "../ethereum/isUserRegistered";
import isUserAdmin from "../ethereum/isUserAdmin";
import fetchUserDetails from "../ethereum/fetchUserDetails";
import fetchPropertyDetails from "../ethereum/fetchPropertyDetails";
import fetchBuyRequestDetails from "../ethereum/fetchBuyRequestDetails";

import CustomMap from '../components/CustomMap';

export default function UserProfile() {
  const history = useHistory();
  const { userAddress } = useParams();

  const [user, setUser] = useState({});
  const [properties, setProperties] = useState([]);
  const [zoomCoord, setZoomCoord] = useState({
    lat: null,
    lng: null,
  });
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    (async () => {

      if (typeof window.ethereum !== "undefined") { 
        const { ethereum } = window;
        const accounts = await ethereum.request({method: 'eth_requestAccounts'});

        console.log(accounts);

        if(accounts !== 0){
          const userAdd = accounts[0];
          console.log(userAdd);

          const response = await isUserRegistered(userAdd);
          console.log(response);

          if(!response) {
            history.push(`/`);
          } else {

            console.log(userAddress);

            const userDetailsRes = await fetchUserDetails(userAddress);

            console.log(userDetailsRes);

            const adminRes = await isUserAdmin(userAddress);

            const userDetails = {
              name: userDetailsRes[0],
              email: userDetailsRes[1],
              phoneNumber: userDetailsRes[2],
              isAdmin: adminRes
            };

            setUser(userDetails);

            const propertyIds = userDetailsRes[3];

            const propertyDetails = await Promise.all(propertyIds.map(async id => {
              const propertyDetailsRes = await fetchPropertyDetails(id);

              return {
                id: id,
                name: propertyDetailsRes[0],
                dimensions: propertyDetailsRes[2],
                pincode: propertyDetailsRes[3],
                propertyAddress: propertyDetailsRes[1],
                lat: propertyDetailsRes[4],
                lng: propertyDetailsRes[5]
              };
            }));

            console.log(propertyDetails);

            setProperties(propertyDetails);

            const requestIds = userDetailsRes[4];

            const requestDetails = requestIds.map(async id => {
              const requestDetailsRes = await fetchBuyRequestDetails(id);

              const propertyRequestDetailsRes = await fetchPropertyDetails(requestDetailsRes[0]);
              const buyerDetailsRes = await fetchUserDetails(requestDetailsRes[1]);

              return {
                orderId: id,
                propertyId: requestDetailsRes[0],
                propertyName: propertyRequestDetailsRes[0],
                buyerAddress: requestDetailsRes[1],
                buyerName: buyerDetailsRes[0]
              };
            });

            setRequests(requestDetails);
          }
        }
      }
    })();
  }, []);

  function renderAdminBadge() {
    if (user.isAdmin) {
      return (
        <div>
          <Badge colorScheme="purple">ADMIN</Badge>
        </div>
      );
    }
  }

  function onHandleAccordionChange(index) {
    if (index === -1) {
      setZoomCoord({
        lat: null,
        lng: null,
      });
    } else {
      const { lat, lng } = properties[index];
      setZoomCoord({
        lat,
        lng,
      });
    }
  }

  function showPropertyDetails(propertyId) {
    history.push(`/property/${propertyId}`);
  }

  // async function approveBuyRequest(buyRequestId) {
  //   const program = await getProgram(wallet);
  //   const pair = getPair();

  //   await program.rpc.approve(buyRequestId, {
  //     accounts: {
  //       baseAccount: pair.publicKey,
  //     },
  //   });

  //   const account = await program.account.baseAccount.fetch(pair.publicKey);

  //   const currAccount = account.userList.filter(
  //     user => user.address === address
  //   );
  //   setUser({
  //     ...currAccount[0],
  //     isAdmin: account.authority.toString() === address,
  //   });

  //   const properties = currAccount[0].propertyList.map(property => {
  //     return account.propertyList.find(p => {
  //       return p.id === property;
  //     });
  //   });
  //   setProperties(properties);

  //   const yourRequests = currAccount[0].buyOrders
  //     .map(order => {
  //       return account.buyOrderList.find(o => {
  //         return o.orderId === order;
  //       });
  //     })
  //     .filter(order => order.status === 'REQUESTED');
  //   setRequests(yourRequests);

  //   setMainAccount(account);
  // }

  // async function rejectBuyRequest(buyRequestId) {
  //   const program = await getProgram(wallet);
  //   const pair = getPair();

  //   await program.rpc.reject(buyRequestId, {
  //     accounts: {
  //       baseAccount: pair.publicKey,
  //     },
  //   });

  //   const account = await program.account.baseAccount.fetch(pair.publicKey);

  //   const currAccount = account.userList.filter(
  //     user => user.address === address
  //   );
  //   setUser({
  //     ...currAccount[0],
  //     isAdmin: account.authority.toString() === address,
  //   });

  //   const properties = currAccount[0].propertyList.map(property => {
  //     return account.propertyList.find(p => {
  //       return p.id === property;
  //     });
  //   });
  //   setProperties(properties);

  //   const yourRequests = currAccount[0].buyOrders
  //     .map(order => {
  //       return account.buyOrderList.find(o => {
  //         return o.orderId === order;
  //       });
  //     })
  //     .filter(order => order.status === 'REQUESTED');
  //   setRequests(yourRequests);

  //   setMainAccount(account);
  // }

  return (
    <Flex
      style={{
        marginTop: '20px',
        marginBottom: '40px',
        overflowX: 'hidden',
      }}
    >
      <Box width="30%" p={4} m={4} my={0} borderWidth="1px" borderRadius="lg">
        {renderAdminBadge()}
        <Heading size="lg" fontSize="50px" mt={2}>
          {user.name}
        </Heading>
        <Text color="gray.500">{userAddress}</Text>
        <Stack spacing={3} mt={6}>
          <Text fontSize="xl">
            <EmailIcon mr={2} />
            {user.email}
          </Text>
          <Text fontSize="xl">
            <PhoneIcon mr={2} />
            {user.phoneNumber}
          </Text>
        </Stack>
        {user.isAdmin && (
          <Box mt={6} width="100%">
            <Button
              as={Link}
              to="/add/property"
              width="100%"
              leftIcon={<AddIcon />}
              colorScheme="purple"
              variant="outline"
            >
              Add Property
            </Button>
          </Box>
        )}
        <Heading size="lg" mt="10" mb="5">
          Your Properties:
        </Heading>
        {properties.length > 0 ? (
          <Accordion
            allowToggle
            defaultIndex={[0]}
            onChange={onHandleAccordionChange}
          >
            {properties.map(property => (
              <AccordionItem>
                <Text>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      <Heading size="md">{property.name}</Heading>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </Text>
                <AccordionPanel pb={4}>
                  <Text fontSize="lg" display="flex" alignItems="center">
                    {/* <Icon mr="2" as={AiOutlineHome}></Icon> */}
                    {`${property.propertyAddress}, ${property.pincode}`}
                  </Text>
                  <Text fontSize="lg">
                    {/* <Icon mr="2" as={BiArea}></Icon> */}
                    {property.dimensions}
                  </Text>
                  <Button
                    size="sm"
                    variant="outline"
                    mt="5"
                    colorScheme="purple"
                    onClick={() => showPropertyDetails(property.id)}
                  >
                    Show Property
                  </Button>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <Text fontSize="md">No Properties available</Text>
        )}
        <Box mt={6} width="100%">
          <Button
            as={Link}
            to="/marketplace"
            width="100%"
            colorScheme="purple"
            variant="outline"
          >
            Browse Other Properties
          </Button>
        </Box>
        <Heading size="lg" mt="10" mb="5">
          Buy Requests:
        </Heading>
        {requests.length > 0 ? (
          <Accordion allowToggle>
            {requests.map(req => (
              <AccordionItem>
                <Text>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      <Heading size="md">{req.orderId}</Heading>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </Text>
                <AccordionPanel pb={4}>
                  <Text fontSize="xl" display="flex" alignItems="center">
                    {/* <Icon mr="2" as={AiOutlineHome}></Icon> */}
                    {req.propertyName}
                  </Text>
                  <Text fontSize="xl">
                    {/* <Icon mr="2" as={FaUserTie}></Icon> */}
                    {req.buyerName}
                  </Text>
                  <Box width="100%" display="flex">
                    <Button
                      mt="5"
                      ml="2"
                      variant="outline"
                      colorScheme="green"
                      width="100%"
                      onClick={() => {
                        // approveBuyRequest(req.orderId);
                      }}
                    >
                      Approve
                    </Button>
                    <Button
                      mt="5"
                      ml="2"
                      variant="outline"
                      colorScheme="red"
                      width="100%"
                      onClick={() => {
                        // rejectBuyRequest(req.orderId);
                      }}
                    >
                      Reject
                    </Button>
                  </Box>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <Text fontSize="md">No Buy Requests available</Text>
        )}
      </Box>
      <Box width="70%" pl={2} pr={4}>
        <CustomMap
          properties={properties}
          zoomLat={zoomCoord.lat}
          zoomLng={zoomCoord.lng}
        />
      </Box>
    </Flex>
  );
}
