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
        expiresIn: '1h',
      });

      res.status(200).json({
        token,
        user: {
          ...user.toJSON(),
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

  getAllUser: async (req, res) => {
    try {
      const users = await User.findAll();
      res.status(200).send(users);
    } catch (error) {
      res.status(error?.statusCode || 500).json({
        status: 'error',
        message: error?.message || error,
      });
    }
  },
  getUserById: async (req, res) => {
    try {
      const { id } = req.params;
      await User.findOne({ where: { id } }).then((result) => res.send(result));
    } catch (error) {
      res.status(error?.statusCode || 500).json({
        status: 'error',
        message: error?.message || error,
      });
    }
  },
  editUserById: async (req, res) => {
    const { token } = req;
    const {
      username,
      fullname,
      email,
      image,
      password,
      isAdmin,
      isCashier,
      isActive,
    } = req.body;

    if (!token)
      throw new ResponseError('Unauthorized: User Not Logged In!', 400);
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const userId = decodedToken.id;

      if (req.file) {
        req.body.image = await sharp(req.file.buffer).png().toBuffer();
        req.body.image = req.file.originalname;
      }
      const newUser = await User.update(
        {
          username,
          fullname,
          email,
          image: req.body.image,
          password,
          isAdmin,
          isCashier,
          isActive,
        },
        {
          where: {
            id: userId,
          },
        }
      );

      if (newUser === 0) throw new ResponseError('user not found', 400);

      res
        .status(200)
        .send({ message: 'User updated successfully', user: newUser });
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
      res.status(200).send({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(error?.statusCode || 500).json({
        status: 'error',
        message: error?.message || error,
      });
    }
  },
};

module.exports = userController;
