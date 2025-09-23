import React from "react";
import "./IndicadorSenha.css";

interface PasswordStrengthIndicatorProps {
  password: string;
}

const IndicadorSenha: React.FC<PasswordStrengthIndicatorProps> = ({ password }) => {
  const calculateStrength = (pwd: string) => {
    
    // Critérios de validação
    const hasMinLength = pwd.length >= 8;
    const hasNumber = /\d/.test(pwd);
    const hasLowercase = /[a-z]/.test(pwd);
    const hasUppercase = /[A-Z]/.test(pwd);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(pwd);
    
    // Pontuação baseada nos critérios atendidos
    const criteria = [hasMinLength, hasNumber, hasLowercase, hasUppercase, hasSpecialChar];
    const metCriteria = criteria.filter(Boolean).length;
    
    // Força baseada em porcentagem
    const strength = (metCriteria / 5) * 100;
    
    return {
      strength,
      hasMinLength,
      hasNumber,
      hasLowercase,
      hasUppercase,
      hasSpecialChar
    };
  };

  const { strength, hasMinLength, hasNumber, hasLowercase, hasUppercase, hasSpecialChar } = calculateStrength(password);

  const getStrengthLabel = () => {
    if (strength === 0) return "";
    if (strength < 40) return "Fraca";
    if (strength < 70) return "Média";
    if (strength < 90) return "Forte";
    return "Muito Forte";
  };

  const getStrengthColor = () => {
    if (strength === 0) return "#e0e0e0";
    if (strength < 40) return "#ff4444";
    if (strength < 70) return "#ffbb33";
    if (strength < 90) return "#00C851";
    return "#007E33";
  };

  if (!password) return null;

  return (
    <div className="login-password-strength">
      <div className="login-strength-bar-container">
        <div 
          className="login-strength-bar"
          style={{
            width: `${strength}%`,
            backgroundColor: getStrengthColor()
          }}
        ></div>
      </div>
      
      <div className="login-strength-info">
        <span className="login-strength-label">
          Força da senha: <strong style={{ color: getStrengthColor() }}>{getStrengthLabel()}</strong>
        </span>
      </div>
      
      <div className="login-password-requirements">
        <div className={`login-requirement ${hasMinLength ? 'login-requirement-met' : ''}`}>
          {hasMinLength ? '✓' : '•'} No mínimo 8 dígitos
        </div>
        <div className={`login-requirement ${hasNumber ? 'login-requirement-met' : ''}`}>
          {hasNumber ? '✓' : '•'} Pelo menos 1 número
        </div>
        <div className={`login-requirement ${hasLowercase ? 'login-requirement-met' : ''}`}>
          {hasLowercase ? '✓' : '•'} Pelo menos 1 letra minúscula
        </div>
        <div className={`login-requirement ${hasUppercase ? 'login-requirement-met' : ''}`}>
          {hasUppercase ? '✓' : '•'} Pelo menos 1 letra maiúscula
        </div>
        <div className={`login-requirement ${hasSpecialChar ? 'login-requirement-met' : ''}`}>
          {hasSpecialChar ? '✓' : '•'} Pelo menos 1 caractere especial
        </div>
      </div>
    </div>
  );
};

export default IndicadorSenha;