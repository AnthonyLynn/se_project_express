const ClothingItem = require("../models/clothingItem");
const BadRequestError = require("../errors/bad-request-err");
const DocumentNotFoundError = require("../errors/not-found-err");
const ForbiddenError = require("../errors/forbidden-err");

function getClothingItems(req, res, next) {
  ClothingItem.find({})
    .then((clothingItems) => res.send({ data: clothingItems }))
    .catch(next);
}

function createClothingItem(req, res, next) {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((clothingItem) => res.status(201).send({ data: clothingItem }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError(err.message));
      }
      return next(err);
    });
}

function deleteClothingItem(req, res, next) {
  const id = req.params.itemId;

  ClothingItem.findById(id)
    .orFail()
    .then((clothingItem) => {
      if (String(clothingItem.owner) !== req.user._id) {
        throw new ForbiddenError("Item doesn't belong to logged in user");
      }

      return clothingItem
        .deleteOne()
        .then(() => res.send({ message: "Successfully deleted" }));
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError(err.message));
      }
      if (err.name === "DocumentNotFoundError") {
        return next(new DocumentNotFoundError(err.message));
      }
      return next(err);
    });
}

function likeClothingItem(req, res, next) {
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
      if (err.name === "CastError") {
        return next(new BadRequestError(err.message));
      }
      if (err.name === "DocumentNotFoundError") {
        return next(new DocumentNotFoundError(err.message));
      }
      return next(err);
    });
}

function dislikeClothingItem(req, res, next) {
  const id = req.params.itemId;
  const owner = req.user._id;

  ClothingItem.findByIdAndUpdate(id, { $pull: { likes: owner } }, { new: true })
    .orFail()
    .then((clothingItem) => res.send({ data: clothingItem }))
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError(err.message));
      }
      if (err.name === "DocumentNotFoundError") {
        return next(new DocumentNotFoundError(err.message));
      }
      return next(err);
    });
}

module.exports = {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeClothingItem,
  dislikeClothingItem,
};
