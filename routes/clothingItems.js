const router = require("express").Router();
const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeClothingItem,
  dislikeClothingItem,
} = require("../controllers/clothingItems");
const authroize = require("../middlewares/auth");
const { validateItem, validateId } = require("../middlewares/validation");

router.get("/", getClothingItems);
router.post("/", authroize, validateItem, createClothingItem);
router.delete("/:itemId", authroize, validateId, deleteClothingItem);
router.put("/:itemId/likes", authroize, validateId, likeClothingItem);
router.delete("/:itemId/likes", authroize, validateId, dislikeClothingItem);

module.exports = router;
