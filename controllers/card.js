const Card = require('../models/card');
const CastError = require('../errors/CastError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(201).send({ data: card });
    })
    .catch(() => {
      next(new CastError('Переданы некорректные данные'));
    })
    .catch(next);
};

module.exports.getCards = (_, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Карточка не найдена'));
      }
      if (req.user._id === !card.owner) {
        next(new ForbiddenError('Не достаточно прав'));
      }
      return Card.findByIdAndRemove(req.params.cardId)
        .then((cardItem) => res.send({ data: cardItem, message: 'Карточка  удалена' }));
    })
    .catch(() => {
      next(new CastError('Невалидный id'));
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Карточка не найдена'));
      }
      res.send({ data: card, likes: card.likes.length });
    })
    .catch(() => {
      next(new CastError('Невалидный id'));
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Карточка не найдена'));
      }
      res.send({ data: card, likes: card.likes.length });
    })
    .catch(() => {
      next(new CastError('Невалидный id'));
    })
    .catch(next);
};
