import { useState, useRef } from 'react';
import '../styles/CriarEventos.css';
import { NumericFormat } from 'react-number-format';
import Rodape from '../components/Footer/Footer';
import NavBar from '../components/Home/NavBar/NavBar';
import { MdAddPhotoAlternate } from 'react-icons/md';

import { ImExit } from "react-icons/im";
import { IoSend } from "react-icons/io5";

function CriarEventos() {
  const [image, setImage] = useState<File | null>(null);
  const [descricao, setDescricao] = useState('');
  const editorRef = useRef<HTMLDivElement>(null);
  const [dataInicio, setDataInicio] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [querDoar, setQuerDoar] = useState<boolean | null>(null);
  const [valorDoacao, setValorDoacao] = useState('');
  const [erros, setErros] = useState<string[]>([]);

  const handleInput = () => {
    if (editorRef.current) {
      setDescricao(editorRef.current.innerHTML);
    }
  };

  const validarFormulario = () => {
    const erros: string[] = [];

    const nomeEvento = (document.getElementById('nome-evento') as HTMLInputElement)?.value;
    const categoriaEvento = (document.getElementById('categoria-evento') as HTMLSelectElement)?.value;
    const rua = (document.getElementById('rua-evento') as HTMLInputElement)?.value;
    const cidade = (document.getElementById('cidade-evento') as HTMLInputElement)?.value;
    const estado = (document.getElementById('estado-evento') as HTMLInputElement)?.value;
    const linkMaps = (document.getElementById('link-maps') as HTMLInputElement)?.value;

    if (!nomeEvento) erros.push('O nome do evento é obrigatório.');
    if (!image) erros.push('A imagem do evento é obrigatória.');
    if (!categoriaEvento) erros.push('A categoria do evento é obrigatória.');
    if (!descricao.trim()) erros.push('A descrição do evento é obrigatória.');
    if (!rua) erros.push('A rua do evento é obrigatória.');
    if (!cidade) erros.push('A cidade do evento é obrigatória.');
    if (!estado) erros.push('O estado do evento é obrigatório.');
    if (!dataInicio) erros.push('A data de início é obrigatória.');
    if (!horaInicio) erros.push('A hora de início é obrigatória.');
    if (!linkMaps || !/^https?:\/\/(www\.)?google\.[a-z.]+\/maps/.test(linkMaps)) {
      erros.push('O link do Google Maps é inválido ou não foi fornecido.');
    }

    if (querDoar && (!valorDoacao || parseFloat(valorDoacao.replace(',', '.')) <= 0)) {
      erros.push('Se deseja doar, informe um valor válido.');
    }

    return erros;
  };

  const handleEnviarAnalise = async () => {

   

    const nomeEvento = (document.getElementById('nome-evento') as HTMLInputElement)?.value;
    const categoriaEvento = (document.getElementById('categoria-evento') as HTMLSelectElement)?.value;
    const rua = (document.getElementById('rua-evento') as HTMLInputElement)?.value;
    const cidade = (document.getElementById('cidade-evento') as HTMLInputElement)?.value;
    const estado = (document.getElementById('estado-evento') as HTMLInputElement)?.value;
    const linkMaps = (document.getElementById('link-maps') as HTMLInputElement)?.value;
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('firebaseToken'); // ou onde você estiver armazenando o JWT


    const formData = new FormData();
    formData.append("nome", nomeEvento);
    if (image) {
      formData.append('imagem', image); // arquivo real
    } // arquivo real
    formData.append("categoria", categoriaEvento);
    formData.append("descricao", descricao);
    formData.append("rua", rua);
    formData.append("cidade", cidade);
    formData.append("estado", estado);
    formData.append("linkMaps", linkMaps);
    formData.append("dataInicio", dataInicio);
    formData.append("horaInicio", horaInicio);
    formData.append("querDoar", String(querDoar));
    formData.append("valorDoacao", valorDoacao);
    formData.append("criadoPor", "teste");

    try {


      const response = await fetch('http://localhost:5000/api/eventos/criar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });



      if (!response.ok) {
        const text = await response.text(); // lê como texto para evitar erro de parsing
        throw new Error(`Erro do servidor: ${response.status} - ${text}`);
      }

      const data = await response.json(); // só tenta parsear se ok

      alert('Evento enviado para análise com sucesso!');
      

    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div>
      <NavBar />
      <header className="criar-evento-header">
        <h1 className="criar-titulo">
          Crie <span className="criar-dubtitle">seu evento</span>
        </h1>
        <div className="criar-header-botoes">
          <button className="btn-salvar-sair">
          <ImExit size={13}/>
            Sair
            </button>
          <button className="criar-btn-enviar" onClick={handleEnviarAnalise}>
            Enviar para Análise
            <IoSend/> 
          </button>
        </div>
      </header>

      <div className="criar-form">
        {/* 1. Informações Básicas */}
        <div className="informacoes-basicas-container">
          <div className="criar-Informaçao">
            <h2>1. Informações básicas</h2>
          </div>

          <div className="campo">
            <label htmlFor="nome-evento">
              Nome do evento <span className={erros.includes('O nome do evento é obrigatório.') ? 'erro-asterisco' : ''}>*</span>
            </label>
            <input
              type="text"
              id="nome-evento"
              placeholder="Digite o nome do evento"
              className={erros.includes('O nome do evento é obrigatório.') ? 'erro-campo' : ''}
            />
          </div>

          <div className="campo">
            <label htmlFor="imagem-evento">
              Imagem do evento <span className={erros.includes('A imagem do evento é obrigatória.') ? 'erro-asterisco' : ''}>*</span>
            </label>
            <div className="upload-imagem">
              {image ? (
                <p>{image.name}</p>
              ) : (
                <>
                  <MdAddPhotoAlternate size={55} color="#333" />
                  <p>Arraste ou clique para adicionar a imagem</p>
                  <input
                    type="file"
                    id="imagem-evento"
                    className="input-file"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setImage(e.target.files[0]);
                      }
                    }}
                  />
                </>
              )}
            </div>
          </div>

          <div className="campo">
            <label htmlFor="categoria-evento">
              Categoria do evento <span className={erros.includes('A categoria do evento é obrigatória.') ? 'erro-asterisco' : ''}>*</span>
            </label>
            <select
              id="categoria-evento"
              className={erros.includes('A categoria do evento é obrigatória.') ? 'erro-campo' : ''}
            >
              <option value="">Selecione uma categoria</option>
              <option value="show">Funk</option>
              <option value="festa">Sertanejo</option>
              <option value="palestra">Palestra</option>
              <option value="esporte">Esporte</option>
            </select>
          </div>
        </div>

        {/* 2. Descrição */}
        <div className="informacoes-basicas-container">
          <div className="criar-Informaçao">
            <h2>2. Descrição</h2>
          </div>
          <div className="campo">
            <label htmlFor="descricao-evento">
              Descrição do evento <span className={erros.includes('A descrição do evento é obrigatória.') ? 'erro-asterisco' : ''}>*</span>
            </label>
            <textarea
              id="descricao-evento"
              placeholder="Digite aqui a descrição do evento..."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className={`criar-descricao ${erros.includes('A descrição do evento é obrigatória.') ? 'erro-campo' : ''}`}
            />
          </div>
        </div>

        {/* 3. Local */}
        <div className="informacoes-basicas-container">
          <div className="criar-Informaçao">
            <h2>3. Local do seu evento</h2>
          </div>

          <div className="campo">
            <label htmlFor="rua-evento">
              Rua <span className={erros.includes('A rua do evento é obrigatória.') ? 'erro-asterisco' : ''}>*</span>
            </label>
            <input
              type="text"
              id="rua-evento"
              placeholder="Digite o nome da rua"
              className={erros.includes('A rua do evento é obrigatória.') ? 'erro-campo' : ''}
            />
          </div>

          <div className="campo">
            <label htmlFor="cidade-evento">
              Cidade <span className={erros.includes('A cidade do evento é obrigatória.') ? 'erro-asterisco' : ''}>*</span>
            </label>
            <input
              type="text"
              id="cidade-evento"
              placeholder="Digite a cidade"
              className={erros.includes('A cidade do evento é obrigatória.') ? 'erro-campo' : ''}
            />
          </div>

          <div className="campo">
            <label htmlFor="estado-evento">
              Estado <span className={erros.includes('O estado do evento é obrigatório.') ? 'erro-asterisco' : ''}>*</span>
            </label>
            <input
              type="text"
              id="estado-evento"
              placeholder="Digite o estado"
              className={erros.includes('O estado do evento é obrigatório.') ? 'erro-campo' : ''}
            />
          </div>

          <div className="campo">
            <label htmlFor="link-maps">
              Link do Local no Google Maps <span className={erros.includes('O link do Google Maps é inválido ou não foi fornecido.') ? 'erro-asterisco' : ''}>*</span>
            </label>
            <input
              type="url"
              id="link-maps"
              placeholder="Cole o link do local no Google Maps"
              className={erros.includes('O link do Google Maps é inválido ou não foi fornecido.') ? 'erro-campo' : ''}
            />
          </div>
        </div>

        {/* 4. Data e Hora */}
        <div className="informacoes-basicas-container">
          <div className="criar-Informaçao">
            <h2>4. Data e Hora de Início</h2>
          </div>

          <div className="campo">
            <label htmlFor="data-inicio">
              Data de Início do Evento <span className={erros.includes('A data de início é obrigatória.') ? 'erro-asterisco' : ''}>*</span>
            </label>
            <input
              type="date"
              id="data-inicio"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className={erros.includes('A data de início é obrigatória.') ? 'erro-campo' : ''}
            />
          </div>

          <div className="campo">
            <label htmlFor="hora-inicio">
              Hora de Início do Evento <span className={erros.includes('A hora de início é obrigatória.') ? 'erro-asterisco' : ''}>*</span>
            </label>
            <input
              type="time"
              id="hora-inicio"
              value={horaInicio}
              onChange={(e) => setHoraInicio(e.target.value)}
              className={erros.includes('A hora de início é obrigatória.') ? 'erro-campo' : ''}
            />
          </div>
        </div>

        {/* 6. Doação */}
        <div className="informacoes-basicas-container">
          <h2 className="criar-doacao-title">6. Deseja fazer uma doação?</h2>
          <p className="criar-doacao-descricao">
            Você pode contribuir com uma doação para uma instituição beneficente. Todo o valor arrecadado será destinado a causas sociais selecionadas pelos organizadores.
          </p>

          <div className="botoes-doacao">
            <button
              onClick={() => setQuerDoar(true)}
              className={querDoar === true ? 'ativo' : ''}
            >
              Sim
            </button>
            <button
              onClick={() => setQuerDoar(false)}
              className={querDoar === false ? 'ativo' : ''}
            >
              Não
            </button>
          </div>

          {querDoar && (
            <div className="campo-doacao">
              <label htmlFor="valor-doacao">Valor da doação</label>
              <NumericFormat
                id="valor-doacao"
                value={valorDoacao}
                onValueChange={(values) => setValorDoacao(values.value)}
                thousandSeparator="."
                decimalSeparator=","
                prefix="R$ "
                decimalScale={2}
                fixedDecimalScale
                allowNegative={false}
                placeholder="R$ 0,00"
                className="input-doacao"
              />
            </div>
          )}
        </div>
      </div>

      <Rodape />
    </div>
  );
}

export default CriarEventos;