import EthProperty from "../artifacts/contracts/EthProperty.sol/EthProperty.json";
import { ethers } from "ethers";
import { constants } from "../constants";

const isUserRegistered = async (userAddress) => {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(
          constants.ethPropertyAddress,
          EthProperty.abi,
          provider
        );
        try {
          const data = await contract.isUserRegistered(userAddress);
          console.log("data: ", data);
          return data;
        } catch (err) {
          console.log("Error: ", err);
        }
      }
}

export default isUserRegistered;
