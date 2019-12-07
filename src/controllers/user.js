const request = require('request');
//const jwt = require('jsonwebtoken');
const User = require('../database/models/userSchema');
// const { getData } = require('../utils/getUserData');
// const { updateData } = require('../utils/updateUserData.js');
module.exports = {
  //register a new user
  async register(req, res) {

    const userData = {
      userEmail: req.body.email,
      userPassword: req.body.password
    }
    try {
      const user = await User.create(userData);

      const client_id = process.env.SPOTIFY_CLIENT_ID;
      const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
      const spotifyUrl = 'https://accounts.spotify.com/api/token';

      let authOptions = {
        url: spotifyUrl,
        headers: {
          Authorization: 'Basic ' + new Buffer.from(client_id + ':' + client_secret).toString('base64')
        },
        form: {
          grant_type: 'client_credentials'
        },
        json: true
      };
      request.post(authOptions, (err, httpResponse, body) => {

        if (err) {
          return resp.status(400).json({
            ok: false,
            message: 'Error No token provided',
            err
          })
        }
        res.status(200).json({ message: 'User created', body });

      })
    }
    catch (error) {
      console.log(error)
      res.status(403).send({ error });
    }
  },
  // login an user
  async login(req, res) {
    try {
      const user = await User.authenticate(req.body.userEmail, req.body.userPassword);
      if (!user) {
        res.status(401).json({ message: 'Invalid user or password' });
        return;
      }
      const token = jwt.sign(
        { id: user._id },
        process.env.SECRET,
        { expiresIn: 1000 * 60 * 60 * 24 * 365 }
      );
      res.status(200).json({ message: 'User logged', token, user });
    } catch (error) {
      res.status(403).send({ error });
    }
  },
  //Logout Request
  async logout(req, res) {
    try {
      req.userId = null;
      res.status(200).json({ message: 'User logged out' });
    } catch (error) {
      res.status(403).send({ error });
    }
  },
  async edit(req, res) {
    const { id } = req.params;
    try {
      const data = await updateData(req.body);
      const user = await User.findOneAndUpdate(({ _id: id }, data));

      res.status(200).json({ message: 'User edited succesfully', user });
    } catch (error) {
      res.status(401).json(error.message)
    }
  },
  // delete user
  async delete(req, res) {
    const { id } = req.params;
    try {
      await User.deleteOne(({ _id: id }));
      res.status(200).json({ message: 'User deleted succesfully' });
    } catch (error) {
      res.status(401).json(error.message)
    }
  },

  async getUser(req, res) {
    const { id } = req.params;
    try {
      const user = await User.findOne(({ _id: id }));
      res.status(200).json({ user });
    } catch (error) {
      res.status(401).json(error.message)
    }
  },
  // verify token
  async verify(req, res) {
    const token = req.headers['authorization']
    if (!token) {
      return res.status(401).json({
        message: 'No token provided'
      });
    }
    const decoded = jwt.verify(token, process.env.SECRET);
    res.status(200).send(decoded.id);
  }
}