import { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

interface Cliente {
  id: number;
  nome: string;
}

interface Item {
  id: number;
  nome: string;
  tipo: 'Produto' | 'Serviço';
  preco: number;
}

interface ItemVenda {
  itemId: number;
  tipo: 'Produto' | 'Serviço';
  nome: string;
  quantidade: number;
  precoUnitario: number;
}

interface Venda {
  id: number;
  data: string;
  cliente: string;
  formaPagamento: string;
  itens: ItemVenda[];
  total: number;
  status: string;
}

interface State {
  clientes: Cliente[];
  itensDisponiveis: Item[];
  vendas: Venda[];
  mostrarFormulario: boolean;
  indexEdicao: number | null;
  vendaSelecionada: Venda | null;
  novaVenda: {
    clienteId: number;
    formaPagamento: string;
    itens: ItemVenda[];
    total: number;
  };
  novoItem: {
    tipo: 'Produto' | 'Serviço';
    itemId: number;
    quantidade: number;
  };
}

export default class ListaVendas extends Component<{}, State> {
  state: State = {
    clientes: [
      { id: 1, nome: 'Maria Oliveira' },
      { id: 2, nome: 'João Silva' },
      { id: 3, nome: 'Maria Santos' },
      { id: 4, nome: 'Pedro Oliveira' }
    ],
    itensDisponiveis: [
      { id: 1, nome: 'Ração Premium', tipo: 'Produto', preco: 89.90 },
      { id: 2, nome: 'Banho e Tosa', tipo: 'Serviço', preco: 120.00 }
    ],
    vendas: [
      {
        id: 1,
        data: '2025-06-22',
        cliente: 'Maria Oliveira',
        formaPagamento: 'Dinheiro',
        itens: [
          {
            itemId: 1,
            tipo: 'Produto',
            nome: 'Ração Premium',
            quantidade: 2,
            precoUnitario: 89.90
          },
          {
            itemId: 2,
            tipo: 'Serviço',
            nome: 'Banho e Tosa',
            quantidade: 1,
            precoUnitario: 120.00
          }
        ],
        total: 299.80,
        status: 'Concluída'
      },
      {
        id: 2,
        data: '2025-06-23',
        cliente: 'João Silva',
        formaPagamento: 'Cartão',
        itens: [
          {
            itemId: 1,
            tipo: 'Produto',
            nome: 'Ração Premium',
            quantidade: 1,
            precoUnitario: 89.90
          }
        ],
        total: 89.90,
        status: 'Concluída'
      },
      {
        id: 3,
        data: '2025-06-24',
        cliente: 'Maria Santos',
        formaPagamento: 'Pix',
        itens: [
          {
            itemId: 2,
            tipo: 'Serviço',
            nome: 'Banho e Tosa',
            quantidade: 2,
            precoUnitario: 120.00
          }
        ],
        total: 240.00,
        status: 'Concluída'
      },
      {
        id: 4,
        data: '2025-06-25',
        cliente: 'Pedro Oliveira',
        formaPagamento: 'Dinheiro',
        itens: [
          {
            itemId: 1,
            tipo: 'Produto',
            nome: 'Ração Premium',
            quantidade: 3,
            precoUnitario: 89.90
          }
        ],
        total: 269.70,
        status: 'Pendente'
      },
      {
        id: 5,
        data: '2025-06-25',
        cliente: 'Maria Oliveira',
        formaPagamento: 'Cartão',
        itens: [
          {
            itemId: 2,
            tipo: 'Serviço',
            nome: 'Banho e Tosa',
            quantidade: 1,
            precoUnitario: 120.00
          }
        ],
        total: 120.00,
        status: 'Concluída'
      }
    ],
    mostrarFormulario: false,
    indexEdicao: null,
    vendaSelecionada: null,
    novaVenda: {
      clienteId: 0,
      formaPagamento: '',
      itens: [],
      total: 0
    },
    novoItem: {
      tipo: 'Produto',
      itemId: 0,
      quantidade: 1
    }
  };

  handleClienteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState(prev => ({
      novaVenda: { ...prev.novaVenda, clienteId: Number(e.target.value) }
    }));
  };

  handlePagamentoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState(prev => ({
      novaVenda: { ...prev.novaVenda, formaPagamento: e.target.value }
    }));
  };

  handleNovoItemChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    this.setState(prev => ({
      novoItem: {
        ...prev.novoItem,
        [name]: name === 'quantidade' ? Number(value) : value
      }
    }));
  };

  adicionarItem = () => {
    const { novoItem, itensDisponiveis, novaVenda } = this.state;
    // Busca apenas pelo id, não pelo tipo
    const itemInfo = itensDisponiveis.find(i => i.id === Number(novoItem.itemId));
    if (!itemInfo) return;

    const novoItemVenda: ItemVenda = {
      itemId: itemInfo.id,
      nome: itemInfo.nome,
      tipo: itemInfo.tipo,
      quantidade: novoItem.quantidade,
      precoUnitario: itemInfo.preco
    };

    const novosItens = [...novaVenda.itens, novoItemVenda];
    const novoTotal = novosItens.reduce((acc, item) => acc + (item.quantidade * item.precoUnitario), 0);

    this.setState({
      novaVenda: { ...novaVenda, itens: novosItens, total: novoTotal },
      novoItem: { tipo: novoItem.tipo, itemId: 0, quantidade: 1 }
    });
  };

  registrarVenda = () => {
    const { novaVenda, clientes, vendas, indexEdicao } = this.state;
    const cliente = clientes.find(c => c.id === novaVenda.clienteId);
    if (!cliente) return;

    const nova: Venda = {
      id: indexEdicao !== null ? vendas[indexEdicao].id : vendas.length + 1,
      data: new Date().toISOString().slice(0, 10),
      cliente: cliente.nome,
      formaPagamento: novaVenda.formaPagamento,
      itens: novaVenda.itens,
      total: novaVenda.total,
      status: 'Concluída'
    };

    if (indexEdicao !== null) {
      const novasVendas = [...vendas];
      novasVendas[indexEdicao] = nova;
      this.setState({ vendas: novasVendas });
    } else {
      this.setState(prev => ({ vendas: [...prev.vendas, nova] }));
    }

    this.setState({
      mostrarFormulario: false,
      indexEdicao: null,
      vendaSelecionada: null,
      novaVenda: { clienteId: 0, formaPagamento: '', itens: [], total: 0 }
    });
  };

  visualizarVenda = (index: number) => {
    this.setState({ vendaSelecionada: this.state.vendas[index], indexEdicao: index });
  };

  editarVenda = () => {
    const { vendaSelecionada, clientes } = this.state;
    if (!vendaSelecionada) return;

    const cliente = clientes.find(c => c.nome === vendaSelecionada.cliente);
    if (!cliente) return;

    this.setState({
      mostrarFormulario: true,
      novaVenda: {
        clienteId: cliente.id,
        formaPagamento: vendaSelecionada.formaPagamento,
        itens: vendaSelecionada.itens,
        total: vendaSelecionada.total
      },
      indexEdicao: this.state.indexEdicao,
      vendaSelecionada: null
    });
  };

  excluirVenda = (index: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta venda?')) {
      this.setState(prev => {
        const novasVendas = [...prev.vendas];
        novasVendas.splice(index, 1);
        return { vendas: novasVendas, vendaSelecionada: null };
      });
    }
  };

  render() {
    const { vendas, mostrarFormulario, clientes, novaVenda, novoItem, itensDisponiveis, vendaSelecionada } = this.state;

    return (
      <div className="container-fluid min-vh-100 bg-dark text-light py-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="fw-bold mb-0">Lista de Vendas</h3>
            {!mostrarFormulario && (
              <button
                className="btn text-dark fw-semibold"
                style={{ background: '#0dcaf0', border: 'none' }}
                onClick={() => this.setState({ mostrarFormulario: true, indexEdicao: null })}
              >
                <i className="bi bi-plus-circle"></i> Nova Venda
              </button>
            )}
          </div>

          {/* Espaçamento entre o título e a lista */}
          <div className="mb-4"></div>

          {!mostrarFormulario ? (
            <div className="row justify-content-center">
              <div className="col-12 col-lg-10">
                <ul className="list-group mb-4">
                  {vendas.map((v, index) => (
                    <li
                      key={v.id}
                      className="list-group-item bg-white text-dark mb-3 shadow-sm rounded-4 border-0 px-3 py-3 d-flex flex-column flex-md-row align-items-md-center justify-content-between"
                      style={{ transition: 'box-shadow 0.2s' }}
                    >
                      <div className="d-flex flex-column flex-md-row align-items-md-center gap-3 flex-grow-1">
                        <span className="badge bg-info text-dark fs-6 px-3 py-2 mb-2 mb-md-0">
                          #{v.id}
                        </span>
                        <div>
                          <strong className="me-2">Cliente:</strong>
                          {v.cliente}
                        </div>
                        <div>
                          <strong className="me-2">Data:</strong>
                          {new Date(v.data).toLocaleDateString()}
                        </div>
                        <div>
                          <strong className="me-2">Total:</strong>
                          R$ {v.total.toFixed(2)}
                        </div>
                        <div>
                          <span className="badge bg-success">{v.status}</span>
                        </div>
                      </div>
                      <div className="d-flex align-items-center gap-2 mt-3 mt-md-0">
                        <button
                          className="btn btn-outline-dark btn-sm"
                          onClick={() => this.visualizarVenda(index)}
                          title="Ver detalhes"
                        >
                          <i className="bi bi-eye"></i>
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => this.excluirVenda(index)}
                          title="Excluir venda"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="card bg-white text-dark">
              <div className="card-header">
                <h5 className="fw-bold">{this.state.indexEdicao !== null ? 'Editar Venda' : 'Cadastrar Nova Venda'}</h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label">Cliente</label>
                  <select
                    className="form-select"
                    value={novaVenda.clienteId}
                    onChange={this.handleClienteChange}
                    required
                  >
                    <option value={0}>Selecione...</option>
                    {clientes.map(c => (
                      <option key={c.id} value={c.id}>{c.nome}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Forma de Pagamento</label>
                  <select
                    className="form-select"
                    value={novaVenda.formaPagamento}
                    onChange={this.handlePagamentoChange}
                    required
                  >
                    <option value="">Selecione...</option>
                    <option value="Dinheiro">Dinheiro</option>
                    <option value="Cartão">Cartão</option>
                    <option value="Pix">Pix</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Adicionar Item</label>
                  <div className="row g-2">
                    <div className="col-md-3">
                      <select
                        className="form-select"
                        name="tipo"
                        value={novoItem.tipo}
                        onChange={this.handleNovoItemChange}
                      >
                        <option value="Produto">Produto</option>
                        <option value="Serviço">Serviço</option>
                      </select>
                    </div>
                    <div className="col-md-5">
                      <select
                        className="form-select"
                        name="itemId"
                        value={novoItem.itemId}
                        onChange={this.handleNovoItemChange}
                      >
                        <option value={0}>Selecione...</option>
                        {itensDisponiveis.map(item => (
                          <option key={item.id} value={item.id}>
                            {item.nome} ({item.tipo})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-2">
                      <input
                        type="number"
                        className="form-control"
                        name="quantidade"
                        min={1}
                        value={novoItem.quantidade}
                        onChange={this.handleNovoItemChange}
                      />
                    </div>
                    <div className="col-md-2">
                      <button
                        className="btn btn-success w-100"
                        type="button"
                        onClick={this.adicionarItem}
                        disabled={novoItem.itemId === 0}
                      >
                        Adicionar
                      </button>
                    </div>
                  </div>
                </div>
                {novaVenda.itens.length > 0 && (
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Tipo</th>
                        <th>Item</th>
                        <th>Quantidade</th>
                        <th>Preço Unitário</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {novaVenda.itens.map((item, i) => (
                        <tr key={i}>
                          <td>{item.tipo}</td>
                          <td>{item.nome}</td>
                          <td>{item.quantidade}</td>
                          <td>R$ {item.precoUnitario.toFixed(2)}</td>
                          <td>R$ {(item.precoUnitario * item.quantidade).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
                <div className="text-end mb-3">
                  <strong>Total: R$ {novaVenda.total.toFixed(2)}</strong>
                </div>
                <div className="d-flex justify-content-end gap-2">
                  <button
                    className="btn btn-secondary"
                    type="button"
                    onClick={() => this.setState({ mostrarFormulario: false, indexEdicao: null, novaVenda: { clienteId: 0, formaPagamento: '', itens: [], total: 0 } })}
                  >
                    Cancelar
                  </button>
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={this.registrarVenda}
                    disabled={
                      novaVenda.clienteId === 0 ||
                      !novaVenda.formaPagamento ||
                      novaVenda.itens.length === 0
                    }
                  >
                    {this.state.indexEdicao !== null ? 'Salvar Alterações' : 'Cadastrar'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal de Visualizar Venda */}
          {vendaSelecionada && (
            <div className="modal fade show d-block" tabIndex={-1} style={{ background: 'rgba(0,0,0,0.5)' }}>
              <div className="modal-dialog modal-lg">
                <div className="modal-content bg-white text-dark">
                  <div className="modal-header">
                    <h5 className="modal-title">Detalhes da Venda #{vendaSelecionada.id}</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => this.setState({ vendaSelecionada: null })}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <p><strong>Cliente:</strong> {vendaSelecionada.cliente}</p>
                    <p><strong>Data:</strong> {new Date(vendaSelecionada.data).toLocaleDateString()}</p>
                    <p><strong>Forma de Pagamento:</strong> {vendaSelecionada.formaPagamento}</p>
                    <p><strong>Status:</strong> <span className="badge bg-success">{vendaSelecionada.status}</span></p>
                    <hr />
                    <h6>Itens da Venda:</h6>
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th>Tipo</th>
                          <th>Item</th>
                          <th>Quantidade</th>
                          <th>Preço Unitário</th>
                          <th>Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {vendaSelecionada.itens.map((item, i) => (
                          <tr key={i}>
                            <td>{item.tipo}</td>
                            <td>{item.nome}</td>
                            <td>{item.quantidade}</td>
                            <td>R$ {item.precoUnitario.toFixed(2)}</td>
                            <td>R$ {(item.precoUnitario * item.quantidade).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="text-end">
                      <strong>Total: R$ {vendaSelecionada.total.toFixed(2)}</strong>
                    </div>
                  </div>
                  <div className="modal-footer bg-white">
                    <button
                      className="btn btn-secondary"
                      onClick={() => this.setState({ vendaSelecionada: null })}
                    >
                      Fechar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    );
  }
}
