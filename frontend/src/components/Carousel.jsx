import React, { useState, useEffect } from "react";
import clinic1 from "../assets/clinic1.jpg";
import clinic2 from "../assets/clinic2.jpg";
import clinic3 from "../assets/clinic3.jpg";
import clinic4 from "../assets/clinic4.jpg";

const Carousel = () => {
  const images = [clinic1, clinic2, clinic3, clinic4];
  const [current, setCurrent] = useState(0);

  // الانتقال التلقائي كل 3 ثواني
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  const nextSlide = () => {
    setCurrent((current + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrent((current - 1 + images.length) % images.length);
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto rounded-xl overflow-hidden ">
      {images.map((img, index) => (
        <img
          key={index}
          src={img}
          alt={`slide-${index}`}
          className={`w-full h-[400px] md:h-[500px] lg:h-[600px] object-cover rounded-xl transition-opacity duration-700 ease-in-out ${
            index === current
              ? "opacity-100 z-10"
              : "opacity-0 z-0 absolute inset-0"
          }`}
        />
      ))}
    </div>
  );
};

export default Carousel;
