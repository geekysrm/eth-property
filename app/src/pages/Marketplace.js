import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Flex,
  Box,
  Heading,
  Text,
  Button,
  Accordion,
  AccordionItem,
  AccordionIcon,
  AccordionButton,
  AccordionPanel,
  Icon,
} from "@chakra-ui/react";

import CustomMap from "../components/CustomMap";

import isUserRegistered from "../ethereum/isUserRegistered";
import fetchPropertyDetails from "../ethereum/fetchPropertyDetails";
import fetchPropertyList from "../ethereum/fetchPropertyList";
import HomeIcon from "../components/icons/HomeIcon";
import AreaIcon from "../components/icons/AreaIcon";

export default function Marketplace() {
  const history = useHistory();

  const [zoomCoord, setZoomCoord] = useState({
    lat: null,
    lng: null,
  });
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    (async () => {
      if (typeof window.ethereum !== "undefined") {
        const { ethereum } = window;
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });

        console.log(accounts);

        if (accounts !== 0) {
          const userAddress = accounts[0];
          console.log(userAddress);

          const response = await isUserRegistered(userAddress);
          console.log(response);

          if (!response) {
            history.push(`/`);
          } else {
            const propertiesRes = await fetchPropertyList();

            console.log(propertiesRes);

            const propertyDetails = await Promise.all(
              propertiesRes.map(async (p) => {
                const propertyRes = await fetchPropertyDetails(p);

                return {
                  id: p,
                  name: propertyRes[0],
                  dimensions: propertyRes[2],
                  pincode: propertyRes[3],
                  propertyAddress: propertyRes[1],
                  lat: propertyRes[4],
                  lng: propertyRes[5],
                };
              })
            );

            console.log(propertyDetails);

            setProperties(propertyDetails);
          }
        }
      }
    })();
  }, []);

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

  return (
    <Flex
      style={{
        marginTop: "20px",
        marginBottom: "40px",
        overflowX: "hidden",
      }}
    >
      <Box width="30%" p={4} m={4} my={0} borderWidth="1px" borderRadius="lg">
        <Heading size="lg" mb="5">
          Marketplace:
        </Heading>
        {properties.length > 0 ? (
          <Accordion
            allowToggle
            defaultIndex={[0]}
            onChange={onHandleAccordionChange}
          >
            {properties.map((property) => (
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
                  <Flex fontSize="lg" display="flex" alignItems="center">
                    <Icon mr="2" as={HomeIcon}></Icon>
                    <p style={{ marginLeft: "2px" }}>
                      {`${property.propertyAddress}, ${property.pincode}`}
                    </p>
                  </Flex>
                  <Flex fontSize="lg" alignItems="center">
                    <Icon mr="2" as={AreaIcon}></Icon>
                    <p style={{ marginLeft: "2px" }}>{property.dimensions}</p>
                  </Flex>
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
          <Text fontSize="md">No Properties available in marketplace</Text>
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
