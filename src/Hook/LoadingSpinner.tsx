// src/components/LoadingSpinner.tsx
import React from 'react';
import '../styles/AuthStyle/LoadingSpinner.css'; // Importe o CSS que acabamos de criar

const LoadingSpinner = () => {
  return (
    <div className="spinner-container">
      <div className="spinner"></div>
    </div>
  );
};

export default LoadingSpinner;