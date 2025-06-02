import React, { useEffect, useState } from 'react';

const LoadingSkeleton = () => {
  const [dotIndex, setDotIndex] = useState(0);
  const dots = ['', '.', '..', '...'];

  useEffect(() => {
    const interval = setInterval(() => {
      setDotIndex((prev) => (prev + 1) % dots.length);
    }, 500); // 0.5초마다 갱신

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-container">
      <div className="skeleton-box">
        <span className="loading-text">판별중{dots[dotIndex]}</span>
      </div>
    </div>
  );
};

export default LoadingSkeleton;