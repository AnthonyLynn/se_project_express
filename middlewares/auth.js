const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const UnathorizedError = require("../errors/unathorized-err");

const handleAuthError = (res) => {
  throw new UnathorizedError("Authorization Error");
};

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return handleAuthError(res);
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return handleAuthError(res);
  }

  req.user = payload;

  return next();
};
