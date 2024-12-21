const {
  SERVER_ERROR_CODE,
  BAD_REQUEST_CODE,
  NOT_FOUND_CODE,
} = require("./errors");

function getError(res, code, msg) {
  return res.status(code).send({ message: msg });
}

module.exports = function checkError(err, res) {
  switch (err.name) {
    case "DocumentNotFoundError":
      return getError(res, NOT_FOUND_CODE, err.message);
    case "ValidationError":
    case "CastError":
      return getError(res, BAD_REQUEST_CODE, err.message);
    default:
      return getError(
        res,
        SERVER_ERROR_CODE,
        err.message || "internal server error"
      );
  }
};
