import React, { useState } from "react";
import "./style.css";
import { FiEye, FiEyeOff } from "react-icons/fi";

interface InputProps {
  type: string;
  placeholder: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({ type, placeholder, name, value, onChange }) => {
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
        name={name} // nome do campo no input
        value={value} // valor do campo
        onChange={onChange} // manipulador de mudanças
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
