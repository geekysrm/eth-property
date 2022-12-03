import * as PushAPI from "@pushprotocol/restapi";
import * as ethers from "ethers";

const PK = "2727fcca9acae56f153e1d21e14aac18b22b09b224740e5b066df04049457b4b"; // channel private key
const Pkey = `0x${PK}`;
const signer = new ethers.Wallet(Pkey);
const channelAddress = "eip155:5:0xa715E144881F613d13dC8bff16C1fdfcF0e86aAD";
// const receiverAddress = "eip155:5:0xAaEa5f9a8C02ba5A6b192267cCf48e42547E951f";

const pushNotification = async (receiverAddress, subject, body) => {
  try {
    const apiResponse = await PushAPI.payloads.sendNotification({
      signer,
      type: 3, // target
      identityType: 2, // direct payload
      notification: {
        title: `[SDK-TEST] notification TITLE:`,
        body: `[sdk-test] notification BODY`,
      },
      payload: {
        title: subject,
        body: body,
        cta: "",
        img: "",
      },
      recipients: receiverAddress, // recipient address
      channel: channelAddress, // your channel address
      env: "staging",
    });
    console.log(apiResponse);
  } catch (err) {
    console.error("Error: ", err);
  }
};

export default pushNotification;
