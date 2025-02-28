// Função responsável por validar condições de senha
export default function validatePassword(password){
    if (password && password.length < 8) {
      return 'A senha deve ter no mínimo 8 caracteres.'
    }
    return null
  }