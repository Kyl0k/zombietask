const { Joi } = require("express-validation");
//Just to check
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

const validation = {
  zombieName: {
    body: Joi.object({
      name: Joi.string().required(),
    }),
  },
};

class ZombieError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
  }
}

const ifNotFound = (element, elmentName) => {
  if (!element)
    throw new ZombieError(
      `There is no such ${elmentName} in our database or it has been removed`,
      404
    );
};

const validateItems = async (items, props) => {
  if (!(Array.isArray(items) && items.length <= 5)) {
    props.message = `Path items is not an Array or is longer than the maximum allowed lenght (5)`;
    return false;
  }
  return true;
};

module.exports = {
  catchAsync,
  validation,
  ZombieError,
  ifNotFound,
  validateItems,
};
