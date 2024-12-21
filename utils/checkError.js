const {
  SERVER_ERROR_CODE,
  BAD_REQUEST_CODE,
  NOT_FOUND_CODE,
} = require("./errors");

function checkError(err, res, name, code) {
  if (err.name !== name) return false;
  return res.status(code).send({ message: err.message });
}

function checkDocumentNotFound(err, res) {
  return checkError(err, res, "DocumentNotFoundError", NOT_FOUND_CODE);
}

function checkValidationError(err, res) {
  return checkError(err, res, "ValidationError", BAD_REQUEST_CODE);
}

function checkCastError(err, res) {
  return checkError(err, res, "CastError", BAD_REQUEST_CODE);
}

function getServerError(err, res) {
  return res
    .status(SERVER_ERROR_CODE)
    .send({ message: err.message || "internal server error" });
}

module.exports = {
  checkDocumentNotFound,
  checkValidationError,
  checkCastError,
  getServerError,
};
