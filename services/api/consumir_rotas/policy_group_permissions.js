const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

/**
 * Função para adicionar uma permissão a um grupo de política.
 * @param {Object} relacao - Dados do relacionamento a ser criado.
 * @param {string} relacao.grupo_politica_nome - Nome do grupo de política.
 * @param {string} relacao.permissao_namespace - Namespace da permissão.
 * @param {string} token - Token de autenticação do usuário.
 * @returns {Promise<Object>} - Retorna o relacionamento criado.
 */
export async function adicionarPermissaoAoGrupo(relacao, token) {
    const url = `${API_BASE_URL}/grupo_politica_permissoes/`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(relacao),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Erro ao adicionar permissão ao grupo.');
        }

        return await response.json();
    } catch (error) {
        console.error('Erro ao adicionar permissão ao grupo:', error);
        throw error;
    }
}

/**
 * Função para listar todos os relacionamentos entre grupos de política e permissões.
 * @param {string} token - Token de autenticação do usuário.
 * @returns {Promise<Array>} - Retorna a lista de relacionamentos.
 */
export async function listarPermissoesGrupo(token) {
    const url = `${API_BASE_URL}/grupo_politica_permissoes/`;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Erro ao listar permissões do grupo.');
        }

        return await response.json();
    } catch (error) {
        console.error('Erro ao listar permissões do grupo:', error);
        throw error;
    }
}

/**
 * Função para remover uma permissão de um grupo de política.
 * @param {string} grupo_politica_nome - Nome do grupo de política.
 * @param {string} permissao_namespace - Namespace da permissão.
 * @param {string} token - Token de autenticação do usuário.
 * @returns {Promise<void>}
 */
export async function removerPermissaoDoGrupo(grupo_politica_nome, permissao_namespace, token) {
    const url = `${API_BASE_URL}/grupo_politica_permissoes/?grupo_politica_nome=${grupo_politica_nome}&permissao_namespace=${permissao_namespace}`;
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Erro ao remover permissão do grupo.');
        }
    } catch (error) {
        console.error('Erro ao remover permissão do grupo:', error);
        throw error;
    }
}