const ClothingItem = require("../models/clothingItem");
const { CREATED_CODE } = require("../utils/errors");
const checkError = require("../utils/checkError");

function getClothingItems(req, res) {
  ClothingItem.find({})
    .then((clothingItems) => res.send({ data: clothingItems }))
    .catch((err) => {
      console.error(err);
      return checkError(err, res);
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
      return checkError(err, res);
    });
}

function deleteClothingItem(req, res) {
  const id = req.params.itemId;

  ClothingItem.findById(id)
    .orFail()
    .then((clothingItem) => {
      if (String(clothingItem.owner) !== req.user._id) {
        const error = new Error("Item doesn't belong to logged in user");
        error.name = "PermisionDenied";
        return Promise.reject(error);
      }

      return clothingItem
        .deleteOne()
        .then(() => res.send({ message: "Successfully deleted" }));
    })
    .catch((err) => {
      console.error(err);
      return checkError(err, res);
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
    .then((clothingItem) => res.send({ data: clothingItem }))
    .catch((err) => {
      console.error(err);
      checkError(err, res);
    });
}

function dislikeClothingItem(req, res) {
  const id = req.params.itemId;
  const owner = req.user._id;

  ClothingItem.findByIdAndUpdate(id, { $pull: { likes: owner } }, { new: true })
    .orFail()
    .then((clothingItem) => res.send({ data: clothingItem }))
    .catch((err) => {
      console.error(err);
      checkError(err, res);
    });
}

module.exports = {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeClothingItem,
  dislikeClothingItem,
};
