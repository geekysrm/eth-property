import React from 'react';

import Hero from '../components/Hero';
import Features from '../components/Features';
import Tech from '../components/Tech';
import Problems from '../components/Problems';
import Footer from '../components/Footer';

export default function Landing() {

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
