import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import Hero from '../components/Hero';
import Features from '../components/Features';
import Tech from '../components/Tech';
import Problems from '../components/Problems';
import Footer from '../components/Footer';

import isUserRegistered from "../ethereum/isUserRegistered";

export default function Landing() {
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

          if(response) {
            history.push(`/user/${userAddress}`);
          }
        }
      }
    })();
  }, []);

  return (
    <div>
      <Hero />
      <Tech />
      <Problems />
      <Features />
      <Footer />
    </div>
  );
}
