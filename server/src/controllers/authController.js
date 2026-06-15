const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Cadastrar novo usuário
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Preencha nome, e-mail e senha');
  }

  const userExists = await User.findOne({ email: email.toLowerCase() });
  if (userExists) {
    res.status(400);
    throw new Error('Já existe uma conta cadastrada com esse e-mail');
  }

  const user = await User.create({ name, email, password });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  });
});

// @desc    Autenticar usuário (login)
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Informe e-mail e senha');
  }

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('E-mail ou senha inválidos');
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  });
});

// @desc    Retorna os dados do usuário autenticado
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
  });
});

// @desc    Stub para login com Google (a implementar com passport-google-oauth20)
// @route   GET /api/auth/google
// @access  Public
const googleAuthStub = asyncHandler(async (req, res) => {
  // Para habilitar o login com Google:
  // 1. Criar credenciais OAuth 2.0 no Google Cloud Console
  // 2. Instalar passport + passport-google-oauth20
  // 3. Configurar GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET e GOOGLE_CALLBACK_URL no .env
  // 4. Implementar a estratégia do Google e gerar o JWT no callback,
  //    associando ao campo `googleId` do model User
  res.status(501).json({
    message: 'Login com Google ainda não implementado. Em breve!',
  });
});

module.exports = { registerUser, loginUser, getMe, googleAuthStub };
