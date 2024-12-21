const User = require("../models/user");
const { OK_CODE, CREATED_CODE } = require("../utils/errors");
const {
  checkDocumentNotFound,
  checkValidationError,
  checkCastError,
  getServerError,
} = require("../utils/checkError");

function getUsers(req, res) {
  User.find({})
    .then((users) => res.status(OK_CODE).send({ data: users }))
    .catch((err) => {
      console.error(err);
      return getServerError(err, res);
    });
}

function getUser(req, res) {
  const id = req.params.userId;

  User.findById(id)
    .orFail()
    .then((user) => res.status(OK_CODE).send({ data: user }))
    .catch((err) => {
      console.error(err);

      return (
        checkDocumentNotFound(err, res) ||
        checkCastError(err, res) ||
        getServerError(err, res)
      );
    });
}

function createUser(req, res) {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => res.status(CREATED_CODE).send({ data: user }))
    .catch((err) => {
      console.error(err);
      return checkValidationError(err, res) || getServerError(err, res);
    });
}

module.exports = {
  getUsers,
  getUser,
  createUser,
};
