// Gera datas padrão de check-in/check-out (7 e 9 dias a partir de hoje) no
// formato YYYY-MM-DD, usadas quando o usuário não informa datas na busca.
const getDefaultDates = () => {
  const toISODate = (date) => date.toISOString().split('T')[0];

  const checkIn = new Date();
  checkIn.setDate(checkIn.getDate() + 7);

  const checkOut = new Date();
  checkOut.setDate(checkOut.getDate() + 9);

  return { checkIn: toISODate(checkIn), checkOut: toISODate(checkOut) };
};

module.exports = { getDefaultDates };
