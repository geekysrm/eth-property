import "./App.css";
import React from "react";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Landing from "./pages/Landing";
import Register from "./pages/Register";
import UserProfile from "./pages/UserProfile";
import AddProperty from "./pages/AddProperty";
import PropertyProfile from "./pages/PropertyProfile";
import TestingPush from "./pages/TestingPush";

import Navbar from "./components/Navbar";

const theme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
});

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Navbar />
        <Switch>
          <Route exact path="/" component={Landing} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/push" component={TestingPush} />
          <Route exact path="/user/:userAddress" component={UserProfile} />
          <Route exact path="/add/property" component={AddProperty} />
          <Route exact path="/property/:id" component={PropertyProfile} />
        </Switch>
      </Router>
    </ChakraProvider>
  );
}

export default App;
