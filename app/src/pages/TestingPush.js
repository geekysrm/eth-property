import * as PushAPI from "@pushprotocol/restapi";
import * as ethers from "ethers";
import { useEffect } from "react";

const PK = "2727fcca9acae56f153e1d21e14aac18b22b09b224740e5b066df04049457b4b"; // channel private key
const Pkey = `0x${PK}`;
const signer = new ethers.Wallet(Pkey);
const channelAddress = "eip155:5:0xa715E144881F613d13dC8bff16C1fdfcF0e86aAD";
const receiverAddress = "eip155:5:0x934112cfac8c01b8E49DBB72D4d501B98992aEB2";

// sendNotification();

export default function TestingPush() {
  const sendNotification = async () => {
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
          title: `[sdk-test] payload title`,
          body: `sample msg body`,
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

  return (
    <div>
      <button onClick={sendNotification}>
        Send notification to single user
      </button>
    </div>
  );
}
