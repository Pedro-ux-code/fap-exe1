import React, { useState, useEffect } from 'react';

// Componente de saudação
const Saudacao = () => {
  return <h1 className="text-2xl font-bold text-blue-600 mb-6">Bem-vindo à aplicação front-end</h1>;
};

// Simulação do Axios (já que não temos acesso real à API)
const api = {
  // GET - buscar todos os usuários
  get: async (url) => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simula delay da API
    return {
      data: [
        { id: 1, nome: 'João Silva', email: 'joao@email.com' },
        { id: 2, nome: 'Maria Santos', email: 'maria@email.com' }
      ]
    };
  },
  // POST - criar novo usuário
  post: async (url, data) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: { ...data, id: Date.now() } // Gera ID único baseado no timestamp
    };
  },
  // PUT - atualizar usuário existente
  put: async (url, data) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { data };
  },
  // DELETE - excluir usuário
  delete: async (url) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { data: { success: true } };
  }
};

const App = () => {
  // Estado para armazenar lista de usuários
  const [usuarios, setUsuarios] = useState([]);
  // Estado para controlar loading das requisições
  const [loading, setLoading] = useState(false);
  // Estado para armazenar dados do formulário
  const [formData, setFormData] = useState({ nome: '', email: '' });
  // Estado para controlar se está editando (armazena ID do usuário em edição)
  const [editandoId, setEditandoId] = useState(null);

  // Função para buscar usuários da API - executada ao carregar o componente
  const buscarUsuarios = async () => {
    setLoading(true);
    try {
      const response = await api.get('/usuarios');
      setUsuarios(response.data); // Atualiza lista de usuários
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    }
    setLoading(false);
  };

  // Hook useEffect - executa buscarUsuarios quando componente é montado
  useEffect(() => {
    buscarUsuarios();
  }, []);

  // Função para lidar com mudanças nos campos do formulário
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value }); // Atualiza apenas o campo alterado
  };

  // Função para cadastrar novo usuário
  const cadastrarUsuario = async () => {
    if (!formData.nome || !formData.email) return; // Validação básica
    
    setLoading(true);
    try {
      const response = await api.post('/usuarios', formData);
      setUsuarios([...usuarios, response.data]); // Adiciona novo usuário à lista
      setFormData({ nome: '', email: '' }); // Limpa formulário
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error);
    }
    setLoading(false);
  };

  // Função para iniciar edição - preenche formulário com dados do usuário
  const iniciarEdicao = (usuario) => {
    setFormData({ nome: usuario.nome, email: usuario.email });
    setEditandoId(usuario.id); // Marca que está editando este usuário
  };

  // Função para atualizar usuário existente
  const atualizarUsuario = async () => {
    if (!formData.nome || !formData.email) return;
    
    setLoading(true);
    try {
      const response = await api.put(`/usuarios/${editandoId}`, formData);
      // Atualiza o usuário na lista
      setUsuarios(usuarios.map(user => 
        user.id === editandoId ? { ...response.data, id: editandoId } : user
      ));
      setFormData({ nome: '', email: '' }); // Limpa formulário
      setEditandoId(null); // Sai do modo edição
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
    }
    setLoading(false);
  };

  // Função para cancelar edição
  const cancelarEdicao = () => {
    setFormData({ nome: '', email: '' });
    setEditandoId(null);
  };

  // Função simples e direta para remover usuário
  const removerUsuario = (idParaRemover) => {
    console.log('=== INICIANDO REMOÇÃO ===');
    console.log('ID para remover:', idParaRemover, 'Tipo:', typeof idParaRemover);
    console.log('Lista ANTES da remoção:');
    console.table(usuarios);
    
    const novaLista = usuarios.filter(u => {
      const mantem = u.id !== idParaRemover;
      console.log(`Usuário ${u.id} (${u.nome}) - Manter: ${mantem}`);
      return mantem;
    });
    
    console.log('Lista DEPOIS do filtro:');
    console.table(novaLista);
    console.log('Chamando setUsuarios...');
    
    setUsuarios(novaLista);
    
    console.log('setUsuarios chamado. Lista deveria ter mudado!');
    console.log('=== FIM DA REMOÇÃO ===');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Componente de saudação */}
      <Saudacao />
      
      {/* DEBUG: Mostrar quantidade de usuários */}
      <div className="bg-blue-100 p-2 mb-4 rounded">
        <p className="text-sm text-blue-800">Total de usuários: {usuarios.length}</p>
      </div>
      
      {/* Formulário para cadastro/edição */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">
          {editandoId ? 'Editar Usuário' : 'Cadastrar Usuário'}
        </h2>
        
        <div className="space-y-4">
          {/* Campo nome */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome:</label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          {/* Campo email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          {/* Botões de ação */}
          <div className="flex gap-2">
            <button
              onClick={editandoId ? atualizarUsuario : cadastrarUsuario}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Processando...' : (editandoId ? 'Atualizar' : 'Cadastrar')}
            </button>
            
            {/* Botão cancelar (só aparece durante edição) */}
            {editandoId && (
              <button
                onClick={cancelarEdicao}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Cancelar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Lista de usuários */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Lista de Usuários</h2>
        
        {loading && <p className="text-gray-500">Carregando...</p>}
        
        {usuarios.length === 0 && !loading ? (
          <p className="text-gray-500">Nenhum usuário encontrado.</p>
        ) : (
          <ul className="space-y-3">
            {usuarios.map(usuario => (
              <li key={usuario.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                {/* Informações do usuário */}
                <div>
                  <strong className="text-gray-800">{usuario.nome}</strong>
                  <span className="text-gray-600 ml-2">({usuario.email})</span>
                  <span className="text-xs text-gray-400 ml-2 bg-gray-100 px-2 py-1 rounded">ID: {usuario.id}</span>
                </div>
                
                {/* Botões de ação */}
                <div className="flex gap-2">
                  <div
                    onClick={() => iniciarEdicao(usuario)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm cursor-pointer"
                  >
                    Editar
                  </div>
                  <div
                    onClick={() => {
                      console.log('CLIQUE DETECTADO no div excluir!');
                      console.log('Usuario ID:', usuario.id);
                      if (window.confirm(`Excluir ${usuario.nome}?`)) {
                        console.log('Confirmou - chamando removerUsuario');
                        removerUsuario(usuario.id);
                      }
                    }}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm cursor-pointer"
                  >
                    🗑️ Excluir
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
        
        {/* DEBUG: Botão para testar exclusão */}
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-sm text-yellow-800 mb-2">🔧 TESTE: Clique para remover o primeiro usuário:</p>
          <button
            onClick={() => {
              if (usuarios.length > 0) {
                removerUsuario(usuarios[0].id);
              } else {
                alert('Não há usuários para remover!');
              }
            }}
            className="px-3 py-1 bg-red-600 text-white rounded text-sm"
          >
            Teste Exclusão
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
