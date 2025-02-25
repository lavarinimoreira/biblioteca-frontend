// Função responsável por substituir a url salva no docker pela url a ser utilizada pela aplicação front-end

export default function adaptImageUrl(url) {
    if (!url) return url; // Ou retorne uma URL padrão...
    return url.replace(/^http:\/\/images_service:8000/, 'http://localhost:8001');
}
  