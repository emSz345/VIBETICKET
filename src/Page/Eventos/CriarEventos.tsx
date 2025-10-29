import { useState, useEffect } from 'react';
import '../../styles/CriarEventos.css';
import { MdAddPhotoAlternate } from 'react-icons/md';
import { ImExit } from "react-icons/im";
import { IoSend } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import Conclusao from "../../assets/img-conclusao.png"
import { useAuth } from '../../Hook/AuthContext';

import { Link } from 'react-router-dom';
import { GoAlertFill } from "react-icons/go";
import { FaTrashAlt } from "react-icons/fa";

function CriarEventos() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  const { user, isLoading: isAuthLoading } = useAuth();

  const [etapaAtual, setEtapaAtual] = useState(1);

  // ESTADOS DO COMPONENTE
  const [nomeEvento, setNomeEvento] = useState('');
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
  const [temMeia, setTemMeia] = useState(false);
  const [dataFimVendas, setDataFimVendas] = useState('');
  const [dataInicioVendas, setDataInicioVendas] = useState('');

  // Etapa 6
  const [termosAceitos, setTermosAceitos] = useState(false);
  const [valorDoacao, setValorDoacao] = useState('');

  // Outros estados
  const [modalAberto, setModalAberto] = useState(false);
  const [erros, setErros] = useState<{ [key: string]: string }>({});
  const [isCooldown, setIsCooldown] = useState(false);
  const [cooldownTimeLeft, setCooldownTimeLeft] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [perfilCompleto, setPerfilCompleto] = useState(false);
  const [perfilCarregado, setPerfilCarregado] = useState(false);

  // MODAL CONCLUSÃO
  const [modalSucessoAberto, setModalSucessoAberto] = useState(false);

  const handleAbrirModal = () => setModalAberto(true);
  const handleFecharModal = () => setModalAberto(false);
  const handleConfirmarSaida = () => navigate('/');
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
      reader.onloadend = () => { setImagePreviewUrl(reader.result as string); };
      reader.readAsDataURL(file);
    } else {
      setImage(null);
      setImagePreviewUrl(null);
    }
  };

  // Função para doação direta (SEM MODAL)
  const handleDoacaoDireta = async (valor: number) => {
    // 1. Pega o Token (ESSENCIAL)
    const token = localStorage.getItem('token');

    // 2. Pega os dados do usuário (apenas para verificar se está logado)
    const userDataString = localStorage.getItem('user');

    if (!userDataString || !token) { // Verifica os dois
      alert('Usuário não autenticado. Por favor, faça login para fazer uma doação.');
      navigate('/login');
      return;
    }

    // 3. Monta o body (APENAS com os itens, sem userId)
    const doacaoData = {
      items: [{
        title: "Doação para Evento", // O backend pode ignorar isso, mas é bom ter
        quantity: 1,
        unit_price: valor, // O backend vai validar isso
      }],
    };

    try {
      // 4. Faz o fetch para a ROTA NOVA
      const response = await fetch(`${apiUrl}/api/pagamento/create-preference`, { // Rota correta
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 5. 🔥 ENVIA O TOKEN
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(doacaoData),
        // 'credentials: 'include'' (Opcional, mas pode manter se usar)
      });

      if (!response.ok) {
        const errorData = await response.json();
        // Trata erro de token
        if (response.status === 401 || response.status === 403) {
          alert("Sessão expirada. Faça login novamente.");
          navigate('/login');
          return;
        }
        throw new Error(errorData.error || `Erro do servidor: ${response.status}`);
      }

      const responseData = await response.json();
      const url = responseData.preference_url;

      window.open(url, '_blank'); // Abre a tela de pagamento

    } catch (error: any) {
      console.error('Erro na doação:', error);
      alert(error.message || "Erro na criação da preferência.");
    }
  };


  useEffect(() => {
    if (modalSucessoAberto) {
      const timer = setTimeout(() => {
        setModalSucessoAberto(false);
        navigate('/Home');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [modalSucessoAberto, navigate]);

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
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

  useEffect(() => {
    const verificarPerfil = async () => {
      const userDataString = localStorage.getItem('user');
      if (userDataString) {
        try {
          const usuario = JSON.parse(userDataString);
          const userId = usuario?._id;
          if (userId) {
            const response = await fetch(`${apiUrl}/api/perfil/${userId}`);
            if (response.ok) {
              const perfilData = await response.json();
              const isComplete = (perfilData.dadosPessoais && perfilData.dadosPessoais.cpf) || (perfilData.dadosOrganizacao && perfilData.dadosOrganizacao.cnpj);
              setPerfilCompleto(!!isComplete);
            }
          }
        } catch (error) {
          console.error('Erro ao verificar perfil:', error);
        }
      }
      setPerfilCarregado(true);
    };
    verificarPerfil();
  }, [apiUrl]);

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

  const handleLinkMapsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pastedText = e.target.value;

    setErros(prevErros => {
      const newErros = { ...prevErros };
      delete newErros.linkMaps;
      return newErros;
    });

    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(pastedText, 'text/html');
      const iframe = doc.querySelector('iframe');

      if (iframe && iframe.getAttribute('src')) {
        const embedUrl = iframe.getAttribute('src')!;
        setLinkMaps(embedUrl);
      } else {
        setLinkMaps(pastedText);
        setErros(prevErros => ({
          ...prevErros,
          linkMaps: 'Cole o código de incorporação completo do mapa (HTML).'
        }));
      }
    } catch (error) {
      console.error("Erro ao analisar o código HTML do mapa:", error);
      setLinkMaps(pastedText);
      setErros(prevErros => ({
        ...prevErros,
        linkMaps: 'Formato de código inválido. Por favor, tente novamente.'
      }));
    }
  };

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

        if (!linkMaps || !linkMaps.startsWith('http')) {
          novosErros.linkMaps = 'O link do Google Maps é inválido ou não foi fornecido. Por favor, cole o código de incorporação completo (HTML) do mapa.';
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
        if (temMeia) {
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
        break;
      default:
        break;
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  useEffect(() => {
    // Só executa a lógica depois que o AuthContext terminou de verificar a sessão
    if (!isAuthLoading) {
      // Se o usuário está logado, mas NÃO tem a conta do MP conectada...
      if (user && !user.mercadoPagoAccountId) {
        // ...redireciona ele para a página de perfil com uma mensagem de alerta.
        navigate('/perfil', {
          replace: true, // Impede o usuário de voltar para a página de criação
          state: {
            alerta: 'Para criar um evento, você precisa primeiro vincular sua conta do Mercado Pago.'
          }
        });
      }
    }
  }, [isAuthLoading, user, navigate]);

  // ALTERADO 
  const handleEnviarAnalise = async () => {
    if (!validarEtapa(1) || !validarEtapa(2) || !validarEtapa(3) || !validarEtapa(4) || !validarEtapa(5)) {
      alert('Por favor, corrija os erros em todos os campos antes de enviar para análise.');
      if (!validarEtapa(1)) { setEtapaAtual(1); return; }
      if (!validarEtapa(2)) { setEtapaAtual(2); return; }
      if (!validarEtapa(3)) { setEtapaAtual(3); return; }
      if (!validarEtapa(4)) { setEtapaAtual(4); return; }
      if (!validarEtapa(5)) { setEtapaAtual(5); return; }
      return;
    }

    if (!termosAceitos) {
      alert('Você deve aceitar os Termos e Condições para criar o evento.');
      return;
    }


    if (!user) {
      alert('Usuário não autenticado. Por favor, faça login para criar um evento.');
      navigate('/login');
      return;
    }

    // **** MUDANÇA ETAPA 1: CALCULE OS VALORES FINAIS AQUI ****
    // Use a sua função auxiliar que já existe para calcular os valores com 10% de taxa
    const valorFinalInteiraCalculado = calcularValorFinalComTaxa(valorIngressoInteira);
    const valorFinalMeiaCalculado = temMeia ? calcularValorFinalComTaxa(valorIngressoMeia) : 0;

    // Sua função `calcularValorFinalComTaxa` retorna um NÚMERO (ex: 110.50),
    // que é o formato ideal para o MongoDB.

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

    // **** MUDANÇA ETAPA 2: SUBSTITUA OS VALORES NO FORMDATA ****

    // CÓDIGO ANTIGO (Comentado):
    // formData.append("valorIngressoInteira", valorIngressoInteira);
    // formData.append("valorIngressoMeia", temMeia ? valorIngressoMeia : '0');

    // CÓDIGO NOVO:
    // Use as variáveis que você acabou de calcular.
    // O .toString() converte o número (ex: 110.5) para string ("110.5")
    // para ser enviado no FormData. O backend salvará isso como Número.
    formData.append("valorIngressoInteira", valorFinalInteiraCalculado.toString());
    formData.append("valorIngressoMeia", valorFinalMeiaCalculado.toString());

    // **** FIM DAS MUDANÇAS ****

    formData.append("quantidadeInteira", quantidadeInteira);
    formData.append("quantidadeMeia", temMeia ? quantidadeMeia : '0');
    formData.append("temMeia", temMeia ? 'true' : 'false');
    formData.append("criadoPor", user._id);

    setIsSubmitting(true);

    try {
      // 1. 🔥 PEGUE O TOKEN (igual você faz no carrinho)
      const token = localStorage.getItem('token');

      // 2. 🔥 VERIFIQUE O TOKEN
      if (!token) {
        alert("Sessão expirada. Por favor, faça login novamente.");
        navigate('/login'); // 'navigate' precisa estar disponível no seu componente
        setIsSubmitting(false);
        return;
      }

      // 3. 🔥 ADICIONE O 'headers' NA REQUISIÇÃO
      const response = await fetch(`${apiUrl}/api/eventos/criar`, {
        method: 'POST',
        body: formData,
        // 'credentials: 'include'' é para cookies, o 'Authorization' é para token.
        // É bom manter os dois se seu auth usa ambos.
        credentials: 'include',
        headers: {
          // NÃO defina o 'Content-Type' quando usar FormData
          'Authorization': `Bearer ${token}` // <-- A LINHA QUE FALTAVA
        }
      });

      const responseData = await response.json();

      if (!response.ok) {
        // Se o token for inválido (expirado), o servidor pode retornar 403
        if (response.status === 401 || response.status === 403) {
          alert("Sessão expirada ou inválida. Faça login novamente.");
          navigate('/login');
        }
        throw new Error(responseData.message || `Erro do servidor: ${response.status}`);
      }

      // Em vez do alert, abrir o modal de sucesso
      setModalSucessoAberto(true);

      const cooldownDuration = 5 * 60 * 1000;
      const cooldownEndTime = Date.now() + cooldownDuration;

      localStorage.setItem('eventoCooldownEnd', cooldownEndTime.toString());
      setIsCooldown(true);
      setCooldownTimeLeft(Math.floor(cooldownDuration / 1000));

    } catch (error: any) {
      // Verifica se o erro é o 401 que já tratamos
      if (error.message.includes('401') || error.message.includes('403')) {
        // O alerta já foi disparado, apenas loga
        console.error("Erro de autenticação ao criar evento.");
      } else {
        alert(error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAuthLoading || (user && !user.mercadoPagoAccountId)) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        Verificando seu perfil de criador...
      </div>
    );
  }

  const calcularValorFinalComTaxa = (valorBaseString: string) => {
    if (!valorBaseString) {
      return 0;
    }
    // 1. Converte a string "100,50" para o número 100.50
    const valorNumerico = parseFloat(valorBaseString.replace(',', '.'));

    if (isNaN(valorNumerico)) {
      return 0;
    }

    // 2. Calcula o valor com 10% de taxa
    const valorFinal = valorNumerico * 1.1;

    // 3. Arredonda para 2 casas decimais para evitar problemas de ponto flutuante
    // e retorna como um NÚMERO (que é o ideal para o MongoDB)
    return parseFloat(valorFinal.toFixed(2));
  };

  // Adicione a função para fechar o modal de sucesso e navegar


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

      {/* O Modal de Doação foi removido para simplificar a lógica */}
      {/* {modalDoacaoAberto && (...) } */}

      <div className="criar-form">
        {perfilCarregado && !perfilCompleto && (
          <div className="alerta-amarelo">
            <GoAlertFill /> <strong>Atenção:</strong> Para que você possa receber o <strong>pagamento</strong> do seu evento, é <strong>obrigatório</strong><br />
            preencher suas <strong>informações pessoais e vincular sua conta do mercado pago</strong> ao site. Por favor, <a href="/perfil">clique aqui e complete seu perfil</a>.
            <p></p>
            <br></br>
            <strong>Observação: o valor recebido sobre o ingresso antes da conexão com mercado pago não será resarcido</strong>
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
                      <FaTrashAlt />
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
                <option value="Rock">Rock</option>
                <option value="pop">Pop</option>
                <option value="Funk">Funk</option>
                <option value="Rap">Rap</option>
                <option value="Jazz">Jazz</option>
                <option value="Sertanejo">Sertanejo</option>
                <option value="Eletrônica">Eletrônica</option>
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
              </label>
              <input
                type="url"
                id="link-maps"
                placeholder="Cole o código de incorporação do mapa aqui"
                value={linkMaps}
                onChange={handleLinkMapsChange}
                className={getError('linkMaps') ? 'erro-campo' : ''}
              />
              {getError('linkMaps') && <span className="mensagem-erro">{getError('linkMaps')}</span>}
              <span className="tutorial-mapa">
                Como obter o link do Google Maps:
                <br />
                1. Acesse o Google Maps e pesquise pelo local.
                <br />
                2. Clique em 'Compartilhar' (ícone de seta).
                <br />
                3. Clique na aba 'Incorporar um mapa'.
                <br />
                4. Clique em 'Copiar HTML' e cole todo o código aqui.
              </span>
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
                  <small>Valor final para o comprador com 10% de taxa: R$ {(parseFloat(valorIngressoInteira.replace(',', '.')) * 1.1).toFixed(2).replace('.', ',')}</small>
                </div>

                <div className="campo">
                  <label>
                    Haverá ingresso meia?
                    <select
                      value={temMeia ? 'sim' : 'nao'}
                      onChange={(e) => {
                        const isMeia = e.target.value === 'sim';
                        setTemMeia(isMeia);
                        if (!isMeia) {
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

                {temMeia && (
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
                    <small>Valor final para o comprador com 10% de taxa: R$ {(parseFloat(valorIngressoMeia.replace(',', '.')) * 1.1).toFixed(2).replace('.', ',')}</small>
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

                {temMeia && (
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
            <h2 className="criar-doacao-title">6. Apoie uma causa</h2>
            <p className="criar-doacao-descricao">
              Se deseja apoiar a causa, por favor, digite o valor que deseja doar e clique no botão abaixo para fazer uma doação.
            </p>
            <p className='observacao-doacao'>Obs: A doação não terá influencia sobre a aprovação do seu evento</p>

            <div className="container-doacao-principal">
              <div className="campo">
                <label htmlFor="valor-doacao">Valor da Doação (R$)</label>
                <input
                  type="text"
                  id="valor-doacao"
                  value={valorDoacao}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9,]/g, '');
                    setValorDoacao(value);
                  }}
                  placeholder="Ex: 10,00"
                  className={getError('valorDoacao') ? 'erro-campo' : ''}
                />
                {getError('valorDoacao') && <span className="mensagem-erro">{getError('valorDoacao')}</span>}
              </div>

              <button
                onClick={() => {
                  const valorNumerico = parseFloat(valorDoacao.replace(',', '.'));
                  if (valorNumerico > 0) {
                    handleDoacaoDireta(valorNumerico);
                  } else {
                    alert('Por favor, insira um valor válido para a doação.');
                    setErros(prevErros => ({ ...prevErros, valorDoacao: 'Por favor, insira um valor maior que zero.' }));
                  }
                }}
                className="btn-doacao-direta"
                disabled={!valorDoacao || parseFloat(valorDoacao.replace(',', '.')) <= 0}
              >
                Fazer Doação
              </button>
            </div>

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
              disabled={isCooldown || !termosAceitos || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="loading-spinner"></div>
                  <span>Enviando...</span>
                </>
              ) : isCooldown ? (
                `Aguarde... (${formatTime(cooldownTimeLeft || 0)})`
              ) : (
                <>
                  Enviar para Análise
                  <IoSend />
                </>
              )}
            </button>
          )}
          {modalSucessoAberto && (
            <div className="criar-modal-overlay">
              <div className="criar-modal-content criar-modal-sucesso">
                <div className="criar-modal-sucesso-conteudo">
                  <img
                    src={Conclusao}
                    alt="Conclusão"
                    className="criar-modal-sucesso-imagem"
                  />
                  <h2 className="criar-modal-sucesso-titulo">
                    Parabéns! Seu evento foi criado!
                  </h2>
                  <p className="criar-modal-sucesso-mensagem">
                    Seu evento foi enviado para análise.
                  </p>
                  <div className="criar-modal-sucesso-progresso">
                    <div className="criar-modal-sucesso-barra"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CriarEventos;