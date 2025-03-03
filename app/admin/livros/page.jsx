'use client'
import React, { useState, useEffect, useContext, useRef } from 'react'
import { AuthContext } from '@/contexts/AuthContext'
import { 
  getBooks,
  criarLivro,
  atualizarLivro,
  deletarLivro
} from '@/services/api/consumir_rotas/books'
import { uploadBookCover } from '@/services/api/consumir_rotas/files'
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { Add, Edit, Delete, PhotoCamera } from '@mui/icons-material'

const AdminBooksPage = () => {
  const { user } = useContext(AuthContext)
  
  // Estados existentes
  const [books, setBooks] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(100)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [openCreateDialog, setOpenCreateDialog] = useState(false)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [selectedBook, setSelectedBook] = useState(null)
  const [bookForm, setBookForm] = useState({
    titulo: '',
    autor: '',
    genero: '',
    ano_publicacao: '',
    quantidade_disponivel: '',
    isbn: '',
    image_url: '',
    numero_paginas: '',
    editora: ''
  })

  // Estados e ref para upload de imagem
  const fileInputRef = useRef(null)
  const [selectedBookForUpload, setSelectedBookForUpload] = useState(null)

  const getToken = () => localStorage.getItem('token')

  const fetchBooks = async () => {
    setLoading(true)
    setError(null)
    try {
      const skip = page * pageSize
      const limit = pageSize
      const data = await getBooks({ skip, limit })
      setBooks(data.livros)
      setTotal(data.total)
    } catch (err) {
      setError(err.message || 'Erro ao buscar livros.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBooks()
  }, [page, pageSize])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setBookForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleOpenCreateDialog = () => {
    setBookForm({
      titulo: '',
      autor: '',
      genero: '',
      ano_publicacao: '',
      quantidade_disponivel: '',
      isbn: '',
      image_url: '',
      numero_paginas: '',
      editora: ''
    })
    setOpenCreateDialog(true)
  }

  const handleCreateBook = async () => {
    const token = getToken()
    if (!token) {
      setError('Token não encontrado. Usuário não autenticado.')
      return
    }
    try {
      setLoading(true)
      const novoLivro = await criarLivro(bookForm, token)
      setBooks((prev) => [...prev, novoLivro])
      setOpenCreateDialog(false)
    } catch (err) {
      setError(String(err))
    } finally {
      setLoading(false)
    }
  }

  const handleOpenEditDialog = (book) => {
    setSelectedBook(book)
    setBookForm({
      titulo: book.titulo || '',
      autor: book.autor || '',
      genero: book.genero || '',
      ano_publicacao: book.ano_publicacao?.toString() || '',
      quantidade_disponivel: book.quantidade_disponivel?.toString() || '',
      isbn: book.isbn || '',
      image_url: book.image_url || '',
      numero_paginas: book.numero_paginas?.toString() || '',
      editora: book.editora || ''
    })
    setOpenEditDialog(true)
  }

  const handleUpdateBook = async () => {
    const token = getToken()
    if (!token || !selectedBook) {
      setError('Token não encontrado ou nenhum livro selecionado.')
      return
    }
    try {
      setLoading(true)
      const livroAtualizado = await atualizarLivro(selectedBook.id, bookForm, token)
      setBooks((prev) => prev.map((b) => (b.id === selectedBook.id ? livroAtualizado : b)))
      setOpenEditDialog(false)
      setSelectedBook(null)
    } catch (err) {
      setError(String(err))
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteBook = async (bookId) => {
    const token = getToken()
    if (!token) {
      setError('Token não encontrado. Usuário não autenticado.')
      return
    }
    try {
      setLoading(true)
      await deletarLivro(bookId, token)
      setBooks((prev) => prev.filter((b) => b.id !== bookId))
    } catch (err) {
      setError(String(err))
    } finally {
      setLoading(false)
    }
  }

  // Função para abrir o upload da imagem
  const handleOpenUpload = (bookId) => {
    setSelectedBookForUpload(bookId)
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  // Função que lida com a seleção do arquivo e chama a função de upload
  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file || !selectedBookForUpload) return
    try {
      setLoading(true)
      const token = getToken() // Certifique-se de que esta função retorne o token JWT válido
      const data = await uploadBookCover(selectedBookForUpload, file, token)
      // Atualiza a imagem do livro na lista
      setBooks((prev) =>
        prev.map((b) => (b.id === selectedBookForUpload ? { ...b, image_url: data.image_url } : b))
      )
    } catch (err) {
      setError('Erro ao enviar a imagem da capa do livro.')
    } finally {
      setLoading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      setSelectedBookForUpload(null)
    }
  }
  
  // Definição das colunas do DataGrid (coluna "actions" atualizada)
  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'titulo', headerName: 'Título', width: 200 },
    { field: 'autor', headerName: 'Autor', width: 150 },
    { field: 'genero', headerName: 'Gênero', width: 120 },
    { field: 'ano_publicacao', headerName: 'Ano', width: 90 },
    { field: 'quantidade_disponivel', headerName: 'Qtd', width: 80 },
    {
      field: 'actions',
      headerName: 'Ações',
      width: 200,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton onClick={() => handleOpenEditDialog(params.row)}>
            <Edit />
          </IconButton>
          <IconButton color="error" onClick={() => handleDeleteBook(params.row.id)}>
            <Delete />
          </IconButton>
          <IconButton color="primary" onClick={() => handleOpenUpload(params.row.id)}>
            <PhotoCamera />
          </IconButton>
        </Box>
      )
    }
  ]

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Administração de Livros
      </Typography>

      <Button variant="contained" startIcon={<Add />} onClick={handleOpenCreateDialog}>
        Adicionar Livro
      </Button>

      {loading && <Typography sx={{ mt: 2 }}>Carregando...</Typography>}
      {error && <Typography color="error" sx={{ mt: 2 }}>{String(error)}</Typography>}

      <Box sx={{ height: 500, width: '100%', mt: 2 }}>
        <DataGrid
          rows={books}
          columns={columns}
          pagination
          paginationMode="server"
          rowCount={total}
          page={page}
          pageSize={pageSize}
          onPageChange={(newPage) => setPage(newPage)}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          rowsPerPageOptions={[5, 10, 25, 50]}
          loading={loading}
          disableSelectionOnClick
          getRowId={(row) => row.id}
        />
      </Box>

      {/* Input file oculto para upload da imagem */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
        accept="image/*"
      />

      {/* Diálogo para criar livro */}
      <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)}>
        <DialogTitle>Adicionar Livro</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField label="Título" name="titulo" value={bookForm.titulo} onChange={handleInputChange} />
          <TextField label="Autor" name="autor" value={bookForm.autor} onChange={handleInputChange} />
          <TextField label="Gênero" name="genero" value={bookForm.genero} onChange={handleInputChange} />
          <TextField label="Ano Publicação" name="ano_publicacao" value={bookForm.ano_publicacao} onChange={handleInputChange} />
          <TextField label="Quantidade Disponível" name="quantidade_disponivel" value={bookForm.quantidade_disponivel} onChange={handleInputChange} />
          <TextField label="ISBN" name="isbn" value={bookForm.isbn} onChange={handleInputChange} />
          <TextField label="URL da Imagem" name="image_url" value={bookForm.image_url} onChange={handleInputChange} />
          <TextField
            label="Número de Páginas"
            name="numero_paginas"
            type="number"
            value={bookForm.numero_paginas}
            onChange={handleInputChange}
          />
          <TextField
            label="Editora"
            name="editora"
            value={bookForm.editora}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateDialog(false)}>Cancelar</Button>
          <Button onClick={handleCreateBook} variant="contained">Salvar</Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para editar livro */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Editar Livro</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField label="Título" name="titulo" value={bookForm.titulo} onChange={handleInputChange} />
          <TextField label="Autor" name="autor" value={bookForm.autor} onChange={handleInputChange} />
          <TextField label="Gênero" name="genero" value={bookForm.genero} onChange={handleInputChange} />
          <TextField label="Ano Publicação" name="ano_publicacao" value={bookForm.ano_publicacao} onChange={handleInputChange} />
          <TextField label="Quantidade Disponível" name="quantidade_disponivel" value={bookForm.quantidade_disponivel} onChange={handleInputChange} />
          <TextField label="ISBN" name="isbn" value={bookForm.isbn} onChange={handleInputChange} />
          <TextField label="URL da Imagem" name="image_url" value={bookForm.image_url} onChange={handleInputChange} />
          <TextField
            label="Número de Páginas"
            name="numero_paginas"
            type="number"
            value={bookForm.numero_paginas}
            onChange={handleInputChange}
          />
          <TextField
            label="Editora"
            name="editora"
            value={bookForm.editora}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancelar</Button>
          <Button onClick={handleUpdateBook} variant="contained">Salvar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default AdminBooksPage
