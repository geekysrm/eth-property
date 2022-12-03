import * as PushAPI from "@pushprotocol/restapi";
import { useState, useEffect } from "react";
import {
  Heading,
  Container,
  Flex,
  Spinner,
  Card,
  CardBody,
  CardHeader,
  Stack,
  StackDivider,
  Box,
  Text,
  Center,
} from "@chakra-ui/react";

const scenarioToIconMapping = [
  { scenario: "You just owned a property", icon: "↘️" },
  { scenario: "You just transfered your property", icon: "↗️" },
  { scenario: "Buy request successfully created", icon: "➕" },
  { scenario: "You got a new Buy request", icon: "📧" },
  { scenario: "You successfully sold your property", icon: "💰" },
  { scenario: "You successfully bought a property", icon: "🏠" },
  { scenario: "You declined the buy request", icon: "❌" },
  { scenario: "Your buy request was declined", icon: "❗️" },
];

function findAppropriateIcon(title) {
  // title.contains(scenario)
  const foundScenario = scenarioToIconMapping.find((sc) => {
    return title.includes(sc.scenario);
  });
  return foundScenario?.icon || "✅";
}

const Transactions = () => {
  const [notifications, setNotifications] = useState([]);

  const getAllNotifications = async () => {
    const notifications = await PushAPI.user.getFeeds({
      user: "eip155:5:0x934112cfac8c01b8E49DBB72D4d501B98992aEB2", // user address in CAIP
      env: "staging",
    });
    const notificationsFromEthProperty = notifications.filter(
      (notification) => notification.app === "EthProperty"
    );
    console.log({ notificationsFromEthProperty });
    setNotifications(notificationsFromEthProperty);
  };

  useEffect(() => {
    async function callGetAllNotifications() {
      await getAllNotifications();
    }
    callGetAllNotifications();
  }, []);

  return (
    <Container height={"100%"} width={"2000px"}>
      {notifications.length === 0 ? (
        <Spinner></Spinner>
      ) : (
        <Flex alignItems="center" flexDirection="column">
          {/* <Heading>Your Transactions</Heading>
          <div>
            <div>Notif 1</div>
            <div>Notif 1</div>
            <div>Notif 1</div>
          </div> */}
          <Card>
            <CardHeader>
              <Center>
                <Heading size="lg">Your Transactions</Heading>
              </Center>
            </CardHeader>

            <CardBody>
              <Stack divider={<StackDivider />} spacing="4">
                {notifications.map((notification) => {
                  return (
                    <Box>
                      <Heading
                        display={"flex"}
                        size="sm"
                        gap={2}
                        textTransform="uppercase"
                      >
                        <p>{findAppropriateIcon(notification.title)}</p>{" "}
                        {notification.title}
                      </Heading>
                      <Text pt="2" fontSize="sm">
                        {notification.message}
                      </Text>
                    </Box>
                  );
                })}
              </Stack>
            </CardBody>
          </Card>
        </Flex>
      )}
    </Container>
  );
};

export default Transactions;

// transfer incoming -> incoming call
// transfer outgoing -> outcig

// buy request sender -> +
// buy request recevier -> email
// approval for seller -> money
// approval for buyer -> house

// rejected for seller -> cross
// rejected for buyer -> alert symbol !
