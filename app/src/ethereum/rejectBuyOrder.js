import EthProperty from "../artifacts/contracts/EthProperty.sol/EthProperty.json";
import { ethers } from "ethers";
import { constants } from "../constants";

const requestAccount = async () => {
    await window.ethereum.request({ method: "eth_requestAccounts" });
}

const rejectBuyOrder = async (id) => {
    if (!typeof window.ethereum !== "undefined") {
        await requestAccount();
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          constants.ethPropertyAddress,
          EthProperty.abi,
          signer
        );
        const transaction = await contract.rejectBuyOrder(id);
        await transaction.wait();
    }
}

export default rejectBuyOrder;
