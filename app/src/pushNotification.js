import * as PushAPI from "@pushprotocol/restapi";
import * as ethers from "ethers";

const PK = "2727fcca9acae56f153e1d21e14aac18b22b09b224740e5b066df04049457b4b"; // channel private key
const Pkey = `0x${PK}`;
const signer = new ethers.Wallet(Pkey);
const channelAddress = "eip155:5:0xa715E144881F613d13dC8bff16C1fdfcF0e86aAD";

const pushNotification = async (receiverAddress, subject, body) => {
  console.log("executing pushNotification");
  try {
    const apiResponse = await PushAPI.payloads.sendNotification({
      signer,
      type: 3, // target
      identityType: 2, // direct payload
      notification: {
        title: subject,
        body: body,
      },
      payload: {
        title: subject,
        body: body,
        cta: "",
        img: "",
      },
      recipients: `eip155:5:${receiverAddress}`, // recipient address
      channel: channelAddress, // your channel address
      env: "staging",
    });
    console.log(apiResponse);
    return apiResponse;
  } catch (err) {
    console.error("Error:  ", err);
  }
};

export default pushNotification;
