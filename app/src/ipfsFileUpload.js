import axios from "axios";
import { ethers } from "ethers";
import lighthouse from '@lighthouse-web3/sdk';

const requestAccount = async () => {
    await window.ethereum.request({ method: "eth_requestAccounts" });
}

const sign_message = async () => {
    if (!typeof window.ethereum !== "undefined") {
        await requestAccount();

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress(); //users public key
        const messageRequested = (await axios.get(`https://api.lighthouse.storage/api/auth/get_message?publicKey=${address}`)).data; //Get message
        const signedMessage = await signer.signMessage(messageRequested); //Sign message
        return({
            signedMessage: signedMessage,
            address: address
        });
    }
};

const uploadFile = async (e) => {
    // Sign message for authentication
    const signingResponse = await sign_message();

    // Get a bearer token
    const accessToken = (await axios.post(`https://api.lighthouse.storage/api/auth/verify_signer`, {
      publicKey: signingResponse.address,
      signedMessage: signingResponse.signedMessage
    })).data.accessToken;

    // Push file to lighthouse node
    const output = await lighthouse.upload(e, accessToken);
    console.log('File Status:', output);

    /*
      output:
        {
          Name: "filename.txt",
          Size: 88000,
          Hash: "QmWNmn2gr4ZihNPqaC5oTeePsHvFtkWNpjY3cD6Fd5am1w"
        }
      Note: Hash in response is CID.
    */

    const fileUrl = `https://ipfs.io/ipfs/${output.data.Hash}`;

    console.log(fileUrl);

    return fileUrl;
}

export default uploadFile;
