const router = require("express").Router();
const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const { NOT_FOUND_CODE } = require("../utils/errors");
const { createUser, login } = require("../controllers/users");

router.post("/signin", login);
router.post("/signup", createUser);

router.use("/items", clothingItemRouter);
router.use("/users", userRouter);

router.use((req, res) =>
  res
    .status(NOT_FOUND_CODE)
    .send({ message: "An error has occurred on the server." })
);

module.exports = router;
