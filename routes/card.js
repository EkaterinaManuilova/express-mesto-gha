const router = require('express').Router();
const {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  dislikeCard,
} = require('../controllers/card');

router.get('/', getCards);

router.delete('/:cardId', deleteCard);

router.post('/', createCard);

router.put('/:cardId/likes', likeCard);

router.delete('/:cardId/likes', dislikeCard);

module.exports = router;
