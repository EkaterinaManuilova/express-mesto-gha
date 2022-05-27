const Card = require('../models/card');
const CastError = require('../errors/CastError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(201).send({
        name: card.name, link: card.link, owner: card.owner, id: card._id,
      });
    })
    .catch(() => {
      next(new CastError('Переданы некорректные данные'));
    })
    .catch(next);
};

module.exports.getCards = (_, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then(async (card) => {
      if (!card) {
        next(new NotFoundError('Карточка не найдена'));
      }
      if (req.user._id === !card.owner) {
        next(new ForbiddenError('Не достаточно прав для совершения действия'));
      }
      const cardItem = await Card.findByIdAndRemove(req.params.cardId);
      return res.status(200).send({ data: cardItem, message: 'Карточка  удалена' });
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
      res.status(200).send({ card, likes: card.likes.length });
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
      res.status(200).send({ card, likes: card.likes.length });
    })
    .catch(() => {
      next(new CastError('Невалидный id'));
    })
    .catch(next);
};
