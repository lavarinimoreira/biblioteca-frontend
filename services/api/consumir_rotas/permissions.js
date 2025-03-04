const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

/**
 * Função para criar uma nova permissão.
 * @param {Object} permissao - Dados da permissão a ser criada.
 * @param {string} permissao.nome - Nome da permissão.
 * @param {string} permissao.descricao - Descrição da permissão.
 * @param {string} permissao.namespace - Namespace da permissão.
 * @param {string} token - Token de autenticação do usuário.
 * @returns {Promise<Object>} - Retorna a permissão criada.
 */
export async function criarPermissao(permissao, token) {
    const url = `${API_BASE_URL}/permissoes/`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(permissao),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Erro ao criar permissão.');
        }

        return await response.json();
    } catch (error) {
        console.error('Erro ao criar permissão:', error);
        throw error;
    }
}

/**
 * Função para listar todas as permissões.
 * @param {string} token - Token de autenticação do usuário.
 * @returns {Promise<Array>} - Retorna a lista de permissões.
 */
export async function listarPermissoes(token) {
    const url = `${API_BASE_URL}/permissoes/`;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Erro ao listar permissões.');
        }

        return await response.json();
    } catch (error) {
        console.error('Erro ao listar permissões:', error);
        throw error;
    }
}

/**
 * Função para obter uma permissão por ID.
 * @param {number} permissaoId - ID da permissão.
 * @param {string} token - Token de autenticação do usuário.
 * @returns {Promise<Object>} - Retorna a permissão.
 */
export async function obterPermissao(permissaoId, token) {
    const url = `${API_BASE_URL}/permissoes/${permissaoId}`;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Erro ao obter permissão.');
        }

        return await response.json();
    } catch (error) {
        console.error('Erro ao obter permissão:', error);
        throw error;
    }
}

/**
 * Função para atualizar uma permissão.
 * @param {number} permissaoId - ID da permissão.
 * @param {Object} permissaoUpdate - Dados atualizados da permissão.
 * @param {string} permissaoUpdate.nome - Novo nome da permissão.
 * @param {string} permissaoUpdate.descricao - Nova descrição da permissão.
 * @param {string} permissaoUpdate.namespace - Novo namespace da permissão.
 * @param {string} token - Token de autenticação do usuário.
 * @returns {Promise<Object>} - Retorna a permissão atualizada.
 */
export async function atualizarPermissao(permissaoId, permissaoUpdate, token) {
    const url = `${API_BASE_URL}/permissoes/${permissaoId}`;
    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(permissaoUpdate),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Erro ao atualizar permissão.');
        }

        return await response.json();
    } catch (error) {
        console.error('Erro ao atualizar permissão:', error);
        throw error;
    }
}

/**
 * Função para deletar uma permissão.
 * @param {number} permissaoId - ID da permissão.
 * @param {string} token - Token de autenticação do usuário.
 * @returns {Promise<void>}
 */
export async function deletarPermissao(permissaoId, token) {
    const url = `${API_BASE_URL}/permissoes/${permissaoId}`;
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Erro ao deletar permissão.');
        }
    } catch (error) {
        console.error('Erro ao deletar permissão:', error);
        throw error;
    }
}