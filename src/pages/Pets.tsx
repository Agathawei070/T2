import { Component } from 'react';

interface Pet {
  nome: string;
  raca: string;
  tipo: string;
  genero: string;
  dono: string;
}

interface PetsState {
  busca: string;
  novoPet: Pet;
  exibirFormulario: boolean;
  pets: Pet[];
}

type EditandoPet = Pet & { index: number };

class Pets extends Component<{}, PetsState & { petSelecionado: Pet | null, editandoPet: EditandoPet | null }> {
  state: PetsState & { petSelecionado: Pet | null, editandoPet: EditandoPet | null } = {
    busca: '',
    novoPet: {
      nome: '',
      raca: '',
      tipo: '',
      genero: '',
      dono: '',
    },
    exibirFormulario: false,
    pets: [
      {
        nome: "Buddy Nelson",
        raca: "Fox Paulistinha",
        tipo: "Cão",
        genero: "Macho",
        dono: "Agatha Wei"
      },
      {
        nome: "Bartolomeu",
        raca: "Laranja",
        tipo: "Gato",
        genero: "Macho",
        dono: "Yun Yun Wei"
      }
    ],
    petSelecionado: null,
    editandoPet: null
  };

  handleBuscaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ busca: e.target.value });
  };

  handleNovoPetClick = () => {
    this.setState({ exibirFormulario: !this.state.exibirFormulario });
  };

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    this.setState(prevState => ({
      novoPet: {
        ...prevState.novoPet,
        [name]: value
      }
    }));
  };

  handleSalvarPet = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    this.setState(prevState => ({
      pets: [...prevState.pets, prevState.novoPet],
      novoPet: {
        nome: '',
        raca: '',
        tipo: '',
        genero: '',
        dono: '',
      },
      exibirFormulario: false
    }));
  };

  abrirModalDetalhes = (pet: Pet) => {
    this.setState({ petSelecionado: pet });
  };

  fecharModalDetalhes = () => {
    this.setState({ petSelecionado: null });
  };

  abrirModalEditar = (pet: Pet, index: number) => {
    this.setState({
      editandoPet: { ...pet, index }
    });
  };

  fecharModalEditar = () => {
    this.setState({ editandoPet: null });
  };

  handleEditarInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    this.setState(prevState => ({
      editandoPet: prevState.editandoPet
        ? { ...prevState.editandoPet, [name]: value }
        : null
    }));
  };

  handleSalvarEdicao = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { editandoPet, pets } = this.state;
    if (editandoPet) {
      const novosPets = [...pets];
      const idx = editandoPet.index;
      const petEditado = { ...editandoPet };
      delete (petEditado as any).index;
      novosPets[idx] = petEditado;
      this.setState({ pets: novosPets, editandoPet: null });
    }
  };

  handleDeletarPet = (index: number) => {
    if (window.confirm('Tem certeza que deseja excluir este pet?')) {
      this.setState(prevState => {
        const novosPets = [...prevState.pets];
        novosPets.splice(index, 1);
        return { pets: novosPets };
      });
    }
  };

  render() {
    const { busca, pets, exibirFormulario, novoPet, petSelecionado, editandoPet } = this.state;

    const petsFiltrados = pets.filter(pet =>
      pet.nome.toLowerCase().includes(busca.toLowerCase())
    );

    // Lista de donos para o select (únicos)
    const donosUnicos = Array.from(new Set(pets.map(p => p.dono).concat("Agatha Wei", "Yun Yun Wei")));

    return (
      <div className="container-fluid min-vh-100 bg-dark text-light py-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">Pets Cadastrados</h2>
            <button
              className="btn text-dark fw-semibold"
              style={{ background: '#0dcaf0', border: 'none' }}
              onClick={this.handleNovoPetClick}
            >
              {exibirFormulario ? 'Fechar' : <><i className="bi bi-plus-circle me-2"></i> Novo Pet</>}
            </button>
          </div>

          <div className="input-group mb-4">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por nome do pet..."
              value={busca}
              onChange={this.handleBuscaChange}
            />
          </div>

          {exibirFormulario && (
            <div className="card mb-4 bg-white text-dark">
              <div className="card-body">
                <h5 className="card-title">Cadastrar Novo Pet</h5>
                <form onSubmit={this.handleSalvarPet}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Nome</label>
                      <input
                        type="text"
                        className="form-control"
                        name="nome"
                        value={novoPet.nome}
                        onChange={this.handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Raça</label>
                      <input
                        type="text"
                        className="form-control"
                        name="raca"
                        value={novoPet.raca}
                        onChange={this.handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Tipo</label>
                      <input
                        type="text"
                        className="form-control"
                        name="tipo"
                        value={novoPet.tipo}
                        onChange={this.handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Gênero</label>
                      <select
                        className="form-control"
                        name="genero"
                        value={novoPet.genero}
                        onChange={this.handleInputChange}
                        required
                      >
                        <option value="">Selecione</option>
                        <option value="Macho">Macho</option>
                        <option value="Fêmea">Fêmea</option>
                      </select>
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Dono</label>
                      <select
                        className="form-control"
                        name="dono"
                        value={novoPet.dono}
                        onChange={this.handleInputChange}
                        required
                      >
                        <option value="">Selecione</option>
                        {donosUnicos.map((dono, idx) => (
                          <option key={idx} value={dono}>{dono}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-12 text-end">
                      <button type="submit" className="btn btn-success">Salvar Pet</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {petsFiltrados.map((pet, index) => (
              <div key={index} className="col">
                <div className="card shadow-sm h-100 bg-white text-dark border-0">
                  <div className="card-body">
                    <h5 className="card-title">{pet.nome}</h5>
                    <p><strong>Raça:</strong> {pet.raca}</p>
                    <p><strong>Tipo:</strong> {pet.tipo}</p>
                    <p><strong>Gênero:</strong> {pet.genero}</p>
                    <p><strong>Dono:</strong> {pet.dono}</p>
                  </div>
                  <div className="card-footer bg-white border-0 d-flex justify-content-center gap-2">
                    <button
                      className="btn btn-outline-dark btn-sm"
                      onClick={() => this.abrirModalDetalhes(pet)}
                    >
                      Ver Detalhes
                    </button>
                    <button
                      className="btn btn-warning btn-sm"
                      title="Editar"
                      onClick={() => this.abrirModalEditar(pet, index)}
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      title="Excluir"
                      onClick={() => this.handleDeletarPet(index)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Modal de Detalhes */}
          {petSelecionado && (
            <div className="modal fade show d-block" tabIndex={-1} style={{ background: 'rgba(0,0,0,0.5)' }}>
              <div className="modal-dialog">
                <div className="modal-content bg-white text-dark">
                  <div className="modal-header">
                    <h5 className="modal-title">Detalhes do Pet</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={this.fecharModalDetalhes}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <p><strong>Nome:</strong> {petSelecionado.nome}</p>
                    <p><strong>Raça:</strong> {petSelecionado.raca}</p>
                    <p><strong>Tipo:</strong> {petSelecionado.tipo}</p>
                    <p><strong>Gênero:</strong> {petSelecionado.genero}</p>
                    <p><strong>Dono:</strong> {petSelecionado.dono}</p>
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
          {editandoPet && (
            <div className="modal fade show d-block" tabIndex={-1} style={{ background: 'rgba(0,0,0,0.5)' }}>
              <div className="modal-dialog modal-xl">
                <div className="modal-content bg-white text-dark">
                  <form onSubmit={this.handleSalvarEdicao}>
                    <div className="modal-header">
                      <h5 className="modal-title">Editar Pet</h5>
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
                            value={editandoPet.nome}
                            onChange={this.handleEditarInputChange}
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Raça</label>
                          <input
                            type="text"
                            className="form-control"
                            name="raca"
                            value={editandoPet.raca}
                            onChange={this.handleEditarInputChange}
                            required
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">Tipo</label>
                          <input
                            type="text"
                            className="form-control"
                            name="tipo"
                            value={editandoPet.tipo}
                            onChange={this.handleEditarInputChange}
                            required
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">Gênero</label>
                          <select
                            className="form-control"
                            name="genero"
                            value={editandoPet.genero}
                            onChange={this.handleEditarInputChange}
                            required
                          >
                            <option value="">Selecione</option>
                            <option value="Macho">Macho</option>
                            <option value="Fêmea">Fêmea</option>
                          </select>
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">Dono</label>
                          <select
                            className="form-control"
                            name="dono"
                            value={editandoPet.dono}
                            onChange={this.handleEditarInputChange}
                            required
                          >
                            <option value="">Selecione</option>
                            {donosUnicos.map((dono, idx) => (
                              <option key={idx} value={dono}>{dono}</option>
                            ))}
                          </select>
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

export default Pets;
