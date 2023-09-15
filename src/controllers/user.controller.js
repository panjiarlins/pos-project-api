const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sharp = require('sharp');

const { User } = require('../models');
const { ResponseError } = require('../errors');

const userController = {
  registerUser: async (req, res) => {
    try {
      const existingUser = await User.findOne({
        where: { email: req.body.email },
      });

      if (existingUser) throw new ResponseError('Email already in use', 400);

      const hashedPass = await bcrypt.hash(req.body.password, 10);

      // Process and store the image in a buffer
      if (req.file) {
        req.body.image = await sharp(req.file.buffer).png().toBuffer();
      }

      const newUser = await User.create({
        ...req.body,
        password: hashedPass,
      });

      res.status(201).json({
        status: 'success',
        data: {
          ...newUser.toJSON(),
          image: undefined,
          password: undefined,
        },
      });
    } catch (error) {
      res.status(error?.statusCode || 500).json({
        status: 'error',
        message: error?.message || error,
      });
    }
  },

  loginUser: async (req, res) => {
    const { username, password } = req.body;
    console.log(req.body, 'login');
    try {
      const user = await User.findOne({
        where: { username },
      });

      if (!user) throw new ResponseError('user not found', 404);

      const isValid = await bcrypt.compare(password, user.password);

      if (!isValid) throw new ResponseError('wrong password', 400);

      const payload = {
        id: user.id,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: '24h',
      });

      res.status(200).json({
        status: 'success',
        data: {
          token,
          user: {
            ...user.toJSON(),
            image: undefined,
            password: undefined,
          },
        },
      });
    } catch (error) {
      res.status(error?.statusCode || 500).json({
        status: 'error',
        message: error?.message || error,
      });
    }
  },

  getAllUser: async (req, res) => {
    try {
      const usersData = await User.findAll({
        attributes: {
          exclude: ['image', 'password'],
        },
      });

      res.status(200).json({
        status: 'success',
        data: usersData,
      });
    } catch (error) {
      res.status(error?.statusCode || 500).json({
        status: 'error',
        message: error?.message || error,
      });
    }
  },

  getUserById: async (req, res) => {
    try {
      const userData = await User.findByPk(req.params.id, {
        attributes: {
          exclude: ['image', 'password'],
        },
      });
      if (!userData) throw new ResponseError('user not found', 404);

      res.status(200).json({
        status: 'success',
        data: userData,
      });
    } catch (error) {
      res.status(error?.statusCode || 500).json({
        status: 'error',
        message: error?.message || error,
      });
    }
  },

  editUserById: async (req, res) => {
    // if (!req.token)
    //   throw new ResponseError('Unauthorized: User Not Logged In!', 401);
    try {
      // jwt.verify(req.token, process.env.JWT_SECRET_KEY);

      if (req.file) {
        req.body.image = await sharp(req.file.buffer).png().toBuffer();
      }
      const [numUpdated] = await User.update(req.body, {
        where: {
          id: req.params.id,
        },
        fields: [
          'username',
          'fullname',
          'email',
          'image',
          'isActive',
          'isAdmin',
          'isActive',
        ],
      });
      if (numUpdated === 0) throw new ResponseError('user not found', 400);

      res.sendStatus(204);
    } catch (error) {
      res.status(error?.statusCode || 500).json({
        status: 'error',
        message: error?.message || error,
      });
    }
  },

  deleteUserById: async (req, res) => {
    try {
      const { id } = req.params;

      const deletedUser = await User.destroy({ where: { id } });

      if (deletedUser === 0) throw new ResponseError('user not found', 400);

      res.sendStatus(204);
    } catch (error) {
      res.status(error?.statusCode || 500).json({
        status: 'error',
        message: error?.message || error,
      });
    }
  },
};

module.exports = userController;
