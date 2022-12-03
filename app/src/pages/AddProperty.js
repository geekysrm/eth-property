import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import AddPropertyForm from '../components/AddPropertyForm';

import isUserRegistered from "../ethereum/isUserRegistered";

export default function AddProperty() {
  const history = useHistory();

  useEffect(() => {
    (async () => {
      if (typeof window.ethereum !== "undefined") { 
        const { ethereum } = window;
        const accounts = await ethereum.request({method: 'eth_requestAccounts'});

        console.log(accounts);

        if(accounts !== 0){
          const userAddress = accounts[0];
          console.log(userAddress);

          const response = await isUserRegistered(userAddress);
          console.log(response);

          if(!response) {
            history.push(`/`);
          }
        }
      }
    })();
  }, []);

  return (
    <div>
      <AddPropertyForm />
    </div>
  );
}
