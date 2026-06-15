const axios = require('axios');

// Busca uma imagem no Unsplash a partir de uma palavra-chave (ex: nome do
// hotel + cidade). Usada como fallback quando a API de hotéis não retorna
// uma foto própria para o estabelecimento.
const searchImage = async (query) => {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;

  if (!accessKey) {
    return null;
  }

  try {
    const { data } = await axios.get('https://api.unsplash.com/search/photos', {
      params: { query, per_page: 1, orientation: 'landscape' },
      headers: { Authorization: `Client-ID ${accessKey}` },
      timeout: 5000,
    });

    const photo = data?.results?.[0];
    return photo?.urls?.regular || null;
  } catch (error) {
    console.error('Erro ao buscar imagem no Unsplash:', error.message);
    return null;
  }
};

module.exports = { searchImage };
