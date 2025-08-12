// components/ui/LoadingSpinner/LoadingSpinner.tsx
import React from "react";
import styles from './LoadingSpinner.module.css'; // Note a importação correta

const LoadingSpinner: React.FC = () => {
  return (
    <div className={styles.loadingSpinnerContainer}>
      <div className={styles.loadingSpinner}></div>
    </div>
  );
};

export default LoadingSpinner;