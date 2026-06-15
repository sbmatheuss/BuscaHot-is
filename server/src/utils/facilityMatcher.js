// Filtros suportados pelo site e palavras-chave usadas para identificá-los
// nas comodidades retornadas pela API real (RapidAPI - Booking.com), que
// normalmente vêm como uma lista de nomes em texto livre (ex: "Piscina ao ar livre").
const FILTER_KEYWORDS = {
  pool: ['pool', 'piscina'],
  parking: ['parking', 'estacionamento', 'garagem'],
  ac: ['air conditioning', 'ar-condicionado', 'ar condicionado'],
  wifi: ['wifi', 'wi-fi', 'internet'],
  breakfast: ['breakfast', 'café da manhã', 'cafe da manha'],
  gym: ['gym', 'fitness', 'academia'],
  petFriendly: ['pet', 'animais de estimação', 'animais de estimacao'],
};

// Converte uma lista de strings de comodidades (formato da API real) para o
// objeto normalizado { pool, parking, ac, wifi, breakfast, gym, petFriendly }
// usado em todo o backend.
const normalizeFacilitiesFromList = (facilityNames = []) => {
  const lowerNames = facilityNames.map((name) => String(name).toLowerCase());

  const facilities = {};
  for (const [key, keywords] of Object.entries(FILTER_KEYWORDS)) {
    facilities[key] = lowerNames.some((name) =>
      keywords.some((keyword) => name.includes(keyword))
    );
  }
  return facilities;
};

// Verifica se um hotel (com `facilities` já normalizado) atende aos filtros
// ativos enviados pelo front-end. Filtros não marcados (false/undefined) são
// ignorados.
const matchesFilters = (facilities = {}, activeFilters = {}) => {
  return Object.entries(activeFilters).every(([key, isActive]) => {
    if (!isActive) return true;
    return Boolean(facilities[key]);
  });
};

module.exports = { normalizeFacilitiesFromList, matchesFilters, FILTER_KEYWORDS };
