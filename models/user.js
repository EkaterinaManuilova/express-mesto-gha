const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь океана',
  },
  avatar: {
    type: String,
    required: true,
    default: 'https://avatars.mds.yandex.net/i?id=a4e72c09fdfaa100ea8d31a15e7b667c-5887158-images-thumbs&n=13',
  },
}, { versionKey: false });

module.exports = mongoose.model('user', userSchema);
