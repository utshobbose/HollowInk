import React from 'react';
import Hero from '../components/Hero';
import FeaturedStory from '../components/FeaturedStory';
import StoriesGrid from '../components/StoriesGrid';
import Newsletter from '../components/Newsletter';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="animate-pageIn">
      <Hero />
      <FeaturedStory />
      <StoriesGrid />
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Home;
