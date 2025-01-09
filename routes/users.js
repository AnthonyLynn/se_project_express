const router = require("express").Router();
const { getCurrentUser, updateUser } = require("../controllers/users");
const authroize = require("../middlewares/auth");

module.exports = router;

router.get("/me", authroize, getCurrentUser);
router.patch("/me", authroize, updateUser);
