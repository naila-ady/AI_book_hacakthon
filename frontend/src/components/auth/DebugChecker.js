import React, { useEffect } from 'react';

const DebugChecker = () => {
  useEffect(() => {
    // Check for navbar and footer elements in the DOM
    const navbarElements = document.querySelectorAll('.navbar');
    const footerElements = document.querySelectorAll('.footer');

    console.log('=== DEBUG CHECKER RESULTS ===');
    console.log('Number of navbar elements found:', navbarElements.length);
    console.log('Number of footer elements found:', footerElements.length);
    console.log('All navbar elements:', Array.from(navbarElements));
    console.log('All footer elements:', Array.from(footerElements));

    if (navbarElements.length > 0) {
      console.log('WARNING: Navbar elements are still present in the DOM!');
      navbarElements.forEach((el, index) => {
        console.log(`Navbar element ${index}:`, el, 'Classes:', el.className);
      });
    }

    if (footerElements.length > 0) {
      console.log('WARNING: Footer elements are still present in the DOM!');
      footerElements.forEach((el, index) => {
        console.log(`Footer element ${index}:`, el, 'Classes:', el.className);
      });
    }

    console.log('=============================');
  }, []);

  return null; // This component doesn't render anything visible
};

export default DebugChecker;