import React from "react";
import {
  chakra,
  Flex,
  Icon,
  Link,
  useColorModeValue,
  Box,
  Image,
  Text,
} from "@chakra-ui/react";
import { useViewportScroll } from "framer-motion";
import { Link as RouterLink } from "react-router-dom";
import GitHubIcon from "./icons/GitHubIcon";

const Navbar = () => {
  const bg = useColorModeValue("white", "gray.800");
  const ref = React.useRef();
  const [y, setY] = React.useState(0);
  const { height = 0 } = ref.current ? ref.current.getBoundingClientRect() : {};

  const { scrollY } = useViewportScroll();
  React.useEffect(() => {
    return scrollY.onChange(() => setY(scrollY.get()));
  }, [scrollY]);

  return (
    <Box pos="relative">
      <chakra.header
        ref={ref}
        shadow={y > height ? "sm" : undefined}
        transition="box-shadow 0.2s"
        bg={bg}
        w="full"
        overflowY="hidden"
        mt="20px"
        px="28"
      >
        <Flex h="4.5rem" mx="auto" alignItems="center">
          <Flex
            w="full"
            h="full"
            px="6"
            alignItems="center"
            justifyContent="space-between"
          >
            <Flex align="center" mt="7px">
              <Link as={RouterLink} to="/" _focus={false}>
                <Image w="50%" src="/images/ethproperty-logo.png" />
              </Link>
            </Flex>
            <Link
              isExternal
              aria-label="Go to Source"
              href="https://github.com/geekysrm/ethproperty"
            >
              <Flex
                alignItems="center"
                borderRadius={"4px"}
                gap={2}
                border="1px"
                padding="8px 11px"
              >
                <Text style={{ fontWeight: "bold" }}>Go to Source</Text>

                <Icon
                  as={GitHubIcon}
                  display="block"
                  transition="color 0.2s"
                  w="5"
                  h="5"
                  _hover={{ color: "gray.600" }}
                />
              </Flex>
            </Link>
          </Flex>
        </Flex>
      </chakra.header>
    </Box>
  );
};

export default Navbar;
