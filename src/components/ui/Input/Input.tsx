import React, { useState } from "react";
import "./Input.css";
import { FiEye, FiEyeOff } from "react-icons/fi";

interface InputProps {
  type: string;
  placeholder: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isValid?: boolean;
  hasError?: boolean;
}

const Input: React.FC<InputProps> = ({
  type,
  placeholder,
  name,
  value,
  onChange,
  isValid = false,
  hasError = false,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  // Aplica classes dinâmicas
  let inputClass = "custom-input";
  if (isValid) inputClass += " input-valid";
  if (hasError) inputClass += " input-error";

  return (
    <div className="input-container">
      <input
        className={inputClass}
        type={type === "password" && !isPasswordVisible ? "password" : "text"}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
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
