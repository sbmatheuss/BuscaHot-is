const crypto = require('crypto');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { sendPasswordResetEmail } = require('../services/emailService');

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

  if (!user || !user.password || !(await user.matchPassword(password))) {
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

// @desc    Atualiza dados do perfil do usuário (nome, e-mail, senha)
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('Usuário não encontrado');
  }

  const { name, email, password, currentPassword } = req.body;

  if (email && email.toLowerCase() !== user.email) {
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      res.status(400);
      throw new Error('Este e-mail já está em uso por outra conta');
    }
    user.email = email.toLowerCase();
  }

  if (name) user.name = name.trim();

  if (password) {
    if (user.password) {
      if (!currentPassword) {
        res.status(400);
        throw new Error('Informe a senha atual para definir uma nova senha');
      }
      const match = await user.matchPassword(currentPassword);
      if (!match) {
        res.status(401);
        throw new Error('Senha atual incorreta');
      }
    }
    if (password.length < 6) {
      res.status(400);
      throw new Error('A nova senha deve ter pelo menos 6 caracteres');
    }
    user.password = password;
  }

  await user.save();

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  });
});

// @desc    Solicita redefinição de senha (envia e-mail com link)
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    res.status(400);
    throw new Error('Informe o e-mail');
  }

  const user = await User.findOne({ email: email.toLowerCase() });

  // Sempre retorna 200 para não revelar se o e-mail existe
  if (!user) {
    return res.json({ message: 'Se esse e-mail estiver cadastrado, você receberá as instruções em breve.' });
  }

  if (!user.password) {
    return res.json({ message: 'Essa conta usa login com Google. Entre com o Google para acessar.' });
  }

  const token = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
  user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hora
  await user.save();

  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
  await sendPasswordResetEmail({ to: user.email, name: user.name, resetUrl });

  res.json({ message: 'Se esse e-mail estiver cadastrado, você receberá as instruções em breve.' });
});

// @desc    Redefine a senha com o token recebido por e-mail
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    res.status(400);
    throw new Error('Token e nova senha são obrigatórios');
  }

  if (password.length < 6) {
    res.status(400);
    throw new Error('A senha deve ter pelo menos 6 caracteres');
  }

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error('Token inválido ou expirado');
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  });
});

// @desc    Inicia fluxo OAuth com Google (redirecionado pelo passport)
// @route   GET /api/auth/google
// @access  Public
const googleAuth = (req, res, next) => next();

// @desc    Callback do Google OAuth — gera JWT e redireciona para o frontend
// @route   GET /api/auth/google/callback
// @access  Public
const googleCallback = (req, res) => {
  const token = generateToken(req.user._id);
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
  res.redirect(`${clientUrl}/auth/callback?token=${token}`);
};

module.exports = { registerUser, loginUser, getMe, updateProfile, forgotPassword, resetPassword, googleAuth, googleCallback };
