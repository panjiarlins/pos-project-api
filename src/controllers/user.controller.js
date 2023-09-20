const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sharp = require('sharp');
const { ResponseError } = require('../errors');
const sendResponse = require('../utils/sendResponse');
const { Sequelize, User } = require('../models');

const userController = {
  getUsers: async (req, res) => {
    try {
      const usersData = await User.findAll({
        attributes: {
          exclude: ['image', 'password'],
        },
      });

      sendResponse({ res, statusCode: 200, data: usersData });
    } catch (error) {
      sendResponse({ res, error });
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
      if (!userData.isActive)
        throw new ResponseError('user status inactive', 401);

      sendResponse({ res, statusCode: 200, data: userData });
    } catch (error) {
      sendResponse({ res, error });
    }
  },

  getUserImageById: async (req, res) => {
    try {
      const userData = await User.findByPk(req.params.id, {
        attributes: ['image'],
      });
      if (!userData?.image)
        throw new ResponseError('user image not found', 404);

      res.set('Content-type', 'image/png').send(userData.image);
    } catch (error) {
      sendResponse({ res, error });
    }
  },

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
    try {
      const { username, password } = req.body;

      const userData = await User.findOne({ where: { username } });
      if (!userData) throw new ResponseError('user not found', 404);
      if (!userData.isActive)
        throw new ResponseError('user status inactive', 401);

      const isValid = await bcrypt.compare(password, userData.password);
      if (!isValid) throw new ResponseError('wrong password', 400);

      const payload = {
        id: userData.id,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: '24h',
      });

      sendResponse({
        res,
        statusCode: 200,
        data: {
          token,
          user: {
            ...userData.toJSON(),
            image: undefined,
            password: undefined,
          },
        },
      });
    } catch (error) {
      sendResponse({ res, error });
    }
  },

  editUserById: async (req, res) => {
    try {
      if (req.file)
        req.body.image = await sharp(req.file.buffer).png().toBuffer();

      if (req.body?.password) {
        const hashedPass = await bcrypt.hash(req.body.password, 10);
        req.body.password = hashedPass;
      }

      const [numUpdated] = await User.update(req.body, {
        where: {
          id: req.params.id,
        },
        fields: [
          'username',
          'fullname',
          'email',
          'password',
          'image',
          'isActive',
          'isAdmin',
          'isActive',
        ],
      });
      if (numUpdated === 0) throw new ResponseError('user not found', 400);

      res.sendStatus(204);
    } catch (error) {
      sendResponse({ res, error });
    }
  },

  deleteUserById: async (req, res) => {
    try {
      const deletedUser = await User.destroy({ where: { id: req.params.id } });
      if (deletedUser === 0) throw new ResponseError('user not found', 400);

      res.sendStatus(204);
    } catch (error) {
      sendResponse({ res, error });
    }
  },
};

module.exports = userController;
