const router = require("express").Router();
const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");

router.use("/users", userRouter);
router.use("/items", clothingItemRouter);

router.use((req, res) =>
  res.status(500).send({ message: "internal server error" })
);

module.exports = router;
