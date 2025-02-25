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
router.post("/", authroize, createClothingItem, validateItem);
router.delete("/:itemId", authroize, deleteClothingItem, validateId);
router.put("/:itemId/likes", authroize, likeClothingItem, validateId);
router.delete("/:itemId/likes", authroize, dislikeClothingItem, validateId);

module.exports = router;
