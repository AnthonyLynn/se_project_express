const ClothingItem = require("../models/clothingItem");
const { OK_CODE, CREATED_CODE } = require("../utils/errors");
const {
  checkDocumentNotFound,
  checkValidationError,
  checkCastError,
  getServerError,
} = require("../utils/checkError");

// I noticed a pattern of error checks given the context their used.
// when finding an object, cast, and notFound errors can occur;
// when creating, validation errors. All end in server error checks.
// Would it be a good idea to group these into their own functions?

function getClothingItems(req, res) {
  ClothingItem.find({})
    .then((clothingItems) => res.status(OK_CODE).send({ data: clothingItems }))
    .catch((err) => {
      console.error(err);
      return getServerError(err, res);
    });
}

function createClothingItem(req, res) {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((clothingItem) =>
      res.status(CREATED_CODE).send({ data: clothingItem })
    )
    .catch((err) => {
      console.error(err);
      return checkValidationError(err, res) || getServerError(err, res);
    });
}

function deleteClothingItem(req, res) {
  const id = req.params.itemId;

  ClothingItem.findByIdAndRemove(id)
    .orFail()
    .then((clothingItem) => res.status(OK_CODE).send({ data: clothingItem }))
    .catch((err) => {
      console.error(err);
      return (
        checkCastError(err, res) ||
        checkDocumentNotFound(err, res) ||
        getServerError(err, res)
      );
    });
}

function likeClothingItem(req, res) {
  const id = req.params.itemId;
  const owner = req.user._id;

  ClothingItem.findByIdAndUpdate(
    id,
    { $addToSet: { likes: owner } },
    { new: true }
  )
    .orFail()
    .then((clothingItem) => res.status(OK_CODE).send({ data: clothingItem }))
    .catch((err) => {
      console.error(err);

      return (
        checkCastError(err, res) ||
        checkDocumentNotFound(err, res) ||
        getServerError(err, res)
      );
    });
}

function dislikeClothingItem(req, res) {
  const id = req.params.itemId;
  const owner = req.user._id;

  ClothingItem.findByIdAndUpdate(id, { $pull: { likes: owner } }, { new: true })
    .orFail()
    .then((clothingItem) => {
      res.status(OK_CODE).send({ data: clothingItem });
    })
    .catch((err) => {
      console.error(err);

      return (
        checkCastError(err, res) ||
        checkDocumentNotFound(err, res) ||
        getServerError(err, res)
      );
    });
}

module.exports = {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeClothingItem,
  dislikeClothingItem,
};
