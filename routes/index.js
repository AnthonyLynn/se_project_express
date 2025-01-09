const router = require("express").Router();
const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const { NOT_FOUND_CODE } = require("../utils/errors");
const { createUser, login } = require("../controllers/users");
const authroize = require("../middlewares/auth");

router.post("/signin", login);
router.post("/signup", createUser);

router.use(authroize);

router.use("/users", userRouter);
router.use("/items", clothingItemRouter);

router.use((req, res) =>
  res.status(NOT_FOUND_CODE).send({ message: "internal server error" })
);

module.exports = router;
