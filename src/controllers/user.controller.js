const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sharp = require('sharp');
const { ResponseError } = require('../errors');
const sendResponse = require('../utils/sendResponse');
const { Sequelize, User } = require('../models');

const userController = {
  registerUser: async (req, res) => {
    try {
      // Process and store the image in a buffer
      req.body.image = await sharp(req.file.buffer).png().toBuffer();

      const hashedPass = await bcrypt.hash(req.body.password, 10);

      const [userData, isCreated] = await User.findOrCreate({
        where: {
          [Sequelize.Op.or]: {
            username: req.body.username,
            email: req.body.email,
          },
        },
        defaults: {
          ...req.body,
          password: hashedPass,
        },
        fields: [
          'username',
          'fullname',
          'email',
          'password',
          'isAdmin',
          'isCashier',
          'isActive',
          'image',
        ],
      });
      if (!isCreated)
        throw new ResponseError('username/email already in use', 400);

      sendResponse({
        res,
        statusCode: 201,
        data: {
          ...userData.toJSON(),
          image: undefined,
          password: undefined,
        },
      });
    } catch (error) {
      sendResponse({ res, error });
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
