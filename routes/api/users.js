const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

// Load Model
const User = require('../../models/User');

// @route  GET api/users/test
// @desc   Tests users route
// @access Public
router.get('/test', (req, res) => res.json({ msg: 'Users Works' }));

// @route  GET api/users
// @desc   Get all registered users
// @access Public
router.get('/', (req, res) => {
  User.find()
    .then(users => res.json(users))
    .catch(err =>
      res.status(404).json({ msg: 'No Users found in the database' })
    );
});

// @route  POST api/users/register
// @desc   Register new User
// @access Public
router.post('/register', (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ msg: 'Email already exists' });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

module.exports = router;
