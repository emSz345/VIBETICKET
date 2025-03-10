import React from 'react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import './App.css';

function App() {

  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    axios.get('http://localhost:27017/api/mensagem')
      .then((res) => setMensagem(res.data.mensagem))
      .catch((err) => console.error('Erro:', err));
  }, []);


  return (
    <div>
     <p>B4Y PROJETO</p>
    </div>
  );
}

export default App;
