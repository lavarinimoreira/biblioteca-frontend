const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

/**
 * Função para criar um novo grupo de política.
 * @param {Object} grupo - Dados do grupo a ser criado.
 * @param {string} grupo.nome - Nome do grupo.
 * @param {string} token - Token de autenticação do usuário.
 * @returns {Promise<Object>} - Retorna o grupo criado.
 */
export async function criarGrupoPolitica(grupo, token) {
    const url = `${API_BASE_URL}/grupos_politica/`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(grupo),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Erro ao criar grupo de política.');
        }

        return await response.json();
    } catch (error) {
        console.error('Erro ao criar grupo de política:', error);
        throw error;
    }
}

/**
 * Função para listar todos os grupos de política.
 * @param {string} token - Token de autenticação do usuário.
 * @returns {Promise<Array>} - Retorna a lista de grupos de política.
 */
export async function listarGruposPolitica(token) {
    const url = `${API_BASE_URL}/grupos_politica/`;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Erro ao listar grupos de política.');
        }

        return await response.json();
    } catch (error) {
        console.error('Erro ao listar grupos de política:', error);
        throw error;
    }
}

/**
 * Função para obter um grupo de política por ID.
 * @param {number} grupoId - ID do grupo de política.
 * @param {string} token - Token de autenticação do usuário.
 * @returns {Promise<Object>} - Retorna o grupo de política.
 */
export async function obterGrupoPolitica(grupoId, token) {
    const url = `${API_BASE_URL}/grupos_politica/${grupoId}`;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Erro ao obter grupo de política.');
        }

        return await response.json();
    } catch (error) {
        console.error('Erro ao obter grupo de política:', error);
        throw error;
    }
}

/**
 * Função para atualizar um grupo de política.
 * @param {number} grupoId - ID do grupo de política.
 * @param {Object} grupoUpdate - Dados atualizados do grupo.
 * @param {string} grupoUpdate.nome - Novo nome do grupo.
 * @param {string} token - Token de autenticação do usuário.
 * @returns {Promise<Object>} - Retorna o grupo atualizado.
 */
export async function atualizarGrupoPolitica(grupoId, grupoUpdate, token) {
    const url = `${API_BASE_URL}/grupos_politica/update/${grupoId}`;
    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(grupoUpdate),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Erro ao atualizar grupo de política.');
        }

        return await response.json();
    } catch (error) {
        console.error('Erro ao atualizar grupo de política:', error);
        throw error;
    }
}

/**
 * Função para deletar um grupo de política.
 * @param {number} grupoId - ID do grupo de política.
 * @param {string} token - Token de autenticação do usuário.
 * @returns {Promise<void>}
 */
export async function deletarGrupoPolitica(grupoId, token) {
    const url = `${API_BASE_URL}/grupos_politica/${grupoId}`;
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Erro ao deletar grupo de política.');
        }
    } catch (error) {
        console.error('Erro ao deletar grupo de política:', error);
        throw error;
    }
}