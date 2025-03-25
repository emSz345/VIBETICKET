import { useState } from 'react';
import '../styles/CriarEventos.css';

import Rodape from '../components/Footer/Footer';
import NavBar from '../components/Home/NavBar/NavBar';

function CriarEventos() {
    const [imagemSelecionada, setImagemSelecionada] = useState<File | null>(null);
    const [toggleAtivo, setToggleAtivo] = useState(false);

    const handleFileInputClick = (id: string) => {
        const fileInput = document.getElementById(id);
        if (fileInput) {
            fileInput.click();
        }
    };

    const handleToggle = () => {
        setToggleAtivo(!toggleAtivo);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            console.log("Arquivo selecionado:", file.name);
            setImagemSelecionada(file);
        }
    };

    return (
        <div>
            <NavBar />
            <h3 className='criar-evento-title'>Críe seu evento</h3>
            <div className="criar-evento-conteudo">
                <div className="campo">
                    <div className="colunas">
                        {/* Coluna 1 */}
                        <div className="coluna">
                            <div className="campo-item">
                                <label>Nome do evento</label>
                                <input type="text" placeholder="Digite o nome do evento" />
                            </div>

                            <div className="campo-item">
                                <label>Local do evento</label>
                                <input type="text" placeholder="Digite o local do evento" />
                            </div>

                            <div className="campo-item">
                                <label>Link do endereço Google</label>
                                <input type="url" placeholder="Cole o link do Google Maps" />
                            </div>
                        </div>

                        {/* Coluna 2 */}
                        <div className="coluna">
                            <div className="campo-item">
                                <label>Data e hora de início</label>
                                <input type="datetime-local" />
                            </div>

                            <div className="campo-item">
                                <label>Data/hora de finalização</label>
                                <input type="datetime-local" />
                            </div>

                            <div className="campo-item">
                                <label>Categorias do evento</label>
                                <input type="text" placeholder="Ex: Festa, Workshop, Palestra" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="criar-evento-descricao">
                <div className="descricao">
                    <div className='descricao-flex'>
                        <h2>Descrição do evento</h2>
                        <p className="subtitle">Máx 40 letras</p>

                        {/* Botão para gerar descrição com IA */}
                        <button className="gerar-descricao-ia">
                            Gerar descrição com IA
                        </button>

                        {/* Botões de formatação */}
                        <div className="botoes-formatacao">
                            <button>F-</button>
                            <button>F+</button>
                            <button>S</button>
                            <button>I</button>
                            <button>N</button>
                        </div>
                    </div>

                    <textarea
                        className="input-descricao"
                        placeholder="Digite a descrição do evento..."
                        rows={6}
                    />
                </div>
            </div>
            <div className='criar-evento-ingresso'>
                <div className="campo">
                    <div className="colunas">
                        {/* Coluna 1 */}
                        <div className="coluna">
                            <div className="campo-item">
                                <label>Título do ingresso</label>
                                <input type="text" placeholder="Digite o título do ingresso" />
                            </div>

                            <div className="campo-item">
                                <label>Quantidade de ingressos disponíveis</label>
                                <input type="number" placeholder="Digite a quantidade" min="0" />
                            </div>
                        </div>

                        {/* Coluna 2 */}
                        <div className="coluna">
                            <div className="campo-item">
                                <label>Valor do ingresso</label>
                                <input type="number" placeholder="Digite o valor" min="0" step="0.01" />
                            </div>

                            <div className="campo-item">
                                <label>Limite de data de venda</label>
                                <input type="datetime-local" />
                            </div>
                        </div>
                    </div>

                </div>
                <div className='adicionar-ingresso'>
                    <h3 className='adicionar-ingresso-title'>Adicionar Tipo de Ingresso</h3>
                    <button
                        className='adicionar-ingresso-btn'
                        onClick={() => handleFileInputClick('file-input')}
                    >
                        Adicionar Tipo de Ingresso
                    </button>
                    <input
                        type="file"
                        id="file-input"
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
                </div>

            </div>
            <div className='criar-evento-imagem'>
                <div className='imagem-evento'>
                    <h3 className='imagem-evento-title'>Imagem do Evento</h3>
                    <p className='imagem-evento-subtitle'>Adicione uma logo ou imagem representativa do evento.</p>

                    <button
                        className='imagem-evento-btn'
                        onClick={() => handleFileInputClick('file-input-imagem')}
                    >
                        Adicionar Imagem
                    </button>
                    <input
                        type="file"
                        id="file-input-imagem"
                        accept=".jpg, .jpeg, .png"
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />

                    {/* Exibição da imagem selecionada */}
                    <div className='imagem-evento-preview'>
                        {imagemSelecionada && (
                            <img
                                src={URL.createObjectURL(imagemSelecionada)}
                                alt="Preview da Imagem"
                                className='imagem-evento-preview-img'
                            />
                        )}
                    </div>
                </div>
            </div>
            <div className='criar-evento-avancado'>
                <div className='avancado'>
                    <div className='avancado1'>
                        <h3 className='avancado-title'>Avançado</h3>

                        <div className='avancado-toggle'>
                            <label className='toggle-switch'>
                                <input
                                    type="checkbox"
                                    checked={toggleAtivo}
                                    onChange={handleToggle}
                                />
                                <span className='slider'></span>
                            </label>
                            <span className='toggle-label'>{toggleAtivo ? 'ON' : 'OFF'}</span>
                        </div>
                        <button className='btn-premium'>Premium</button>
                    </div>

                    <div className="colunas">
                        {/* Coluna 1 */}
                        <div className="coluna">
                            <div className="campo-item">
                                <label>Exemplo para resposta da API</label>
                                <p className='avancado-subtitle'>JSON</p>
                                <textarea
                                    className="input-avancado"
                                    placeholder="Cole o JSON de exemplo aqui..."
                                    rows={6}
                                />
                                <button className='avancado-botao-testar'>
                                    Testar API
                                </button>
                            </div>
                        </div>

                        {/* Coluna 2 */}
                        <div className="coluna">
                            <div className="campo-item">
                                <label>Link para resposta da API</label>
                                <input
                                    type="text"
                                    placeholder="Cole o link da API aqui..."
                                    className="input-avancado"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Rodape />
        </div>
    );
}

export default CriarEventos;