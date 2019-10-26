const _ = require('lodash');
const createError = require('http-errors');

const camilize = (obj) => {
  const newObj = {};

  Object.keys(obj).forEach((key) => {
    newObj[_.camelCase(key)] = obj[key];
  });

  return newObj;
};

const snakelize = (obj) => {
  const newObj = {};

  Object.keys(obj).forEach((key) => {
    newObj[_.snakeCase(key)] = obj[key];
  });

  return newObj;
};


const processDbResponse = (dbObj) => {
  if (!dbObj) {
    return dbObj;
  }
  if (_.isArray(dbObj) && dbObj.length === 0) {
    return null;
  }
  const obj = _.isArray(dbObj) && dbObj.length === 1 ? dbObj[0] : dbObj;

  return _.isArray(obj) ? obj.map((item) => camilize(item)) : camilize(obj);
};

const handleConflict = ({ err, resourceName }) => {
  if (err.code === '23505') {
    throw new createError.Conflict(`${resourceName} already exists`);
  }
  throw err;
};

module.exports = {
  camilize,
  snakelize,
  processDbResponse,
  handleConflict,
};
