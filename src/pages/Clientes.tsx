import { Component } from 'react';

interface Pet {
  nome: string;
  tipo: string;
  raca: string;
  genero: string;
}

interface Cliente {
  nome: string;
  nomeSocial?: string;
  email: string;
  telefone: string;
  ddd?: string;
  cpf: string;
  dataCadastro: string;
  observacoes?: string;
  endereco?: string;
  estado?: string;
  cidade?: string;
  bairro?: string;
  rua?: string;
  numero?: string;
  complemento?: string;
  cep?: string;
  pets?: Pet[];
}

interface ClientesState {
  busca: string;
  novoCliente: Cliente;
  exibirFormulario: boolean;
  clientes: Cliente[];
}

type EditandoCliente = Cliente & { index: number };

class Clientes extends Component<{}, ClientesState & { clienteSelecionado: Cliente | null, editandoCliente: EditandoCliente | null }> {
  state: ClientesState & { clienteSelecionado: Cliente | null, editandoCliente: EditandoCliente | null } = {
    busca: '',
    novoCliente: {
      nome: '',
      nomeSocial: '',
      email: '',
      telefone: '',
      ddd: '',
      cpf: '',
      dataCadastro: '',
      observacoes: '',
      endereco: '',
      estado: '',
      cidade: '',
      bairro: '',
      rua: '',
      numero: '',
      complemento: '',
      cep: '',
      pets: [],
    },
    exibirFormulario: false,
    clientes: [
      {
        nome: "Agatha Wei",
        email: "agatha.wei@gmail.com",
        telefone: "981613594",
        ddd: "12",
        cpf: "48044195866",
        dataCadastro: "2025-06-29",
        endereco: "Sergio Gonzaga de Azevedo, 201 - Jardim Por do Sol, São José dos Campos - SP, CEP: 12241340 (Casa)",
        estado: "SP",
        cidade: "São José dos Campos",
        bairro: "Jardim Por do Sol",
        rua: "Sergio Gonzaga de Azevedo",
        numero: "201",
        complemento: "Casa",
        cep: "12241340",
        pets: [
          {
            nome: "Buddy Nelson",
            tipo: "Cão",
            raca: "Fox Paulistinha",
            genero: "Macho"
          }
        ]
      },
      {
        nome: "Yun Yun Wei",
        email: "Yunyunwei@live.com",
        telefone: "",
        ddd: "",
        cpf: "",
        dataCadastro: "2025-06-29",
        endereco: "",
        estado: "",
        cidade: "",
        bairro: "",
        rua: "",
        numero: "",
        complemento: "",
        cep: "",
        pets: []
      }
    ],
    clienteSelecionado: null,
    editandoCliente: null
  };

  handleBuscaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ busca: e.target.value });
  };

  handleNovoClienteClick = () => {
    this.setState({ exibirFormulario: !this.state.exibirFormulario });
  };

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    this.setState(prevState => ({
      novoCliente: {
        ...prevState.novoCliente,
        [name]: value
      }
    }));
  };

  handleSalvarCliente = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const novo = {
      ...this.state.novoCliente,
      dataCadastro: new Date().toISOString().split('T')[0]
    };

    this.setState(prevState => ({
      clientes: [...prevState.clientes, novo],
      novoCliente: {
        nome: '',
        nomeSocial: '',
        email: '',
        telefone: '',
        ddd: '',
        cpf: '',
        dataCadastro: '',
        observacoes: '',
        endereco: '',
        estado: '',
        cidade: '',
        bairro: '',
        rua: '',
        numero: '',
        complemento: '',
        cep: '',
        pets: [],
      },
      exibirFormulario: false
    }));
  };

  abrirModalDetalhes = (cliente: Cliente) => {
    this.setState({ clienteSelecionado: cliente });
  };

  fecharModalDetalhes = () => {
    this.setState({ clienteSelecionado: null });
  };

  abrirModalEditar = (cliente: Cliente, index: number) => {
    this.setState({
      editandoCliente: { ...cliente, index }
    });
  };

  fecharModalEditar = () => {
    this.setState({ editandoCliente: null });
  };

  handleEditarInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    this.setState(prevState => ({
      editandoCliente: prevState.editandoCliente
        ? { ...prevState.editandoCliente, [name]: value }
        : null
    }));
  };

  handleSalvarEdicao = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { editandoCliente, clientes } = this.state;
    if (editandoCliente) {
      const novosClientes = [...clientes];
      const idx = editandoCliente.index;
      const clienteEditado = { ...editandoCliente };
      delete (clienteEditado as any).index;
      novosClientes[idx] = clienteEditado;
      this.setState({ clientes: novosClientes, editandoCliente: null });
    }
  };

  handleDeletarCliente = (index: number) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      this.setState(prevState => {
        const novosClientes = [...prevState.clientes];
        novosClientes.splice(index, 1);
        return { clientes: novosClientes };
      });
    }
  };

  render() {
    const { busca, clientes, exibirFormulario, novoCliente, clienteSelecionado, editandoCliente } = this.state;

    const clientesFiltrados = clientes.filter(cliente =>
      cliente.nome.toLowerCase().includes(busca.toLowerCase())
    );

    return (
      <div className="container-fluid min-vh-100 bg-dark text-light py-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">Clientes Cadastrados</h2>
            <button
              className="btn text-dark fw-semibold"
              style={{ background: '#0dcaf0', border: 'none' }}
              onClick={this.handleNovoClienteClick}
            >
              {exibirFormulario ? 'Fechar' : <><i className="bi bi-plus-circle me-2"></i> Novo Cliente</>}
            </button>
          </div>

          <div className="input-group mb-4">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por nome..."
              value={busca}
              onChange={this.handleBuscaChange}
            />
          </div>

          {exibirFormulario && (
            <div className="card mb-4 bg-white text-dark">
              <div className="card-body">
                <h5 className="card-title">Cadastrar Novo Cliente</h5>
                <form onSubmit={this.handleSalvarCliente}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Nome</label>
                      <input
                        type="text"
                        className="form-control"
                        name="nome"
                        value={novoCliente.nome}
                        onChange={this.handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">E-mail</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={novoCliente.email}
                        onChange={this.handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Telefone</label>
                      <input
                        type="text"
                        className="form-control"
                        name="telefone"
                        value={novoCliente.telefone}
                        onChange={this.handleInputChange}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">CPF</label>
                      <input
                        type="text"
                        className="form-control"
                        name="cpf"
                        value={novoCliente.cpf}
                        onChange={this.handleInputChange}
                      />
                    </div>
                    <div className="col-12 mb-3">
                      <label className="form-label">Endereço</label>
                      <input
                        type="text"
                        className="form-control"
                        name="endereco"
                        value={novoCliente.endereco}
                        onChange={this.handleInputChange}
                      />
                    </div>
                    <div className="col-12 mb-3">
                      <label className="form-label">Observações</label>
                      <textarea
                        className="form-control"
                        name="observacoes"
                        value={novoCliente.observacoes}
                        onChange={this.handleInputChange}
                      />
                    </div>
                    <div className="col-12 text-end">
                      <button type="submit" className="btn btn-success">Salvar Cliente</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {clientesFiltrados.map((cliente, index) => (
              <div key={index} className="col">
                <div className="card shadow-sm h-100 bg-white text-dark border-0">
                  <div className="card-body">
                    <h5 className="card-title">{cliente.nome}</h5>
                    <p><strong>E-mail:</strong> {cliente.email}</p>
                    <p><strong>Data de Cadastro:</strong> {cliente.dataCadastro}</p>
                  </div>
                  <div className="card-footer bg-white border-0 d-flex justify-content-center gap-2">
                    <button
                      className="btn btn-outline-dark btn-sm"
                      onClick={() => this.abrirModalDetalhes(cliente)}
                    >
                      Ver Detalhes
                    </button>
                    <button className="btn btn-warning btn-sm" title="Editar"
                      onClick={() => this.abrirModalEditar(cliente, index)}
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button className="btn btn-danger btn-sm" title="Excluir"
                      onClick={() => this.handleDeletarCliente(index)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Modal de Detalhes */}
          {clienteSelecionado && (
            <div className="modal fade show d-block" tabIndex={-1} style={{ background: 'rgba(0,0,0,0.5)' }}>
              <div className="modal-dialog">
                <div className="modal-content bg-white text-dark">
                  <div className="modal-header">
                    <h5 className="modal-title">Detalhes do Cliente</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={this.fecharModalDetalhes}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <p><strong>Nome:</strong> {clienteSelecionado.nome}</p>
                    <p><strong>E-mail:</strong> {clienteSelecionado.email}</p>
                    <p><strong>Data de Cadastro:</strong> {clienteSelecionado.dataCadastro}</p>
                    {clienteSelecionado.telefone && (
                      <p><strong>Telefone:</strong> {clienteSelecionado.telefone}</p>
                    )}
                    {clienteSelecionado.cpf && (
                      <p><strong>CPF:</strong> {clienteSelecionado.cpf}</p>
                    )}
                    {clienteSelecionado.endereco && (
                      <div>
                        <strong>Endereço:</strong>
                        <ul className="mb-2">
                          <li>{clienteSelecionado.endereco}</li>
                        </ul>
                      </div>
                    )}
                    {clienteSelecionado.pets && clienteSelecionado.pets.length > 0 && (
                      <div>
                        <strong>Pets:</strong>
                        <ul>
                          {clienteSelecionado.pets.map((pet, idx) => (
                            <li key={idx}>
                              <strong>Nome:</strong> {pet.nome} | <strong>Tipo:</strong> {pet.tipo} | <strong>Raça:</strong> {pet.raca} | <strong>Gênero:</strong> {pet.genero}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {clienteSelecionado.observacoes && (
                      <p><strong>Observações:</strong> {clienteSelecionado.observacoes}</p>
                    )}
                  </div>
                  <div className="modal-footer bg-white">
                    <button className="btn btn-secondary" onClick={this.fecharModalDetalhes}>
                      Fechar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal de Edição */}
          {editandoCliente && (
            <div className="modal fade show d-block" tabIndex={-1} style={{ background: 'rgba(0,0,0,0.5)' }}>
              <div className="modal-dialog modal-xl">
                <div className="modal-content bg-white text-dark">
                  <form onSubmit={this.handleSalvarEdicao}>
                    <div className="modal-header">
                      <h5 className="modal-title">Editar Cliente</h5>
                      <button
                        type="button"
                        className="btn-close"
                        onClick={this.fecharModalEditar}
                      ></button>
                    </div>
                    <div className="modal-body">
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label">Nome</label>
                          <input
                            type="text"
                            className="form-control"
                            name="nome"
                            value={editandoCliente.nome}
                            onChange={this.handleEditarInputChange}
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Nome Social (opcional)</label>
                          <input
                            type="text"
                            className="form-control"
                            name="nomeSocial"
                            value={editandoCliente.nomeSocial || ''}
                            onChange={this.handleEditarInputChange}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">E-mail</label>
                          <input
                            type="email"
                            className="form-control"
                            name="email"
                            value={editandoCliente.email}
                            onChange={this.handleEditarInputChange}
                            required
                          />
                        </div>
                        <div className="col-md-3">
                          <label className="form-label">DDD</label>
                          <input
                            type="text"
                            className="form-control"
                            name="ddd"
                            value={editandoCliente.ddd || ''}
                            onChange={this.handleEditarInputChange}
                          />
                        </div>
                        <div className="col-md-3">
                          <label className="form-label">Telefone</label>
                          <input
                            type="text"
                            className="form-control"
                            name="telefone"
                            value={editandoCliente.telefone}
                            onChange={this.handleEditarInputChange}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">CPF</label>
                          <input
                            type="text"
                            className="form-control"
                            name="cpf"
                            value={editandoCliente.cpf}
                            onChange={this.handleEditarInputChange}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Estado</label>
                          <input
                            type="text"
                            className="form-control"
                            name="estado"
                            value={editandoCliente.estado || ''}
                            onChange={this.handleEditarInputChange}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Cidade</label>
                          <input
                            type="text"
                            className="form-control"
                            name="cidade"
                            value={editandoCliente.cidade || ''}
                            onChange={this.handleEditarInputChange}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Bairro</label>
                          <input
                            type="text"
                            className="form-control"
                            name="bairro"
                            value={editandoCliente.bairro || ''}
                            onChange={this.handleEditarInputChange}
                          />
                        </div>
                        <div className="col-md-12">
                          <label className="form-label">Rua</label>
                          <input
                            type="text"
                            className="form-control"
                            name="rua"
                            value={editandoCliente.rua || ''}
                            onChange={this.handleEditarInputChange}
                          />
                        </div>
                        <div className="col-md-3">
                          <label className="form-label">Número</label>
                          <input
                            type="text"
                            className="form-control"
                            name="numero"
                            value={editandoCliente.numero || ''}
                            onChange={this.handleEditarInputChange}
                          />
                        </div>
                        <div className="col-md-3">
                          <label className="form-label">Complemento</label>
                          <input
                            type="text"
                            className="form-control"
                            name="complemento"
                            value={editandoCliente.complemento || ''}
                            onChange={this.handleEditarInputChange}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">CEP</label>
                          <input
                            type="text"
                            className="form-control"
                            name="cep"
                            value={editandoCliente.cep || ''}
                            onChange={this.handleEditarInputChange}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="modal-footer bg-white">
                      <button className="btn btn-secondary" type="button" onClick={this.fecharModalEditar}>
                        Cancelar
                      </button>
                      <button className="btn btn-success" type="submit">
                        Salvar Alterações
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    );
  }
}

export default Clientes;
