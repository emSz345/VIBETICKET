import { useState, useRef } from 'react';
import '../styles/CriarEventos.css';
import { NumericFormat } from 'react-number-format';
import Rodape from '../components/Footer/Footer';
import NavBar from '../components/Home/NavBar/NavBar';
import { MdAddPhotoAlternate } from 'react-icons/md';

function CriarEventos() {
  const [image, setImage] = useState<File | null>(null);
  const [descricao, setDescricao] = useState('');
  const editorRef = useRef<HTMLDivElement>(null);
  const [dataInicio, setDataInicio] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [querDoar, setQuerDoar] = useState<boolean | null>(null);
  const [valorDoacao, setValorDoacao] = useState('');

  const handleInput = () => {
    if (editorRef.current) {
      setDescricao(editorRef.current.innerHTML);
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
          <button className="btn-salvar-sair">Salvar / Sair</button>
          <button className="criar-btn-enviar">Enviar para Análise</button>
        </div>
      </header>

      <div className="criar-form">
        {/* 1. Informações Básicas */}
        <div className="informacoes-basicas-container">
          <div className="criar-Informaçao">
            <h2>1. Informações básicas</h2>
          </div>

          <div className="campo">
            <label htmlFor="nome-evento">Nome do evento</label>
            <input type="text" id="nome-evento" placeholder="Digite o nome do evento" />
          </div>

          <div className="campo">
            <label htmlFor="imagem-evento">Imagem do evento</label>
            <div className="upload-imagem">
              {image ? (
                <p>{image.name}</p>
              ) : (
                <>
                  <MdAddPhotoAlternate size={55} color="#333" />
                  <p>Arraste ou clique para adicionar a imagem</p>
                  <input type="file" id="imagem-evento" className="input-file" />
                </>
              )}
            </div>
          </div>

          <div className="campo">
            <label htmlFor="categoria-evento">Categoria do evento</label>
            <select id="categoria-evento">
              <option value="">Selecione uma categoria</option>
              <option value="show">Funk</option>
              <option value="festa">sertanejo</option>
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
            <label htmlFor="descricao-evento">Descrição do evento</label>
            <textarea
              id="descricao-evento"
              placeholder="Digite aqui a descrição do evento..."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="criar-descricao"
            />
          </div>
        </div>

        {/* 3. Local */}
        <div className="informacoes-basicas-container">
          <div className="criar-Informaçao">
            <h2>3. Local do seu evento</h2>
          </div>

          <div className="campo">
            <label htmlFor="rua-evento">Rua</label>
            <input type="text" id="rua-evento" placeholder="Digite o nome da rua" />
          </div>

          <div className="campo">
            <label htmlFor="cidade-evento">Cidade</label>
            <input type="text" id="cidade-evento" placeholder="Digite a cidade" />
          </div>

          <div className="campo">
            <label htmlFor="estado-evento">Estado</label>
            <input type="text" id="estado-evento" placeholder="Digite o estado" />
          </div>

          <div className="campo">
            <label htmlFor="link-maps">Link do Local no Google Maps</label>
            <input type="url" id="link-maps" placeholder="Cole o link do local no Google Maps" />
          </div>
        </div>

        {/* 4. Data e Hora */}
        <div className="informacoes-basicas-container">
          <div className="criar-Informaçao">
            <h2>4. Data e Hora de Início</h2>
          </div>

          <div className="campo">
            <label htmlFor="data-inicio">Data de Início do Evento</label>
            <input
              type="date"
              id="data-inicio"
              value={dataInicio}
              className="input-data"
            />
          </div>

          <div className="campo">
            <label htmlFor="hora-inicio">Hora de Início do Evento</label>
            <input
              type="time"
              id="hora-inicio"
              value={horaInicio}
              className="input-hora"
            />
          </div>
        </div>

        {/* 5. Ingressos */}
        <div className="informacoes-basicas-container">
          <div className="criar-Informaçao">
            <h2>5. Ingressos</h2>
          </div>

          <div className="ingresso-grid">
            <div className="ingresso-col">
              <h3 className="subtitulo">Tipos de ingresso:</h3>
              <div className="campo">
                <label htmlFor="preco-inteira">Inteira (R$)</label>
                <NumericFormat
                  thousandSeparator="."
                  decimalSeparator=","
                  prefix="R$ "
                  decimalScale={2}
                  fixedDecimalScale
                  allowNegative={false}
                  placeholder="Valor"
                  className="input-ingresso"
                />
              </div>

              <div className="campo">
                <label htmlFor="preco-meia">Meia (R$)</label>
                <NumericFormat
                  thousandSeparator="."
                  decimalSeparator=","
                  prefix="R$ "
                  decimalScale={2}
                  fixedDecimalScale
                  allowNegative={false}
                  placeholder="Valor"
                  className="input-ingresso"
                />
              </div>
            </div>

            <div className="ingresso-col">
              <h3 className="subtitulo">Detalhes:</h3>
              <div className="campo">
                <label htmlFor="quantidade-ingresso">Quantidade de ingressos</label>
                <input type="number" id="quantidade-ingresso" placeholder="Digite a quantidade" />
              </div>

              <div className="campo">
                <label htmlFor="inicio-venda">Início data/hora da venda</label>
                <input type="datetime-local" id="inicio-venda" />
              </div>

              <div className="campo">
                <label htmlFor="fim-venda">Fim data/hora da venda</label>
                <input type="datetime-local" id="fim-venda" />
              </div>
            </div>
          </div>
        </div>

        {/* 6. Doação */}
        <div className="informacoes-basicas-container">
          <h2 className="criar-doacao-title">6. Deseja fazer uma doação?</h2>
          <p className="criar-doacao-descricao">
            Você pode contribuir com uma doação para uma instituição beneficente. Todo o valor arrecadado será destinado a causas sociais selecionadas pelos organizadores. E mais: ao doar, seu nome (ou empresa) ganhará um lugar de destaque no topo do nosso site, reconhecendo seu apoio e solidariedade.
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