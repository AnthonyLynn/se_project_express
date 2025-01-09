const router = require("express").Router();
const { getCurrentUser, updateUser } = require("../controllers/users");

module.exports = router;

router.get("/me", getCurrentUser);
router.patch("/me", updateUser);
