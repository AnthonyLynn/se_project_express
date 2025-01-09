const router = require("express").Router();
const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeClothingItem,
  dislikeClothingItem,
} = require("../controllers/clothingItems");
const authroize = require("../middlewares/auth");

router.get("/", getClothingItems);
router.post("/", authroize, createClothingItem);
router.delete("/:itemId", authroize, deleteClothingItem);
router.put("/:itemId/likes", authroize, likeClothingItem);
router.delete("/:itemId/likes", authroize, dislikeClothingItem);

module.exports = router;
