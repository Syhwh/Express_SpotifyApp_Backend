const request = require('request');
const querystring = require('querystring');


let redirect_uri =
  process.env.REDIRECT_URI ||
  'http://localhost:8888/callback'

module.exports = {
  //login to api
  async login(req, res) {
    res.redirect('https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: process.env.SPOTIFY_CLIENT_ID,
        scope: 'user-read-private user-read-email',
        redirect_uri
      }))
  },

  async callback(req, res) {
    let code = req.query.code || null
    let authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(
          process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
        ).toString('base64'))
      },
      json: true
    }
    request.post(authOptions, function (error, response, body) {
      var access_token = body.access_token
      let uri = process.env.FRONTEND_URI || 'http://localhost:3000'
      res.redirect(uri + '?access_token=' + access_token)
    })
  }


}  