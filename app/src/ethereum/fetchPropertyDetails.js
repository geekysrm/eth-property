import EthProperty from "../artifacts/contracts/EthProperty.sol/EthProperty.json";
import { ethers } from "ethers";
import { constants } from "../constants";

const requestAccount = async () => {
  await window.ethereum.request({ method: "eth_requestAccounts" });
}

const fetchPropertyDetails = async (id) => {
  if (typeof window.ethereum !== "undefined") {
    await requestAccount();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      constants.ethPropertyAddress,
      EthProperty.abi,
      signer
    );
    try {
      const data = await contract.fetchProperty(id);
      console.log("data: ", data);
      return data;
    } catch (err) {
      console.log("Error: ", err);
    }
  }
}

export default fetchPropertyDetails;
