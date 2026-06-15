# BuscaHotéis

Plataforma para busca e reserva de hotéis econômicos, com filtros por comodidades
(piscina, estacionamento, ar-condicionado, Wi-Fi, café da manhã), seção de hotéis
recomendados/melhor avaliados, imagens dos hotéis e autenticação com JWT.

## Estrutura do projeto

```
BuscaHotéis/
├── server/   # API REST em Node.js + Express + MongoDB
└── client/   # Site em Next.js (App Router) + TypeScript + Tailwind CSS
```

## Pré-requisitos

- Node.js 18+
- MongoDB (local ou [MongoDB Atlas](https://www.mongodb.com/atlas))

## Configuração do backend (`server/`)

1. Instale as dependências:
   ```bash
   cd server
   npm install
   ```
2. Copie `.env.example` para `.env` e ajuste as variáveis:
   ```bash
   cp .env.example .env
   ```

   | Variável | Descrição |
   | --- | --- |
   | `PORT` | Porta da API (padrão `5000`) |
   | `MONGO_URI` | String de conexão do MongoDB |
   | `JWT_SECRET` | Segredo usado para assinar os tokens JWT |
   | `JWT_EXPIRES_IN` | Validade do token (ex: `7d`) |
   | `RAPIDAPI_KEY` | Chave da API "Booking.com" no [RapidAPI](https://rapidapi.com/DataCrawler/api/booking-com15) |
   | `RAPIDAPI_HOST` | Host da API (padrão `booking-com15.p.rapidapi.com`) |
   | `UNSPLASH_ACCESS_KEY` | Access Key da [Unsplash API](https://unsplash.com/developers), usada como fallback de imagens |
   | `CLIENT_URL` | URL do frontend (para CORS) |

   > **Importante:** se `RAPIDAPI_KEY` não for configurada (ou a chamada falhar), a API
   > usa automaticamente um conjunto de **hotéis fictícios** (`src/data/mockHotels.js`),
   > permitindo testar e demonstrar o site completo sem nenhuma credencial externa.

3. Inicie o servidor:
   ```bash
   npm run dev
   ```
   A API ficará disponível em `http://localhost:5000/api`.

### Principais rotas da API

| Método | Rota | Descrição | Acesso |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Cadastro de usuário | Público |
| POST | `/api/auth/login` | Login (retorna JWT) | Público |
| GET | `/api/auth/me` | Dados do usuário logado | Privado |
| GET | `/api/hotels/search` | Busca hotéis (destino, datas, filtros, ordenação) | Público |
| GET | `/api/hotels/featured` | Hotéis recomendados/melhor avaliados | Público |
| GET | `/api/hotels/:id` | Detalhes de um hotel | Público |
| POST | `/api/bookings` | Cria uma reserva | Privado |
| GET | `/api/bookings` | Lista as reservas do usuário | Privado |
| DELETE | `/api/bookings/:id` | Cancela uma reserva | Privado |

Filtros de `/api/hotels/search`: `destination, checkIn, checkOut, adults, maxPrice,
pool, parking, ac, wifi, breakfast, sortBy(price|rating), page, limit`.

## Configuração do frontend (`client/`)

1. Instale as dependências:
   ```bash
   cd client
   npm install
   ```
2. Copie `.env.local.example` para `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```
   e ajuste `NEXT_PUBLIC_API_URL` se a API não estiver em `http://localhost:5000/api`.

3. Inicie o site:
   ```bash
   npm run dev
   ```
   Acesse `http://localhost:3000`.

## Login com Google (preparado para o futuro)

O login com e-mail/senha (JWT) já está completo. A estrutura para login com Google
já está preparada, mas **não implementada**:

- O model `User` (`server/src/models/User.js`) já possui o campo opcional `googleId`
  e tem `password` opcional, para suportar contas criadas via OAuth.
- As rotas `GET /api/auth/google` e `/api/auth/google/callback`
  (`server/src/routes/authRoutes.js`) retornam `501` com instruções de implementação.
- No frontend, os botões "Continuar com Google" em `/login` e `/register` estão
  desabilitados com o aviso "em breve".

Para implementar: criar credenciais OAuth 2.0 no Google Cloud Console, instalar
`passport` + `passport-google-oauth20`, configurar `GOOGLE_CLIENT_ID`,
`GOOGLE_CLIENT_SECRET` e `GOOGLE_CALLBACK_URL`, e gerar um JWT no callback do OAuth.

## Fluxo de uso

1. Na home, use a barra de busca (destino, datas, hóspedes) ou veja a seção de
   **hotéis recomendados**.
2. Na página de busca, use os filtros (piscina, estacionamento, ar-condicionado,
   Wi-Fi, café da manhã), preço máximo e ordenação (mais econômicos / melhor avaliados).
3. Ao abrir um hotel, é possível visualizar fotos, comodidades e avaliações.
4. Para **reservar**, é necessário estar logado — caso contrário, você será
   redirecionado para a tela de login/cadastro.
5. Reservas concluídas aparecem em **Minhas Reservas**, onde também é possível
   cancelá-las.
