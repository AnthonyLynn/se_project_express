const router = require("express").Router();
const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const NotFoundError = require("../errors/not-found-err");
const { createUser, login } = require("../controllers/users");
const { validateLogin, validateUser } = require("../middlewares/validation");

router.post("/signin", login, validateLogin);
router.post("/signup", createUser, validateUser);

router.use("/items", clothingItemRouter);
router.use("/users", userRouter);

router.use((req, res, next) => {
  next(new NotFoundError("The page doesn't exist"));
});

module.exports = router;
