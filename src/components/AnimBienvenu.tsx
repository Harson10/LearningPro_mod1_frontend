import React, { useEffect, useRef } from 'react';
import Typed from 'typed.js';

const AnimBienvenu: React.FC = () => {
  const typedTextRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (typedTextRef.current) {
      const options = {
        strings: ['Learning Pro', 'votre plateforme de formation', 'le module 1'], 
        typeSpeed: 50,
        stop: 200,
        backSpeed: 50,
        loop: true
      };

      const typed = new Typed(typedTextRef.current, options);

      return () => {
        typed.destroy();
      };
    }
  }, []);

  return (
      <span ref={typedTextRef}></span>
  );
};

export default AnimBienvenu;
