const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const UnathorizedError = require("../errors/unathorized-err");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new UnathorizedError("Authorization Error");
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new UnathorizedError("Authorization Error");
  }

  req.user = payload;

  return next();
};
