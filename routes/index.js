const router = require("express").Router();
const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const { NOT_FOUND_CODE } = require("../utils/errors");

router.use("/users", userRouter);
router.use("/items", clothingItemRouter);

router.use((req, res) =>
  res.status(NOT_FOUND_CODE).send({ message: "internal server error" })
);

module.exports = router;
