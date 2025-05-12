import React, { useState } from 'react';
import './FAQ.css'; // Importa o CSS

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: 'Posso comprar meia-entrada?',
    answer: 'Sim, a meia-entrada está disponível para estudantes, idosos e outros públicos conforme a lei.',
  },
  {
    question: 'Como funciona a análise de uma compra paga com cartão de crédito?',
    answer: 'A análise ocorre automaticamente e pode levar até 48 horas para confirmação.',
  },
  {
    question: 'Por que minha compra não foi aprovada?',
    answer: 'Pode ter ocorrido por falta de limite, erro nos dados ou falha na operadora.',
  },
  {
    question: 'Como posso acessar um evento online?',
    answer: 'Você receberá um link no seu e-mail ou poderá acessá-lo pelo site da plataforma.',
  },
  {
    question: 'Como faço para cancelar meu ingresso?',
    answer: 'Você pode cancelar pelo site, dentro do prazo permitido e conforme os termos.',
  },
  {
    question: 'Por que não consegui solicitar meu reembolso?',
    answer: 'Verifique se ainda está dentro do prazo ou se o evento permite reembolso.',
  },
];

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(prev => (prev === index ? null : index));
  };

  return (
    <div className="faq-container">
      <div className="faq-grid">
        {faqs.map((faq, index) => (
          <div
          key={index}
          className={`faq-item ${openIndex === index ? 'active' : ''}`}
        >
          <div className="faq-question" onClick={() => toggle(index)}>
            <span>{faq.question}</span>
            <span className="faq-icon">{openIndex === index ? '-' : '+'}</span>
          </div>
          <div className="faq-answer">{faq.answer}</div>
        </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
