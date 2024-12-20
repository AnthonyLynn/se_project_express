const ClothingItem = require("../models/clothingItem");
const {
  SERVER_ERROR_CODE,
  OK_CODE,
  CREATED_CODE,
  BAD_REQUEST_CODE,
  NOT_FOUND_CODE,
} = require("../utils/errors");
const {
  checkDocumentNotFound,
  checkValidationError,
  getServerError,
} = require("../utils/checkError");

function getClothingItems(req, res) {
  ClothingItem.find({})
    .then((clothingItems) => res.status(OK_CODE).send({ data: clothingItems }))
    .catch((err) => {
      console.error(err);
      return getServerError(err, res);
    });
}

function createClothingItem(req, res) {
  const { name, weather, imageURL } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageURL, owner })
    .then((clothingItem) =>
      res.status(CREATED_CODE).send({ data: clothingItem })
    )
    .catch((err) => {
      console.error(err);
      return checkValidationError(err, res) || getServerError(err, res);
    });
}

function deleteClothingItem(req, res) {
  const id = req.params.id;

  ClothingItem.delete(id)
    .orFail()
    .then((clothingItem) => res.status(OK_CODE).send({ data: clothingItem }))
    .catch((err) => {
      console.error(err);
      return checkDocumentNotFound(err, res) || getServerError(err, res);
    });
}

// Testing needed
function likeClothingItem(req, res) {
  const id = req.params.id;
  const owner = req.user._id;

  ClothingItem.findByIdAndUpdate(id, { likes: owner })
    .orFail()
    .then((clothingItem) => res.status(OK_CODE).send({ data: clothingItem }))
    .catch((err) => {
      console.error(err);

      return (
        checkValidationError(err, res) ||
        checkDocumentNotFound(err, res) ||
        getServerError(err, res)
      );
    });
}

function dislikeClothingItem(req, res) {
  const id = req.params.id;
  const owner = req.user._id;

  ClothingItem.findByIdAndRemove(id, { likes: owner })
    .orFail()
    .then((clothingItem) => {
      res.status(OK_CODE).send({ data: clothingItem });
    })
    .catch((err) => {
      console.error(err);

      return (
        checkValidationError(err, res) ||
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
