const express = require("express");
const users = express.Router();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = require("../models/User");
users.use(cors());

process.env.SECRET_KEY = 'secret';

// REGISTER
users.post('/register', (req, res) => {
    const userData = {
        name: req.body.name,
        login: req.body.login,
        password: req.body.password
    }

    User.findOne({
        where: {
            login: req.body.login
        }
    })
        .then(user => {
            if(!user) {
                const hash = bcrypt.hashSync(userData.password, 10);
                userData.password = hash;
                User.create(userData)
                .then(user => {
                    let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
                        expiresIn: 1440
                    })
                    res.json({ token: token });
                })
                .catch(err => {
                    res.send('error: ' + error);
                })
            } else {
                res.json({ error: 'User with the same login already exists!' });
            }
        })
        .catch(err => {
          res.send('error: ' + err);
        })
})

//LOGIN
users.post('/login', (req, res) => {
    User.findOne({
        where: {
            login: req.body.login
        }
  })
  .then(user => {
    if(user!= null) {
      if(bcrypt.compareSync(req.body.password, user.password)) {
          let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
              expiresIn: 1440
          });
          res.json({token: token})
      } else {
          res.json({ error: 'Passwords does not match!' });
      }
    }
    else {
      res.json({ error: 'User does not exist!' });
    }
  })
  .catch(err => {
      res.send('error:' + err);
  })
})

//GET Users
users.get('/profile', (req,res) => {

    User.findAll()
        .then(user => {
            if (user) {
                res.json(user);
            }
            else {
                res.send('User does not exist!');
            }
        })
        .catch(err => {
            res.send('error' + err);
        })
})

module.exports = users;
