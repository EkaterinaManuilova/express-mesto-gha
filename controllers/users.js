const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Ошибка' }));
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь не найден' });
      }
      res.status(200).send(user);
    })
    .catch(next)
    .catch(() => res.status(500).send({ message: 'Ошибка' }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  if (!name || !about || !avatar) {
    return res.status(400).send({ message: 'Переданы некорректные данные' });
  }

  if (name.length < 2 || name.length > 30 || about.length < 2 || about.length > 30) {
    return res.status(400).send({ message: 'Переданы некорректные данные' });
  }

  User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.code === 11000) {
        return res.status(409).send({ message: 'Такой пользователь уже существует' });
      }
    })
    .catch((err) => res.send({ message: err.message }))
    .catch(() => res.status(500).send({ message: 'Ошибка' }));
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь не найден' });
      }
      return res.send({ data: user });
    })
    .catch(() => res.status(400).send({ message: 'Переданы некорректные данные' }))
    .catch((err) => res.send({ message: err.message }))
    .catch(() => res.status(500).send({ message: 'Ошибка' }));
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь не найден' });
      }
      return res.send({ data: user });
    })
    .catch(() => res.status(400).send({ message: 'Переданы некорректные данные' }))
    .catch((err) => res.send({ message: err.message }))
    .catch(() => res.status(500).send({ message: 'Ошибка' }));
};
