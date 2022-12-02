import { useState } from "react";
import "./App.css";
import EthProperty from "./artifacts/contracts/EthProperty.sol/EthProperty.json";
import { ethers } from "ethers";
import { ethPropertyAddress } from "./constants";

function App() {
  const [greeting, setGreetingValue] = useState("");

  async function fetchGreeting() {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        ethPropertyAddress,
        EthProperty.abi,
        provider
      );
      try {
        const data = await contract.greet();
        setGreetingValue(data);
        console.log("data: ", data);
      } catch (err) {
        console.log("Error: ", err);
      }
    }
  }

  async function setGreeting(value) {
    if (!value) return;
    if (!typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        ethPropertyAddress,
        EthProperty.abi,
        signer
      );
      const transaction = await contract.setGreeting(value);
      await transaction.wait();
      fetchGreeting();
    }
  }

  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    await setGreeting(event.target.greetingInput.value);
    setGreetingValue(event.target.greetingInput.value);
    event.target.greetingInput.value = "";
  }

  return <div className="w-full max-w-lg container">Hello</div>;
}

export default App;
