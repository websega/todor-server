const Router = require('express');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

const config = require('config');

const User = require('../models/User');

const router = new Router();
const authMiddleware = require('../middleware/auth.middleware');

router.post(
  '/registration',
  [
    check('email', 'Uncorrect email').isEmail(),
    check('name', 'Uncorrect username').isLength({ min: 4 }),
    check(
      'password',
      'Password mast be longer than 4 and shorter than 20'
    ).isLength({ min: 4, max: 20 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Uncorrect request', errors });
      }

      const { name, email, password } = req.body;

      const candidate = await User.findOne({ email });

      if (candidate) {
        return res
          .status(400)
          .json({ message: `User with email ${email} already exists` });
      }

      const hashPassword = await bcrypt.hash(password, 8);
      const user = new User({ name, email, password: hashPassword });
      await user.save();

      return res.json({ message: 'User was created' });
    } catch (error) {
      console.log(error);
      res.send({ message: 'Server error' });
    }
  }
);

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPassValid = bcrypt.compareSync(password, user.password);

    if (!isPassValid) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ id: user.id }, config.get('secretKey'), {
      expiresIn: '1h',
    });

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        folders: user.folders,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.log(error);
    res.send({ message: 'Server error' });
  }
});

router.get('/auth', authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.id });

    const token = jwt.sign({ id: user.id }, config.get('secretKey'), {
      expiresIn: '1h',
    });

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        folders: user.folders,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.log(error);
    res.send({ message: 'Server error' });
  }
});

module.exports = router;
