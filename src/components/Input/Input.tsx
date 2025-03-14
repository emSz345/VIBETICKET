import React, { useState } from "react";
import "./style.css";
import { FiEye, FiEyeOff } from "react-icons/fi"; 
interface InputProps {
  type: string;
  placeholder: string;
}

const Input: React.FC<InputProps> = ({ type, placeholder }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div className="input-container">
      <input
        className="custom-input"
        type={type === "password" && !isPasswordVisible ? "password" : "text"}
        placeholder={placeholder}
      />
      {type === "password" && (
        <button
          type="button"
          className="eye-button"
          onClick={togglePasswordVisibility}
        >
          {isPasswordVisible ? <FiEyeOff /> : <FiEye />}
        </button>
      )}
    </div>
  );
};

export default Input;