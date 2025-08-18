import { useState, useEffect } from 'react';
import '../../styles/CriarEventos.css';
import { NumericFormat } from 'react-number-format';
import { MdAddPhotoAlternate } from 'react-icons/md';
import { ImExit } from "react-icons/im";
import { IoSend } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { FaQuestionCircle } from 'react-icons/fa';
import logo from '../../assets/logo.png';
import { Link } from 'react-router-dom';
import AppHeader from '../../components/layout/Header/AppHeader'
import { GoAlertFill } from "react-icons/go";

function CriarEventos() {
  const navigate = useNavigate();

  const [etapaAtual, setEtapaAtual] = useState(1);

  // ESTADOS DO COMPONENTE
  // Etapa 1
  const [nomeEvento, setNomeEvento] = useState('');
  const [categoriaEvento, setCategoriaEvento] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  // Etapa 2
  const [descricao, setDescricao] = useState('');

  // Etapa 3 - ESTADOS ATUALIZADOS PARA O ENDEREÇO
  const [cep, setCep] = useState('');
  const [rua, setRua] = useState('');
  const [bairro, setBairro] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [linkMaps, setLinkMaps] = useState('');
  const [isFetchingCep, setIsFetchingCep] = useState(false);

  // Etapa 4
  const [dataInicio, setDataInicio] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaTermino, setHoraTermino] = useState('');

  // Etapa 5
  const [valorIngressoInteira, setValorIngressoInteira] = useState('');
  const [valorIngressoMeia, setValorIngressoMeia] = useState('');
  const [quantidadeInteira, setQuantidadeInteira] = useState('');
  const [quantidadeMeia, setQuantidadeMeia] = useState('');
  const [temMeia, setTemMeia] = useState('false');
  const [dataFimVendas, setDataFimVendas] = useState('');
  const [dataInicioVendas, setDataInicioVendas] = useState('');

  // Etapa 6
  const [querDoar, setQuerDoar] = useState<boolean | null>(null);
  const [valorDoacao, setValorDoacao] = useState('');
  const [termosAceitos, setTermosAceitos] = useState(false);

  // Outros estados
  const [modalAberto, setModalAberto] = useState(false);
  const [erros, setErros] = useState<{ [key: string]: string }>({});
  const [isCooldown, setIsCooldown] = useState(false);
  const [cooldownTimeLeft, setCooldownTimeLeft] = useState<number | null>(null);


  // FUNÇÕES HANDLERS
  const handleAbrirModal = () => {
    setModalAberto(true);
  };

  const handleFecharModal = () => {
    setModalAberto(false);
  };

  const handleConfirmarSaida = () => {
    navigate('/');
  };

  const handleProximaEtapa = () => {
    if (validarEtapa(etapaAtual)) {
      setEtapaAtual(prevEtapa => prevEtapa + 1);
      window.scrollTo(0, 0);
    }
  };

  const etapaAnterior = () => {
    setEtapaAtual(prevEtapa => prevEtapa - 1);
    window.scrollTo(0, 0);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImage(null);
      setImagePreviewUrl(null);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [etapaAtual]);

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  useEffect(() => {
    const savedCooldownEnd = localStorage.getItem('eventoCooldownEnd');
    if (savedCooldownEnd) {
      const interval = setInterval(() => {
        const now = Date.now();
        const end = parseInt(savedCooldownEnd);
        const remaining = Math.floor((end - now) / 1000);

        if (remaining <= 0) {
          setIsCooldown(false);
          setCooldownTimeLeft(null);
          localStorage.removeItem('eventoCooldownEnd');
          clearInterval(interval);
        } else {
          setIsCooldown(true);
          setCooldownTimeLeft(remaining);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, []);

  // FUNÇÃO PARA BUSCAR ENDEREÇO POR CEP
  const buscarEnderecoPorCep = async (cep: string) => {
    const cleanedCep = cep.replace(/\D/g, '');

    if (cleanedCep.length !== 8) {
      setErros(prevErros => ({ ...prevErros, cep: 'CEP inválido. Deve conter 8 dígitos.' }));
      setRua('');
      setBairro('');
      setCidade('');
      setEstado('');
      return;
    }

    setErros(prevErros => {
      const newErros = { ...prevErros };
      delete newErros.cep;
      return newErros;
    });

    setIsFetchingCep(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanedCep}/json/`);
      const data = await response.json();

      if (data.erro) {
        setErros(prevErros => ({ ...prevErros, cep: 'CEP não encontrado.' }));
        setRua('');
        setBairro('');
        setCidade('');
        setEstado('');
      } else {
        setRua(data.logradouro || '');
        setBairro(data.bairro || '');
        setCidade(data.localidade || '');
        setEstado(data.uf || '');
        setErros(prevErros => {
          const newErros = { ...prevErros };
          delete newErros.rua;
          delete newErros.bairro;
          delete newErros.cidade;
          delete newErros.estado;
          return newErros;
        });
      }
    } catch (error) {
      setErros(prevErros => ({ ...prevErros, cep: 'Erro ao buscar CEP. Tente novamente.' }));
      console.error("Erro ao buscar CEP:", error);
    } finally {
      setIsFetchingCep(false);
    }
  };

  // FUNÇÃO DE VALIDAÇÃO PRINCIPAL
  const validarEtapa = (etapa: number) => {
    const novosErros: { [key: string]: string } = {};
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    switch (etapa) {
      case 1:
        if (!nomeEvento) novosErros.nomeEvento = 'O nome do evento é obrigatório.';
        if (!image) novosErros.imagem = 'A imagem do evento é obrigatória.';
        if (!categoriaEvento) novosErros.categoriaEvento = 'A categoria do evento é obrigatória.';
        break;
      case 2:
        if (!descricao.trim()) novosErros.descricao = 'A descrição do evento é obrigatória.';
        break;
      case 3:
        if (!cep.replace(/\D/g, '')) novosErros.cep = 'O CEP é obrigatório.';
        if (cep.replace(/\D/g, '').length !== 8) novosErros.cep = 'O CEP deve conter 8 dígitos.';
        if (!rua) novosErros.rua = 'A rua é obrigatória e deve ser preenchida automaticamente pelo CEP.';
        if (!bairro) novosErros.bairro = 'O bairro é obrigatório e deve ser preenchido automaticamente pelo CEP.';
        if (!numero) novosErros.numero = 'O número é obrigatório.';
        if (!cidade) novosErros.cidade = 'A cidade é obrigatória e deve ser preenchida automaticamente pelo CEP.';
        if (!estado) novosErros.estado = 'O estado é obrigatório e deve ser preenchido automaticamente pelo CEP.';
        if (!linkMaps || (!/^https?:\/\/(www\.)?google\.[a-z.]+\/maps/.test(linkMaps) && !/^https:\/\/maps\.app\.goo\.gl\//.test(linkMaps))) {
          novosErros.linkMaps = 'O link do Google Maps é inválido ou não foi fornecido.';
        }
        break;
      case 4:
        if (!dataInicio) {
          novosErros.dataInicio = 'A data de início do evento é obrigatória.';
        } else {
          const dataEvento = new Date(dataInicio + 'T00:00:00');
          if (dataEvento < hoje) {
            novosErros.dataInicio = 'A data de início do evento não pode ser no passado.';
          }
        }
        if (!horaInicio) novosErros.horaInicio = 'A hora de início é obrigatória.';
        if (!horaTermino) novosErros.horaTermino = 'A hora de término é obrigatória.';
        break;
      case 5:
        if (!valorIngressoInteira || parseFloat(valorIngressoInteira.replace(',', '.')) <= 0) {
          novosErros.valorInteira = 'O valor do ingresso inteiro é obrigatório e deve ser maior que zero.';
        }
        if (!quantidadeInteira || parseInt(quantidadeInteira) <= 0) {
          novosErros.quantidadeInteira = 'A quantidade de ingressos inteiros é obrigatória e deve ser maior que zero.';
        }
        if (temMeia === 'sim') {
          if (!valorIngressoMeia || parseFloat(valorIngressoMeia.replace(',', '.')) <= 0) {
            novosErros.valorMeia = 'O valor do ingresso meia é obrigatório se houver meia-entrada.';
          }
          if (!quantidadeMeia || parseInt(quantidadeMeia) <= 0) {
            novosErros.quantidadeMeia = 'A quantidade de ingressos meia é obrigatória se houver meia-entrada.';
          }
        }
        if (!dataInicioVendas) {
          novosErros.dataInicioVendas = 'A data de início das vendas é obrigatória.';
        } else {
          const inicioVendas = new Date(dataInicioVendas + 'T00:00:00');
          if (inicioVendas < hoje) {
            novosErros.dataInicioVendas = 'A data de início das vendas não pode ser no passado.';
          }
          if (dataInicio) {
            const dataEventoObj = new Date(dataInicio + 'T00:00:00');
            if (inicioVendas > dataEventoObj) {
              novosErros.dataInicioVendas = 'A data de início das vendas não pode ser posterior à data de início do evento.';
            }
          }
        }
        if (!dataFimVendas) {
          novosErros.dataFimVendas = 'A data de fim das vendas é obrigatória.';
        } else {
          const fimVendas = new Date(dataFimVendas + 'T00:00:00');
          const inicioVendasObj = dataInicioVendas ? new Date(dataInicioVendas + 'T00:00:00') : null;
          const dataEventoObj = dataInicio ? new Date(dataInicio + 'T00:00:00') : null;

          if (inicioVendasObj && fimVendas < inicioVendasObj) {
            novosErros.dataFimVendas = 'A data de fim das vendas não pode ser anterior à data de início das vendas.';
          }
          if (dataEventoObj && fimVendas > dataEventoObj) {
            novosErros.dataFimVendas = 'A data de fim das vendas não pode ser posterior à data de início do evento.';
          }
        }
        break;
      case 6:
        if (querDoar && (!valorDoacao || parseFloat(valorDoacao.replace(',', '.')) <= 0)) {
          novosErros.valorDoacao = 'Se deseja doar, informe um valor válido.';
        }
        break;
      default:
        break;
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleEnviarAnalise = async () => {
    // Valida todas as etapas antes de enviar
    if (!validarEtapa(1) || !validarEtapa(2) || !validarEtapa(3) || !validarEtapa(4) || !validarEtapa(5) || !validarEtapa(6)) {
      alert('Por favor, corrija os erros em todos os campos antes de enviar para análise.');
      // Opcional: navegar para a primeira etapa com erro
      if (!validarEtapa(1)) { setEtapaAtual(1); return; }
      if (!validarEtapa(2)) { setEtapaAtual(2); return; }
      if (!validarEtapa(3)) { setEtapaAtual(3); return; }
      if (!validarEtapa(4)) { setEtapaAtual(4); return; }
      if (!validarEtapa(5)) { setEtapaAtual(5); return; }
      return;
    }

    // --- INÍCIO DA CORREÇÃO ---
    // 1. Obtenha a string com os dados do usuário do localStorage.
    //    Assumindo que você salva como 'user' após o login.
    const userDataString = localStorage.getItem('user');

    if (!userDataString) {
      alert('Usuário não autenticado. Por favor, faça login para criar um evento.');
      navigate('/login'); // Redireciona para o login
      return;
    }

    // 2. Converta a string para um objeto e pegue o _id.
    const usuario = JSON.parse(userDataString);
    const userId = usuario?._id;

    if (!userId) {
      alert('Não foi possível encontrar o ID do usuário. Por favor, faça login novamente.');
      return;
    }
    // --- FIM DA CORREÇÃO ---

    const token = localStorage.getItem('firebaseToken');

    const formData = new FormData();
    formData.append("nome", nomeEvento);
    if (image) formData.append('imagem', image);
    formData.append("categoria", categoriaEvento);
    formData.append("descricao", descricao);
    formData.append("cep", cep.replace(/\D/g, ''));
    formData.append("rua", rua);
    formData.append("bairro", bairro);
    formData.append("numero", numero);
    formData.append("complemento", complemento);
    formData.append("cidade", cidade);
    formData.append("estado", estado);
    formData.append("linkMaps", linkMaps);
    formData.append("dataInicio", dataInicio);
    formData.append("horaInicio", horaInicio);
    formData.append("horaTermino", horaTermino);
    formData.append("dataFimVendas", dataFimVendas);
    formData.append("dataInicioVendas", dataInicioVendas);
    formData.append("valorIngressoInteira", valorIngressoInteira);
    formData.append("valorIngressoMeia", temMeia === 'sim' ? valorIngressoMeia : '0');
    formData.append("quantidadeInteira", quantidadeInteira);
    formData.append("quantidadeMeia", temMeia === 'sim' ? quantidadeMeia : '0');
    formData.append("temMeia", temMeia);
    formData.append("querDoar", String(querDoar));
    formData.append("valorDoacao", querDoar ? valorDoacao : '0');

    // 3. Envie o ID do usuário correto para o backend.
    formData.append("criadoPor", userId);

    try {
      const response = await fetch('http://localhost:5000/api/eventos/criar', {
        method: 'POST',
        headers: {
          // O token ainda pode ser útil para uma rota autenticada
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      const responseData = await response.json();

      if (!response.ok) {
        // Usa a mensagem de erro do backend se disponível
        throw new Error(responseData.message || `Erro do servidor: ${response.status}`);
      }

      alert('Evento criado com sucesso!');

      const cooldownDuration = 5 * 60 * 1000; // 5 minutos
      const cooldownEndTime = Date.now() + cooldownDuration;

      localStorage.setItem('eventoCooldownEnd', cooldownEndTime.toString());
      navigate('/Home');
      setIsCooldown(true);
      setCooldownTimeLeft(Math.floor(cooldownDuration / 1000));

    } catch (error: any) {
      alert(error.message);
    }
  };

  const getError = (fieldName: string) => erros[fieldName];

  return (
    <div>
      <header className="criar-evento-header">
        <div className="criar-juntos">
          <Link to="/Home" title="Voltar">
            <img src={logo} alt="Logo" className="duvidas-header-logo" />
          </Link>
          <hr className="duvidas-hr" />
          <h1 className="criar-titulo">
            Crie <span className="criar-dubtitle">seu evento</span>
          </h1>
        </div>
        <div className="criar-header-botoes">
          <button className="btn-salvar-sair" onClick={handleAbrirModal}>
            <ImExit />
            Sair
          </button>
          {isCooldown && (
            <span className="header-cooldown-timer">
              {`Próximo envio disponível em (${formatTime(cooldownTimeLeft || 0)})`}
            </span>
          )}
        </div>
      </header>

      {modalAberto && (
        <div className="criar-modal-overlay">
          <div className="criar-modal-content">
            <h2>Tem certeza que deseja sair?</h2>
            <p>Todo o progresso preenchido no formulário será perdido.</p>
            <div className="criar-modal-botoes">
              <button onClick={handleFecharModal} className="criar-modal-btn-cancelar">
                Não, continuar
              </button>
              <button onClick={handleConfirmarSaida} className="criar-modal-btn-confirmar">
                Sim, quero sair
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="criar-form">
        <div className="alerta-amarelo">
          <GoAlertFill /> <strong>Atenção:</strong> Para que você possa receber o pagamento do seu evento, é <strong>obrigatório</strong><br />
          preencher suas informações pessoais. Por favor, <a href="/perfil">clique aqui e complete seu perfil</a>.
        </div>

        {etapaAtual === 1 && (
          <div className="informacoes-basicas-container">
            <div className="criar-Informaçao">
              <h2>1. Informações básicas</h2>
            </div>
            <p style={{ margin: 10 }}>(*) Todos que tiver isso na frente é obrigatória!!!</p>
            <div className="campo">
              <label htmlFor="nome-evento">
                Nome do evento <span className={getError('nomeEvento') ? 'erro-asterisco' : ''}>*</span>
              </label>
              <input
                type="text"
                id="nome-evento"
                placeholder="Digite o nome do evento"
                value={nomeEvento}
                onChange={(e) => setNomeEvento(e.target.value)}
                className={getError('nomeEvento') ? 'erro-campo' : ''}
              />
              {getError('nomeEvento') && <span className="mensagem-erro">{getError('nomeEvento')}</span>}
            </div>

            <div className="campo">
              <label htmlFor="imagem-evento">
                Imagem do evento <span className={getError('imagem') ? 'erro-asterisco' : ''}>*</span>
              </label>
              <div className="upload-imagem">
                <input
                  type="file"
                  id="imagem-evento"
                  className="input-file"
                  onChange={handleImageChange}
                  accept="image/*"
                />

                {imagePreviewUrl ? (
                  <div className="image-preview-container">
                    <img src={imagePreviewUrl} alt="Preview do evento" className="image-preview" />
                    <p className="image-name">{image?.name}</p>
                    <button
                      className="remove-image-button"
                      onClick={() => {
                        setImage(null);
                        setImagePreviewUrl(null);
                      }}
                    >
                      Remover Imagem
                    </button>
                  </div>
                ) : (
                  <label htmlFor="imagem-evento" className="upload-placeholder">
                    <MdAddPhotoAlternate size={55} />
                    <p>Clique para adicionar a imagem</p>
                  </label>
                )}
              </div>
              {getError('imagem') && <span className="mensagem-erro">{getError('imagem')}</span>}
            </div>

            <div className="campo">
              <label htmlFor="categoria-evento">
                Categoria do evento <span className={getError('categoriaEvento') ? 'erro-asterisco' : ''}>*</span>
              </label>
              <select
                id="categoria-evento"
                value={categoriaEvento}
                onChange={(e) => setCategoriaEvento(e.target.value)}
                className={getError('categoriaEvento') ? 'erro-campo' : ''}
              >
                <option value="">Selecione uma categoria</option>
                <option value="show">Rock</option>
                <option value="pop">Pop</option>
                <option value="Funk">Funk</option>
                <option value="Rap">Rap</option>
                <option value="Jazz">Jazz</option>
                <option value="Eletônica">Eletônica</option>
              </select>
              {getError('categoriaEvento') && <span className="mensagem-erro">{getError('categoriaEvento')}</span>}
            </div>
          </div>
        )}

        {etapaAtual === 2 && (
          <div className="informacoes-basicas-container">
            <div className="criar-Informaçao">
              <h2>2. Descrição</h2>
            </div>
            <div className="campo">
              <label htmlFor="descricao-evento">
                Descrição do evento <span className={getError('descricao') ? 'erro-asterisco' : ''}>*</span>
              </label>
              <textarea
                id="descricao-evento"
                placeholder="Digite aqui a descrição do evento..."
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                className={`criar-descricao ${getError('descricao') ? 'erro-campo' : ''}`}
              />
              {getError('descricao') && <span className="mensagem-erro">{getError('descricao')}</span>}
            </div>
          </div>
        )}

        {etapaAtual === 3 && (
          <div className="informacoes-basicas-container">
            <div className="criar-Informaçao">
              <h2>3. Local do seu evento</h2>
            </div>
            <div className="campo">
              <label htmlFor="cep-evento">
                CEP <span className={getError('cep') ? 'erro-asterisco' : ''}>*</span>
              </label>
              <input
                type="text"
                id="cep-evento"
                placeholder="Digite o CEP (ex: 00000-000)"
                value={cep}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, '');
                  if (value.length > 8) {
                    value = value.substring(0, 8);
                  }
                  let formattedValue = value;
                  if (value.length > 5) {
                    formattedValue = value.substring(0, 5) + '-' + value.substring(5);
                  }

                  setCep(formattedValue);
                  if (value.length === 8) {
                    buscarEnderecoPorCep(value);
                  } else {
                    setRua('');
                    setBairro('');
                    setCidade('');
                    setEstado('');
                  }
                }}
                maxLength={9}
                className={getError('cep') ? 'erro-campo' : ''}
              />
              {isFetchingCep && <span className="mensagem-info">Buscando CEP...</span>}
              {getError('cep') && <span className="mensagem-erro">{getError('cep')}</span>}
            </div>

            <div className="campo">
              <label htmlFor="rua-evento">
                Rua <span className={getError('rua') ? 'erro-asterisco' : ''}>*</span>
              </label>
              <input
                type="text"
                id="rua-evento"
                placeholder="Preenchido automaticamente"
                value={rua}
                readOnly
                className={`input-readonly ${getError('rua') ? 'erro-campo' : ''}`}
              />
              {getError('rua') && <span className="mensagem-erro">{getError('rua')}</span>}
            </div>

            <div className="campo">
              <label htmlFor="bairro-evento">
                Bairro <span className={getError('bairro') ? 'erro-asterisco' : ''}>*</span>
              </label>
              <input
                type="text"
                id="bairro-evento"
                placeholder="Preenchido automaticamente"
                value={bairro}
                readOnly
                className={`input-readonly ${getError('bairro') ? 'erro-campo' : ''}`}
              />
              {getError('bairro') && <span className="mensagem-erro">{getError('bairro')}</span>}
            </div>

            <div className="campos-horizontais">
              <div className="campo">
                <label htmlFor="numero-casa">
                  Número<span className={getError('numero') ? 'erro-asterisco' : ''}>*</span>
                </label>
                <input
                  type="text"
                  id="numero-casa"
                  placeholder="Número do Local"
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                  className={getError('numero') ? 'erro-campo' : ''}
                />
                {getError('numero') && <span className="mensagem-erro">{getError('numero')}</span>}
              </div>

              <div className="campo">
                <label htmlFor="complemento-casa">
                  Complemento
                </label>
                <input
                  type="text"
                  id="complemento-casa"
                  placeholder="Referência / Ex: Bloco B"
                  value={complemento}
                  onChange={(e) => setComplemento(e.target.value)}
                />
              </div>
            </div>

            <div className="campo">
              <label htmlFor="cidade-evento">
                Cidade <span className={getError('cidade') ? 'erro-asterisco' : ''}>*</span>
              </label>
              <input
                type="text"
                id="cidade-evento"
                placeholder="Preenchido automaticamente"
                value={cidade}
                readOnly
                className={`input-readonly ${getError('cidade') ? 'erro-campo' : ''}`}
              />
              {getError('cidade') && <span className="mensagem-erro">{getError('cidade')}</span>}
            </div>

            <div className="campo">
              <label htmlFor="estado-evento">
                Estado <span className={getError('estado') ? 'erro-asterisco' : ''}>*</span>
              </label>
              <input
                type="text"
                id="estado-evento"
                placeholder="Preenchido automaticamente"
                value={estado}
                readOnly
                className={`input-readonly ${getError('estado') ? 'erro-campo' : ''}`}
              />
              {getError('estado') && <span className="mensagem-erro">{getError('estado')}</span>}
            </div>

            <div className="campo">
              <label htmlFor="link-maps" style={{ display: 'flex', alignItems: 'center' }}>
                Link do Local no Google Maps <span className={getError('linkMaps') ? 'erro-asterisco' : ''}>*</span>
                <FaQuestionCircle
                  size={16}
                  color="#555"
                  style={{ marginLeft: '5px', cursor: 'help' }}
                  title="Como obter o link do Google Maps:&#10;1. Acesse Google Maps e pesquise pelo local.&#10;2. Clique em 'Compartilhar' (ícone de seta).&#10;3. Escolha 'Incorporar um mapa' ou 'Copiar link'.&#10;4. Cole o link aqui."
                />
              </label>
              <input
                type="url"
                id="link-maps"
                placeholder="Cole o link do local no Google Maps"
                value={linkMaps}
                onChange={(e) => setLinkMaps(e.target.value)}
                className={getError('linkMaps') ? 'erro-campo' : ''}
              />
              {getError('linkMaps') && <span className="mensagem-erro">{getError('linkMaps')}</span>}
            </div>
          </div>
        )}

        {etapaAtual === 4 && (
          <div className="informacoes-basicas-container">
            <div className="criar-Informaçao">
              <h2>4. Data e Hora</h2>
            </div>

            <div className="campo">
              <label htmlFor="data-inicio-evento">
                Data de Início do Evento <span className={getError('dataInicio') ? 'erro-asterisco' : ''}>*</span>
              </label>
              <input
                type="date"
                id="data-inicio-evento"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                className={getError('dataInicio') ? 'erro-campo' : ''}
              />
              {getError('dataInicio') && <span className="mensagem-erro">{getError('dataInicio')}</span>}
            </div>

            <div className="campos-horizontais">

              <div className="campo">
                <label htmlFor="hora-inicio">
                  Hora de Início <span className={getError('horaInicio') ? 'erro-asterisco' : ''}>*</span>
                </label>
                <input
                  type="time"
                  id="hora-inicio"
                  value={horaInicio}
                  onChange={(e) => setHoraInicio(e.target.value)}
                  className={getError('horaInicio') ? 'erro-campo' : ''}
                />
                {getError('horaInicio') && <span className="mensagem-erro">{getError('horaInicio')}</span>}
              </div>

              <div className="campo">
                <label htmlFor="hora-termino">
                  Hora de Término <span className={getError('horaTermino') ? 'erro-asterisco' : ''}>*</span>
                </label>
                <input
                  type="time"
                  id="hora-termino"
                  value={horaTermino}
                  onChange={(e) => setHoraTermino(e.target.value)}
                  className={getError('horaTermino') ? 'erro-campo' : ''}
                />
                {getError('horaTermino') && <span className="mensagem-erro">{getError('horaTermino')}</span>}
              </div>

            </div>
          </div>
        )}

        {etapaAtual === 5 && (
          <div className="informacoes-basicas-container">
            <div className="criar-Informaçao">
              <h2>5. Ingressos</h2>
            </div>

            <div className="container-ingressos">
              <div className="lado-esquerdo">
                <div className="campo">
                  <label>
                    Valor do Ingresso Inteira (R$) <span className={getError('valorInteira') ? 'erro-asterisco' : ''}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="R$ 0,00"
                    value={valorIngressoInteira}
                    onChange={(e) => {
                      let value = e.target.value.replace(/[^0-9,]/g, '');
                      const parts = value.split(',');
                      if (parts.length > 2) {
                        value = parts[0] + ',' + parts.slice(1).join('');
                      }
                      if (parts[1] && parts[1].length > 2) {
                        value = parts[0] + ',' + parts[1].substring(0, 2);
                      }
                      setValorIngressoInteira(value);
                    }}
                    className={getError('valorInteira') ? 'erro-campo' : ''}
                  />
                  {getError('valorInteira') && <span className="mensagem-erro">{getError('valorInteira')}</span>}
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
                      Valor do Ingresso Meia (R$) <span className={getError('valorMeia') ? 'erro-asterisco' : ''}>*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="R$ 0,00"
                      value={valorIngressoMeia}
                      onChange={(e) => {
                        let value = e.target.value.replace(/[^0-9,]/g, '');
                        const parts = value.split(',');
                        if (parts.length > 2) {
                          value = parts[0] + ',' + parts.slice(1).join('');
                        }
                        if (parts[1] && parts[1].length > 2) {
                          value = parts[0] + ',' + parts[1].substring(0, 2);
                        }
                        setValorIngressoMeia(value);
                      }}
                      className={getError('valorMeia') ? 'erro-campo' : ''}
                    />
                    {getError('valorMeia') && <span className="mensagem-erro">{getError('valorMeia')}</span>}
                  </div>
                )}
              </div>

              <div className="lado-direito">
                <div className="campo">
                  <label>
                    Quantidade Inteira <span className={getError('quantidadeInteira') ? 'erro-asterisco' : ''}>*</span>
                  </label>
                  <input
                    type="number"
                    value={quantidadeInteira}
                    onChange={(e) => setQuantidadeInteira(e.target.value)}
                    min={1}
                    className={getError('quantidadeInteira') ? 'erro-campo' : ''}
                  />
                  {getError('quantidadeInteira') && <span className="mensagem-erro">{getError('quantidadeInteira')}</span>}
                </div>

                {temMeia === 'sim' && (
                  <div className="campo">
                    <label>
                      Quantidade Meia <span className={getError('quantidadeMeia') ? 'erro-asterisco' : ''}>*</span>
                    </label>
                    <input
                      type="number"
                      value={quantidadeMeia}
                      onChange={(e) => setQuantidadeMeia(e.target.value)}
                      min={1}
                      className={getError('quantidadeMeia') ? 'erro-campo' : ''}
                    />
                    {getError('quantidadeMeia') && <span className="mensagem-erro">{getError('quantidadeMeia')}</span>}
                  </div>
                )}

                <div className="campo">
                  <label>Data de Início das Vendas <span className={getError('dataInicioVendas') ? 'erro-asterisco' : ''}>*</span></label>
                  <input
                    type="date"
                    id="data-inicio-vendas"
                    value={dataInicioVendas}
                    onChange={(e) => setDataInicioVendas(e.target.value)}
                    className={getError('dataInicioVendas') ? 'erro-campo' : ''}
                  />
                  {getError('dataInicioVendas') && <span className="mensagem-erro">{getError('dataInicioVendas')}</span>}
                </div>

                <div className="campo">
                  <label>Data de Fim das Vendas <span className={getError('dataFimVendas') ? 'erro-asterisco' : ''}>*</span></label>
                  <input
                    type="date"
                    id="data-fim-vendas"
                    value={dataFimVendas}
                    onChange={(e) => setDataFimVendas(e.target.value)}
                    className={getError('dataFimVendas') ? 'erro-campo' : ''}
                  />
                  {getError('dataFimVendas') && <span className="mensagem-erro">{getError('dataFimVendas')}</span>}
                </div>
              </div>
            </div>
          </div>
        )}

        {etapaAtual === 6 && (
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
                <input
                  type="text"
                  id="valor-doacao"
                  value={valorDoacao}
                  onChange={(e) => {
                    let value = e.target.value.replace(/[^0-9,]/g, '');
                    const parts = value.split(',');
                    if (parts.length > 2) {
                      value = parts[0] + ',' + parts.slice(1).join('');
                    }
                    if (parts[1] && parts[1].length > 2) {
                      value = parts[0] + ',' + parts[1].substring(0, 2);
                    }
                    setValorDoacao(value);
                  }}
                  placeholder="R$ 0,00"
                  className={getError('valorDoacao') ? 'erro-campo' : ''}
                />
                {getError('valorDoacao') && <span className="mensagem-erro">{getError('valorDoacao')}</span>}
              </div>
            )}
            <div className="termos-container">
              <div className="checkbox-container">
                <input
                  type="checkbox"
                  id="termos-aceitos"
                  checked={termosAceitos}
                  onChange={(e) => setTermosAceitos(e.target.checked)}
                />
                <label htmlFor="termos-aceitos">
                  Eu li e concordo com os{' '}
                  <a href="/Termos" target="_blank" rel="noopener noreferrer">
                    Termos e Condições para a criação de eventos
                  </a>.
                </label>
              </div>
            </div>
          </div>
        )}

        <div className="navegacao-etapas">
          {etapaAtual > 1 && (
            <button className="btn-anterior" onClick={etapaAnterior}>
              Voltar
            </button>
          )}
          {etapaAtual < 6 && (
            <button className="btn-proximo" onClick={handleProximaEtapa}>
              Próxima Etapa
            </button>
          )}
          {etapaAtual === 6 && (
            <button
              className="criar-btn-enviar"
              onClick={handleEnviarAnalise}
              disabled={isCooldown || !termosAceitos}
            >
              {isCooldown
                ? `Aguarde... (${formatTime(cooldownTimeLeft || 0)})`
                : 'Enviar para Análise'}
              <IoSend />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

export default CriarEventos;
