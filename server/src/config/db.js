const dns = require('dns');
const mongoose = require('mongoose');

// O resolvedor de DNS padrão do Windows às vezes falha ao consultar o registro
// SRV usado pela connection string "mongodb+srv://" do Atlas (ECONNREFUSED em
// querySrv). Usar um DNS público resolve isso sem afetar a conexão em si.
dns.setServers(['1.1.1.1', '8.8.8.8']);

// Não derruba o servidor se o MongoDB não estiver disponível: as rotas de
// hotéis funcionam com dados mock mesmo sem banco. Auth/reservas exigem
// MongoDB e retornarão erro até que MONGO_URI esteja configurado e acessível.
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Aviso: não foi possível conectar ao MongoDB (${error.message}).`);
    console.error('O servidor continuará rodando, mas login/cadastro/reservas não funcionarão até o MongoDB estar disponível.');
  }
};

module.exports = connectDB;
