import React, { useState, useEffect } from 'react';
import '../../styles/CriarEventos.css'; // Reutiliza os mesmos estilos
import { useParams, useNavigate } from 'react-router-dom';
import { FaQuestionCircle } from 'react-icons/fa';
import { MdAddPhotoAlternate } from 'react-icons/md';
import { GoAlertFill } from "react-icons/go";
import { FaTrashAlt } from "react-icons/fa";
import logo from '../../assets/logo.png';
import { Link } from 'react-router-dom';
import { ImExit } from "react-icons/im";
import { IoSend } from "react-icons/io5";
import { useAuth } from '../../Hook/AuthContext'; // 🔥 1. IMPORTAR useAuth

type Evento = {
  // ... (Sua tipagem de Evento está ok)
  _id: string;
  nome: string;
  categoria: string;
  descricao: string;
  imagem: string;
  cep: string;
  rua: string;
  bairro: string;
  numero: string;
  complemento: string;
  cidade: string;
  estado: string;
  linkMaps: string;
  dataInicio: string;
  horaInicio: string;
  horaTermino: string;
  dataFimVendas: string;
  dataInicioVendas: string;
  valorIngressoInteira: number;
  valorIngressoMeia: number;
  quantidadeInteira: number;
  quantidadeMeia: number;
  temMeia: boolean;
  querDoar: boolean;
  valorDoacao: number;
  status: string;
};

const EditarEvento = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;
  const { user, isLoading: isAuthLoading } = useAuth(); // 🔥 2. OBTER O USUÁRIO LOGADO

  const [etapaAtual, setEtapaAtual] = useState(1);
  const [evento, setEvento] = useState<Evento | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [erros, setErros] = useState<{ [key: string]: string }>({});
  const [errorMessage, setErrorMessage] = useState('');
  const [modalAberto, setModalAberto] = useState(false);

  // Estados do formulário
  const [nomeEvento, setNomeEvento] = useState('');
  // ... (outros states do formulário: categoriaEvento, image, etc.)
  const [categoriaEvento, setCategoriaEvento] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [descricao, setDescricao] = useState('');
  const [cep, setCep] = useState('');
  const [rua, setRua] = useState('');
  const [bairro, setBairro] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [linkMaps, setLinkMaps] = useState('');
  const [isFetchingCep, setIsFetchingCep] = useState(false);
  const [dataInicio, setDataInicio] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaTermino, setHoraTermino] = useState('');
  const [valorIngressoInteira, setValorIngressoInteira] = useState('');
  const [valorIngressoMeia, setValorIngressoMeia] = useState('');
  const [quantidadeInteira, setQuantidadeInteira] = useState('');
  const [quantidadeMeia, setQuantidadeMeia] = useState('');
  const [temMeia, setTemMeia] = useState('false');
  const [dataFimVendas, setDataFimVendas] = useState('');
  const [dataInicioVendas, setDataInicioVendas] = useState('');
  // 🔥 REMOVIDO: Estados de Doação (querDoar, valorDoacao)
  const [termosAceitos, setTermosAceitos] = useState(false); // Mantido

  // --- Estados do Modal ---
  const [modalSucessoAberto, setModalSucessoAberto] = useState(false);

  // 🔥 3. ADICIONAR ESTADOS PARA VERIFICAÇÃO DE PERFIL
  const [perfilCompleto, setPerfilCompleto] = useState(false);
  const [perfilCarregado, setPerfilCarregado] = useState(false);


  // 🔥 4. CORREÇÃO DE AUTH (Token) no fetchEvento
  useEffect(() => {
    const fetchEvento = async () => {
      const token = localStorage.getItem('token'); // Pega o token
      if (!id || !token) {
        setErrorMessage('Evento não encontrado ou sessão inválida.');
        setLoading(false);
        if (!token) navigate('/login');
        return;
      }

      try {
        const response = await fetch(`${apiUrl}/api/eventos/${id}`, {
          // REMOVIDO: credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // ADICIONADO: Auth Header
          }
        });

        // ... (seu tratamento de status 401, 404, 403 está ok) ...
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }

        if (!response.ok) {
          throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setEvento(data);

        // Preencher os campos do formulário (seu código está ok)
        setNomeEvento(data.nome);
        setCategoriaEvento(data.categoria);
        setDescricao(data.descricao);
        setCep(data.cep);
        setRua(data.rua);
        setBairro(data.bairro);
        setNumero(data.numero);
        setComplemento(data.complemento || '');
        setCidade(data.cidade);
        setEstado(data.estado);
        setLinkMaps(data.linkMaps);
        setDataInicio(data.dataInicio);
        setHoraInicio(data.horaInicio);
        setHoraTermino(data.horaTermino);
        setDataFimVendas(data.dataFimVendas);
        setDataInicioVendas(data.dataInicioVendas);
        // Corrige para usar '.' como separador decimal interno
        setValorIngressoInteira(data.valorIngressoInteira?.toString().replace(',', '.') || '');
        setValorIngressoMeia(data.valorIngressoMeia?.toString().replace(',', '.') || '');
        setQuantidadeInteira(data.quantidadeInteira?.toString() || '');
        setQuantidadeMeia(data.quantidadeMeia?.toString() || '');
        setTemMeia(data.temMeia ? 'true' : 'false');
        // REMOVIDO: setQuerDoar, setValorDoacao
        setTermosAceitos(true); // Se está editando, já aceitou os termos antes

        if (data.imagem) {
          setImagePreviewUrl(`${apiUrl}/uploads/${data.imagem}`);
        }
      } catch (error) {
        console.error('Erro ao buscar evento:', error);
        setErrorMessage('Erro ao carregar evento');
      } finally {
        setLoading(false);
      }
    };

    fetchEvento();
  }, [id, apiUrl, navigate]);


  // 🔥 5. ADICIONAR VERIFICAÇÃO DE PERFIL (igual ao CriarEventos.tsx)
  useEffect(() => {
    // Roda apenas quando o 'user' do useAuth estiver disponível
    if (user && user._id) {
      const verificarPerfil = async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            setPerfilCarregado(true);
            return;
          }

          const response = await fetch(`${apiUrl}/api/perfil/${user._id}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            const perfilData = await response.json();
            // A verificação real:
            // 1. Tem dados pessoais (cpf) E conta do MP conectada
            // 2. OU Tem dados de organização (cnpj) E conta do MP conectada
            const dadosPessoaisOK = perfilData.tipoPessoa === 'cpf' && perfilData.dadosPessoais?.cpf;
            const dadosOrgOK = perfilData.tipoPessoa === 'cnpj' && perfilData.dadosPessoais?.cnpj && perfilData.dadosOrganizacao?.cpfSocio;
            const mpConectado = !!perfilData.mercadoPagoAccountId;

            if ((dadosPessoaisOK || dadosOrgOK) && mpConectado) {
              setPerfilCompleto(true);
            } else {
              setPerfilCompleto(false);
            }
          } else {
            // Se o perfil não existir, não está completo
            setPerfilCompleto(false);
          }
        } catch (error) {
          console.error('Erro ao verificar perfil:', error);
          setPerfilCompleto(false); // Assume incompleto em caso de erro
        } finally {
          setPerfilCarregado(true); // Marca que a verificação terminou
        }
      };
      verificarPerfil();
    } else if (!isAuthLoading) {
      // Se terminou de carregar auth e não tem usuário
      setPerfilCarregado(true);
      setPerfilCompleto(false);
    }
  }, [user, isAuthLoading, apiUrl]); // Roda quando 'user' ou 'isAuthLoading' mudam


  // ... (handleAbrirModal, handleFecharModal, handleConfirmarSaida, etc. estão ok)
  const handleAbrirModal = () => setModalAberto(true);
  const handleFecharModal = () => setModalAberto(false);
  const handleConfirmarSaida = () => navigate('/meus-eventos');
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
    // ... (seu código está ok)
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => { setImagePreviewUrl(reader.result as string); };
      reader.readAsDataURL(file);
    } else {
      setImage(null);
      setImagePreviewUrl(null);
    }
  };
  useEffect(() => { window.scrollTo(0, 0); }, [etapaAtual]);
  const buscarEnderecoPorCep = async (cep: string) => {
    // ... (seu código está ok)
    const cleanedCep = cep.replace(/\D/g, '');
    if (cleanedCep.length !== 8) {
      setErros(prevErros => ({ ...prevErros, cep: 'CEP inválido. Deve conter 8 dígitos.' }));
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
      } else {
        setRua(data.logradouro || '');
        setBairro(data.bairro || '');
        setCidade(data.localidade || '');
        setEstado(data.uf || '');
      }
    } catch (error) {
      setErros(prevErros => ({ ...prevErros, cep: 'Erro ao buscar CEP. Tente novamente.' }));
    } finally {
      setIsFetchingCep(false);
    }
  };


  // 🔥 6. AJUSTAR VALIDAÇÃO (Remover Etapa 6)
  const validarEtapa = (etapa: number) => {
    const novosErros: { [key: string]: string } = {};
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    switch (etapa) {
      case 1:
        if (!nomeEvento) novosErros.nomeEvento = 'O nome do evento é obrigatório.';
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
        if (temMeia === 'true') { // Comparação correta com string
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
      // REMOVIDO: case 6 (Doação)
      default:
        break;
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  // 🔥 7. AJUSTAR ENVIO (Remover Etapa 6 e Adicionar Token)
  const handleEnviarEdicao = async () => {
    // Validar apenas até a etapa 5
    if (!validarEtapa(1) || !validarEtapa(2) || !validarEtapa(3) || !validarEtapa(4) || !validarEtapa(5)) {
      alert('Por favor, corrija os erros em todos os campos antes de enviar para reanálise.');
      if (!validarEtapa(1)) { setEtapaAtual(1); return; }
      if (!validarEtapa(2)) { setEtapaAtual(2); return; }
      if (!validarEtapa(3)) { setEtapaAtual(3); return; }
      if (!validarEtapa(4)) { setEtapaAtual(4); return; }
      if (!validarEtapa(5)) { setEtapaAtual(5); return; } // Parar na 5
      return;
    }

    // Termos ainda são necessários (mas já vêm setados como true no useEffect)
    if (!termosAceitos) {
      alert('Você deve aceitar os Termos e Condições para editar o evento.');
      return;
    }

    setSaving(true);

    const formData = new FormData();

    // Adicionar todos os campos (exceto doação)
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
    // Envia valores com '.' (ponto)
    formData.append("valorIngressoInteira", valorIngressoInteira.replace(',', '.'));
    formData.append("valorIngressoMeia", temMeia === 'true' ? valorIngressoMeia.replace(',', '.') : '0');
    formData.append("quantidadeInteira", quantidadeInteira);
    formData.append("quantidadeMeia", temMeia === 'true' ? quantidadeMeia : '0');
    formData.append("temMeia", temMeia);
    // REMOVIDO: querDoar e valorDoacao
    formData.append("status", "em_reanalise");

    try {
      const token = localStorage.getItem('token'); // Pega o token
      if (!token) {
        alert('Sessão expirada. Faça login novamente.');
        navigate('/login');
        setSaving(false);
        return;
      }

      const response = await fetch(`${apiUrl}/api/eventos/${id}/editar`, {
        method: 'PUT',
        // REMOVIDO: credentials: 'include',
        body: formData,
        headers: {
          // ADICIONADO: Auth Header
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          navigate('/login');
        }
        const errorData = await response.json();
        throw new Error(errorData.message || `Erro do servidor: ${response.status}`);
      }

      setModalSucessoAberto(true); // Abre modal de sucesso

    } catch (error: any) {
      console.error('Erro ao editar evento:', error);
      alert(error.message || 'Erro ao editar evento');
    } finally {
      setSaving(false);
    }
  };

  const handleFecharModalSucesso = () => {
    setModalSucessoAberto(false);
    navigate('/meus-eventos');
  };

  const getError = (fieldName: string) => erros[fieldName];

  // Helper de cálculo (copiado do CriarEventos)
  const calcularValorFinalComTaxa = (valorBaseString: string) => {
    if (!valorBaseString) {
      return 0;
    }
    // A lógica de input deste componente salva com '.' (ponto)
    const valorNumerico = parseFloat(valorBaseString);
    if (isNaN(valorNumerico)) {
      return 0;
    }
    const valorFinal = valorNumerico * 1.1;
    return parseFloat(valorFinal.toFixed(2));
  };


  if (loading || isAuthLoading || (user && !perfilCarregado)) {
    return <div className="loading">Carregando...</div>;
  }
  if (errorMessage) return <div className="error-message">{errorMessage}</div>;
  if (!evento) return <div>Evento não encontrado</div>;

  return (
    <div>
      {/* ... (Seu Header e Modal de Saída - estão ok) ... */}
      <header className="criar-evento-header">
        <div className="criar-juntos">
          <Link to="/meus-eventos" title="Voltar">
            <img src={logo} alt="Logo" className="duvidas-header-logo" />
          </Link>
          <hr className="duvidas-hr" />
          <h1 className="criar-titulo">
            Editar <span className="criar-dubtitle">evento</span>
          </h1>
        </div>
        <div className="criar-header-botoes">
          <button className="btn-salvar-sair" onClick={handleAbrirModal}>
            <ImExit />
            Sair
          </button>
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

        {/* 🔥 8. AVISO DE PERFIL AGORA FUNCIONA CORRETAMENTE */}
        {perfilCarregado && !perfilCompleto && (
          <div className="alerta-amarelo">
            <GoAlertFill /> <strong>Atenção:</strong> Para que você possa receber o pagamento do seu evento, é <strong>obrigatório</strong><br />
            preencher suas informações pessoais e vincular sua conta do mercado pago. Por favor, <a href="/perfil">clique aqui e complete seu perfil</a>.
          </div>
        )}

        {etapaAtual === 1 && (
          <div className="informacoes-basicas-container">
            <div className="criar-Informaçao">
              <h2>1. Informações básicas</h2>
            </div>
            <p style={{ margin: 10, color: "red" }}>(*) Todos os campos que contém asterisco são obrigatórios!!!</p>
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
                Imagem do evento
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
                    <p className="image-name">{image?.name || 'Imagem atual'}</p>
                    <button
                      className="remove-image-button"
                      onClick={() => {
                        setImage(null);
                        setImagePreviewUrl(null);
                      }}
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                ) : (
                  <label htmlFor="imagem-evento" className="upload-placeholder">
                    <MdAddPhotoAlternate size={55} />
                    <p>Clique para alterar a imagem</p>
                  </label>
                )}
              </div>
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
                      value = value.replace(/,/g, '.'); // Armazena com ponto
                      if (value.includes('.')) {
                        const parts = value.split('.');
                        if (parts[1].length > 2) {
                          value = parts[0] + '.' + parts[1].substring(0, 2);
                        }
                      }
                      setValorIngressoInteira(value);
                    }}
                    className={getError('valorInteira') ? 'erro-campo' : ''}
                  />
                  {getError('valorInteira') && <span className="mensagem-erro">{getError('valorInteira')}</span>}

                  {/* 🔥 9. ADICIONADO HELPER DA TAXA */}
                  {/* (Usa replace('.', ',') para exibir corretamente) */}
                  <small className="taxa-info">
                    Valor final para o comprador com 10% de taxa:
                    <strong> R$ {(calcularValorFinalComTaxa(valorIngressoInteira) || 0).toFixed(2).replace('.', ',')}</strong>
                  </small>
                </div>

                <div className="campo">
                  <label>
                    Quantidade de Ingressos Inteira <span className={getError('quantidadeInteira') ? 'erro-asterisco' : ''}>*</span>
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={quantidadeInteira}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '' || (parseInt(value) >= 0 && parseInt(value) <= 1000000)) {
                        setQuantidadeInteira(value);
                      }
                    }}
                    min="0"
                    max="1000000"
                    className={getError('quantidadeInteira') ? 'erro-campo' : ''}
                  />
                  {getError('quantidadeInteira') && <span className="mensagem-erro">{getError('quantidadeInteira')}</span>}
                </div>

                <div className="campo">
                  <label>
                    Haverá meia-entrada?
                    <select
                      value={temMeia} // Valor agora é 'true' ou 'false' (string)
                      onChange={(e) => {
                        setTemMeia(e.target.value); // Salva 'true' ou 'false'
                        if (e.target.value === 'false') {
                          setValorIngressoMeia('');
                          setQuantidadeMeia('');
                        }
                      }}
                      className="select"
                    >
                      <option value="false">Não</option>
                      <option value="true">Sim</option>
                    </select>
                  </label>
                </div>

                {temMeia === 'true' && (
                  <>
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
                          value = value.replace(/,/g, '.'); // Armazena com ponto
                          if (value.includes('.')) {
                            const parts = value.split('.');
                            if (parts[1].length > 2) {
                              value = parts[0] + '.' + parts[1].substring(0, 2);
                            }
                          }
                          setValorIngressoMeia(value);
                        }}
                        className={getError('valorMeia') ? 'erro-campo' : ''}
                      />
                      {getError('valorMeia') && <span className="mensagem-erro">{getError('valorMeia')}</span>}

                      {/* 🔥 9. ADICIONADO HELPER DA TAXA */}
                      <small className="taxa-info">
                        Valor final para o comprador com 10% de taxa:
                        <strong> R$ {(calcularValorFinalComTaxa(valorIngressoMeia) || 0).toFixed(2).replace('.', ',')}</strong>
                      </small>
                    </div>

                    <div className="campo">
                      <label>
                        Quantidade de Ingressos Meia <span className={getError('quantidadeMeia') ? 'erro-asterisco' : ''}>*</span>
                      </label>
                      <input
                        type="number"
                        placeholder="0"
                        value={quantidadeMeia}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === '' || (parseInt(value) >= 0 && parseInt(value) <= 1000000)) {
                            setQuantidadeMeia(value);
                          }
                        }}
                        min="0"
                        max="1000000"
                        className={getError('quantidadeMeia') ? 'erro-campo' : ''}
                      />
                      {getError('quantidadeMeia') && <span className="mensagem-erro">{getError('quantidadeMeia')}</span>}
                    </div>
                  </>
                )}
              </div>

              <div className="lado-direito">
                <div className="campo">
                  <label htmlFor="data-inicio-vendas">
                    Data de Início das Vendas <span className={getError('dataInicioVendas') ? 'erro-asterisco' : ''}>*</span>
                  </label>
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
                  <label htmlFor="data-fim-vendas">
                    Data de Fim das Vendas <span className={getError('dataFimVendas') ? 'erro-asterisco' : ''}>*</span>
                  </label>
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

        {/* 🔥 10. REMOVIDO: {etapaAtual === 6 && (...)} */}

        <div className="navegacao-etapas">
          {etapaAtual > 1 && (
            <button className="btn-anterior" onClick={etapaAnterior}>
              Voltar
            </button>
          )}

          {/* 🔥 11. AJUSTADO: Navegação para a etapa 5 */}
          {etapaAtual < 5 ? ( // MUDADO DE 6 PARA 5
            <button className="btn-proximo" onClick={handleProximaEtapa}>
              Próximo
            </button>
          ) : (
            <button
              className="criar-btn-enviar"
              onClick={handleEnviarEdicao}
              disabled={!termosAceitos || saving} // Termos ainda necessários
            >
              {saving ? 'Salvando...' : 'Enviar para reanálise'}
              <IoSend />
            </button>
          )}
        </div>

        {/* ... (Modal de Sucesso - está ok) ... */}
        {modalSucessoAberto && (
          <div className="editarEvento-modal-overlay">
            <div className="editarEvento-modal">
              <div className="editarEvento-modal-content">
                <div className="editarEvento-modal-icon">
                  ✓
                </div>
                <h3 className="editarEvento-modal-title">Seu evento foi editado com sucesso!</h3>
                <p className="editarEvento-modal-message">
                  Com isso seu evento foi para reanálise, tem chance de ser aprovado ou ser reprovado.
                </p>
                <div className="editarEvento-modal-botoes">
                  <button
                    className="editarEvento-modal-btn-entendi"
                    onClick={handleFecharModalSucesso}
                  >
                    Entendi
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditarEvento;

