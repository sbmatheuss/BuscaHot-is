const axios = require('axios');
const mockHotels = require('../data/mockHotels');
const { normalizeFacilitiesFromList } = require('../utils/facilityMatcher');
const { searchImage } = require('./imageService');

const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST || 'booking-com15.p.rapidapi.com';

// Destinos populares usados para montar a seção "recomendados" da home
// quando nenhum destino é informado.
const POPULAR_DESTINATIONS = ['Rio de Janeiro', 'São Paulo', 'Florianópolis'];

// Retorna um client axios pré-configurado para a RapidAPI (Booking.com), ou
// `null` se RAPIDAPI_KEY não estiver definida - nesse caso o serviço usa o
// dataset mock local automaticamente.
const getClient = () => {
  const apiKey = process.env.RAPIDAPI_KEY;
  if (!apiKey) return null;

  return axios.create({
    baseURL: `https://${RAPIDAPI_HOST}`,
    headers: {
      'X-RapidAPI-Key': apiKey,
      'X-RapidAPI-Host': RAPIDAPI_HOST,
    },
    timeout: 8000,
  });
};

// Resolve o nome de um destino (cidade) para o dest_id exigido pela busca de
// hotéis da RapidAPI.
const resolveDestination = async (client, query) => {
  try {
    const { data } = await client.get('/api/v1/hotels/searchDestination', {
      params: { query },
    });
    const first = data?.data?.[0];
    if (!first) return null;
    return { destId: first.dest_id, searchType: first.search_type || first.dest_type || 'CITY' };
  } catch (error) {
    console.error('Erro ao buscar destino na RapidAPI:', error.message);
    return null;
  }
};

// Converte um item da resposta de busca da RapidAPI para o formato comum
// { id, name, city, address, price, currency, rating, reviewCount, image, images, description, facilities }
const normalizeSearchHotel = (raw) => {
  const property = raw.property || raw;
  const grossPrice = property.priceBreakdown?.grossPrice;

  const facilityNames = (raw.hotel_facilities || property.facilities || [])
    .map((f) => (typeof f === 'string' ? f : f?.name))
    .filter(Boolean);

  return {
    id: String(raw.hotel_id ?? raw.id ?? ''),
    name: property.name || raw.name || 'Hotel sem nome',
    city: property.wishlistName || property.city || '',
    address: property.address || '',
    price: grossPrice?.value != null ? Math.round(grossPrice.value) : null,
    currency: grossPrice?.currency || 'BRL',
    rating: property.reviewScore ? Number(property.reviewScore) : null,
    reviewCount: property.reviewCount || 0,
    image: property.photoUrls?.[0] || null,
    images: property.photoUrls || [],
    description: '',
    facilities: normalizeFacilitiesFromList(facilityNames),
  };
};

// Remove acentos para permitir buscas como "Florianopolis" encontrarem "Florianópolis".
const normalizeText = (text) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');

// Filtra/ordena o dataset mock simulando os parâmetros de busca da API real.
const searchMockHotels = ({ destination, sortBy }) => {
  let results = [...mockHotels];

  if (destination) {
    const term = normalizeText(destination);
    const filtered = results.filter((h) => normalizeText(h.city).includes(term));
    if (filtered.length) results = filtered;
  }

  if (sortBy === 'rating') {
    results.sort((a, b) => b.rating - a.rating);
  } else {
    results.sort((a, b) => a.price - b.price);
  }

  return results;
};

// Busca hotéis por destino. Tenta a RapidAPI (Booking.com) primeiro; se a
// chave não estiver configurada, o destino não for resolvido ou a chamada
// falhar/retornar vazio, cai no dataset mock local.
const searchHotels = async ({ destination, checkIn, checkOut, adults = 1, sortBy = 'price' }) => {
  const client = getClient();
  if (!client) {
    return searchMockHotels({ destination, sortBy });
  }

  try {
    const dest = destination ? await resolveDestination(client, destination) : null;
    if (!dest) return searchMockHotels({ destination, sortBy });

    const { data } = await client.get('/api/v1/hotels/searchHotels', {
      params: {
        dest_id: dest.destId,
        search_type: dest.searchType,
        arrival_date: checkIn,
        departure_date: checkOut,
        adults,
        room_qty: 1,
        page_number: 1,
        currency_code: 'BRL',
        languagecode: 'pt-br',
        order_by: sortBy === 'rating' ? 'review_score' : 'price',
      },
    });

    const hotels = data?.data?.hotels || [];
    if (!hotels.length) return searchMockHotels({ destination, sortBy });

    return await Promise.all(
      hotels.map(async (raw) => {
        const hotel = normalizeSearchHotel(raw);
        if (!hotel.image) {
          hotel.image = await searchImage(`${hotel.name} ${destination} hotel`);
        }
        return hotel;
      })
    );
  } catch (error) {
    console.error('Erro ao buscar hotéis na RapidAPI:', error.message);
    return searchMockHotels({ destination, sortBy });
  }
};

// Retorna os detalhes completos de um hotel pelo id.
const getHotelById = async (id, { checkIn, checkOut } = {}) => {
  if (id.startsWith('mock-')) {
    return mockHotels.find((h) => h.id === id) || null;
  }

  const client = getClient();
  if (!client) return null;

  try {
    const { data } = await client.get('/api/v1/hotels/getHotelDetails', {
      params: {
        hotel_id: id,
        arrival_date: checkIn,
        departure_date: checkOut,
        currency_code: 'BRL',
        languagecode: 'pt-br',
      },
    });

    const hotel = data?.data;
    if (!hotel) return null;

    const facilityNames = (hotel.facilities_block?.facilities || [])
      .map((f) => f?.name)
      .filter(Boolean);

    const grossPrice =
      hotel.product_price_breakdown?.gross_amount ?? hotel.composite_price_breakdown?.gross_amount;

    const images = hotel.photoUrls || hotel.photos?.map((p) => p?.url_max || p?.url_original) || [];

    const mainImage = images[0] || (await searchImage(`${hotel.hotel_name || hotel.name} hotel`)) || null;

    return {
      id: String(hotel.hotel_id ?? id),
      name: hotel.hotel_name || hotel.name || 'Hotel',
      city: hotel.city || '',
      address: hotel.address || '',
      price: grossPrice?.value != null ? Math.round(grossPrice.value) : null,
      currency: grossPrice?.currency || 'BRL',
      rating: hotel.review_score ? Number(hotel.review_score) : null,
      reviewCount: hotel.review_nr || 0,
      image: mainImage,
      images: images.length ? images : mainImage ? [mainImage] : [],
      description: hotel.hotel_description || hotel.description || '',
      facilities: normalizeFacilitiesFromList(facilityNames),
    };
  } catch (error) {
    console.error('Erro ao buscar detalhes do hotel na RapidAPI:', error.message);
    return null;
  }
};

// Retorna os hotéis recomendados para a home: bem avaliados (nota >= 8.5) em
// destinos populares, ordenados por avaliação.
const getFeaturedHotels = async ({ checkIn, checkOut, adults = 1 } = {}) => {
  const client = getClient();

  if (!client) {
    return [...mockHotels]
      .filter((h) => h.rating >= 8.5)
      .sort((a, b) => b.rating - a.rating || a.price - b.price)
      .slice(0, 6);
  }

  try {
    const results = await Promise.all(
      POPULAR_DESTINATIONS.map((dest) =>
        searchHotels({ destination: dest, checkIn, checkOut, adults, sortBy: 'rating' })
      )
    );

    const merged = results.flat().filter((h) => h.rating && h.rating >= 8.5);
    merged.sort((a, b) => b.rating - a.rating);

    if (!merged.length) {
      return [...mockHotels].filter((h) => h.rating >= 8.5).slice(0, 6);
    }

    return merged.slice(0, 6);
  } catch (error) {
    console.error('Erro ao buscar hotéis recomendados:', error.message);
    return [...mockHotels].filter((h) => h.rating >= 8.5).slice(0, 6);
  }
};

module.exports = { searchHotels, getHotelById, getFeaturedHotels };
