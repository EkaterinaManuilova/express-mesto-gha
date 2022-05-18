const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use((req, _, next) => {
  req.user = {
    _id: '6284cd8a4cbf7c5bebf1f0a3',
  };
  next();
});

app.use('/users', require('./routes/users'));

app.use('/cards', require('./routes/card'));

app.listen(PORT, () => {
  console.log('Server started');
});
