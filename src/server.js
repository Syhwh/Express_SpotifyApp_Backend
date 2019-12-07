require('dotenv').config();

const express = require('express');
const router = require('./routes');

let app = express()

//Database
require('./database/database');

//middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Routes
router(app);

// Handle errors
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({ message: 'Server Error', error: err.message });
});


let port = process.env.PORT || 3001
console.log(`Listening on port ${port}. Go /login to initiate authentication flow.`)
app.listen(port)