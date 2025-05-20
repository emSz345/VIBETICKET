import { useState, useRef } from 'react';
import '../../styles/CriarEventos.css';
import { NumericFormat } from 'react-number-format';
import Rodape from '../../components/layout/Footer/Footer';
import NavBar from '../../components/sections/Home/NavBar/NavBar';
import { MdAddPhotoAlternate } from 'react-icons/md';
import { ImExit } from "react-icons/im";
import { IoSend } from "react-icons/io5";

function CriarEventos() {
  // Estados do componente
  const [image, setImage] = useState<File | null>(null);
  const [descricao, setDescricao] = useState('');
  const editorRef = useRef<HTMLDivElement>(null);
  const [dataInicio, setDataInicio] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [querDoar, setQuerDoar] = useState<boolean | null>(null);
  const [valorDoacao, setValorDoacao] = useState('');
  const [erros, setErros] = useState<string[]>([]);
  const [valorIngressoInteira, setValorIngressoInteira] = useState('');
  const [valorIngressoMeia, setValorIngressoMeia] = useState('');
  const [quantidadeInteira, setQuantidadeInteira] = useState('');
  const [quantidadeMeia, setQuantidadeMeia] = useState('');
  const [temMeia, setTemMeia] = useState('false');
  const [dataFim, setDataFim] = useState('');

  // Manipuladores de eventos
  const handleInput = () => {
    if (editorRef.current) {
      setDescricao(editorRef.current.innerHTML);
    }
  };

  const validarFormulario = () => {
    alert("clicou");
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
    const errosValidacao = validarFormulario();
    if (errosValidacao.length > 0) {
      setErros(errosValidacao);
      return;
    }

    const nomeEvento = (document.getElementById('nome-evento') as HTMLInputElement)?.value;
    const categoriaEvento = (document.getElementById('categoria-evento') as HTMLSelectElement)?.value;
    const rua = (document.getElementById('rua-evento') as HTMLInputElement)?.value;
    const cidade = (document.getElementById('cidade-evento') as HTMLInputElement)?.value;
    const estado = (document.getElementById('estado-evento') as HTMLInputElement)?.value;
    const linkMaps = (document.getElementById('link-maps') as HTMLInputElement)?.value;
    const dataInicio = (document.getElementById('data-inicio') as HTMLInputElement)?.value;
    const dataFim = (document.getElementById('data-fim') as HTMLInputElement)?.value;
    const horaInicio = (document.getElementById('hora-inicio') as HTMLInputElement)?.value;
    const horaFim = (document.getElementById('hora-fim') as HTMLInputElement)?.value;
    const valorIngresso = (document.getElementById('valor-ingresso') as HTMLInputElement)?.value;
    const tipoIngresso = (document.getElementById('tipo-ingresso') as HTMLSelectElement)?.value;
    const descricao = (document.getElementById('descricao-evento') as HTMLTextAreaElement)?.value;
    const token = localStorage.getItem('firebaseToken');

    const formData = new FormData();
    formData.append("nome", nomeEvento);
    if (image) formData.append('imagem', image);
    formData.append("categoria", categoriaEvento);
    formData.append("descricao", descricao);
    formData.append("rua", rua);
    formData.append("cidade", cidade);
    formData.append("estado", estado);
    formData.append("linkMaps", linkMaps);
    formData.append("dataInicio", dataInicio);
    formData.append("horaInicio", horaInicio);
    formData.append("dataFim", dataFim);

    // Campos de ingresso
    formData.append("valorIngressoInteira", valorIngressoInteira);
    formData.append("valorIngressoMeia", valorIngressoMeia);
    formData.append("quantidadeInteira", quantidadeInteira);
    formData.append("quantidadeMeia", quantidadeMeia);
    formData.append("temMeia", temMeia); // true ou false

    // Doações
    formData.append("querDoar", String(querDoar)); // true ou false
    formData.append("valorDoacao", valorDoacao);

    // Criador do evento
    formData.append("criadoPor", "usuarioId"); // ou e-mail, nome etc.

    try {
      const response = await fetch('http://localhost:5000/api/eventos/criar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Erro do servidor: ${response.status} - ${text}`);
      }

      const data = await response.json();
      alert('Evento enviado para análise com sucesso!');
    } catch (error: any) {
      alert(error.message);
    }
  };

  // Renderização do componente
  return (
    <div>
      <NavBar />

      {/* Cabeçalho */}
      <header className="criar-evento-header">
        <h1 className="criar-titulo">
          Crie <span className="criar-dubtitle">seu evento</span>
        </h1>
        <div className="criar-header-botoes">
          <button className="btn-salvar-sair">
            <ImExit size={13} />
            Sair
          </button>
          <button className="criar-btn-enviar" onClick={handleEnviarAnalise}>
            Enviar para Análise
            <IoSend />
          </button>
        </div>
      </header>

      {/* Formulário */}
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

        {/* 5. Ingressos */}
        <div className="informacoes-basicas-container">
          <div className="criar-Informaçao">
            <h2>5. Ingressos</h2>
          </div>

          <div className="container-ingressos">
            {/* Lado Esquerdo */}
            <div className="lado-esquerdo">
              <div className="campo">
                <label>
                  Valor do Ingresso Inteira (R$) <span className={erros.some(e => e.includes('inteira')) ? 'erro-asterisco' : ''}>*</span>
                </label>
                <NumericFormat
                  thousandSeparator="."
                  decimalSeparator=","
                  prefix="R$ "
                  value={valorIngressoInteira}
                  onValueChange={(values) => setValorIngressoInteira(values.value)}
                  className={erros.some(e => e.includes('inteira')) ? 'erro-campo' : ''}
                />
              </div>

              <div className="campo">
                <label>
                  Haverá ingresso meia?
                  <select
                    value={temMeia}
                    onChange={(e) => {
                      setTemMeia(e.target.value);
                      if (e.target.value === 'nao') {
                        setValorIngressoMeia('');
                        setQuantidadeMeia('');
                      }
                    }}
                    className="select"
                  >
                    <option value="nao">Não</option>
                    <option value="sim">Sim</option>
                  </select>
                </label>
              </div>

              {temMeia === 'sim' && (
                <div className="campo">
                  <label>
                    Valor do Ingresso Meia (R$) <span className={erros.some(e => e.includes('meia')) ? 'erro-asterisco' : ''}>*</span>
                  </label>
                  <NumericFormat
                    thousandSeparator="."
                    decimalSeparator=","
                    prefix="R$ "
                    value={valorIngressoMeia}
                    onValueChange={(values) => setValorIngressoMeia(values.value)}
                    className={erros.some(e => e.includes('meia')) ? 'erro-campo' : ''}
                  />
                </div>
              )}
            </div>

            {/* Lado Direito */}
            <div className="lado-direito">
              <div className="campo">
                <label>
                  Quantidade Inteira <span className={erros.some(e => e.includes('quantidadeInteira')) ? 'erro-asterisco' : ''}>*</span>
                </label>
                <input
                  type="number"
                  value={quantidadeInteira}
                  onChange={(e) => setQuantidadeInteira(e.target.value)}
                  min={1}
                  className={erros.some(e => e.includes('quantidadeInteira')) ? 'erro-campo' : ''}
                />
              </div>

              {temMeia === 'sim' && (
                <div className="campo">
                  <label>
                    Quantidade Meia <span className={erros.some(e => e.includes('quantidadeMeia')) ? 'erro-asterisco' : ''}>*</span>
                  </label>
                  <input
                    type="number"
                    value={quantidadeMeia}
                    onChange={(e) => setQuantidadeMeia(e.target.value)}
                    min={1}
                    className={erros.some(e => e.includes('quantidadeMeia')) ? 'erro-campo' : ''}
                  />
                </div>
              )}

              <div className="campo">
                <label>Data de Início das Vendas *</label>
                <input
                  type="date"
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                  className={erros.some(e => e.includes('dataInicio')) ? 'erro-campo' : ''}
                />
              </div>

              <div className="campo">
                <label>Data de Fim das Vendas *</label>
                <input
                  type="date"
                  value={dataFim}
                  onChange={(e) => setDataFim(e.target.value)}
                  className={erros.some(e => e.includes('dataFim')) ? 'erro-campo' : ''}
                />
              </div>
            </div>
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