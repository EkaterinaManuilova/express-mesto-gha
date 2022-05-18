const Card = require('../models/card');

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  if (!name || !link) {
    return res.status(400).send({ message: 'Переданы некорректные данные' });
  }

  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(201).send({ data: card });
    })
    .catch((err) => res.send({ message: err.message }))
    .catch(() => res.status(500).send({ message: 'Ошибка' }));
};

module.exports.getCards = (_, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => res.send({ message: err.message }))
    .catch(() => res.status(500).send({ message: 'Ошибка' }));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => res.send({ data: card }))
    .catch((err) => res.send({ message: err.message }))
    .catch(() => res.status(500).send({ message: 'Ошибка' }));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Карточка не найдена' });
      }
      res.send({ data: card });
    })
    .catch((err) => res.send({ message: err.message }))
    .catch(() => res.status(500).send({ message: 'Ошибка' }));
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Карточка не найдена' });
      }
      res.send({ data: card });
    })
    .catch((err) => res.send({ message: err.message }))
    .catch(() => res.status(500).send({ message: 'Ошибка' }));
};
