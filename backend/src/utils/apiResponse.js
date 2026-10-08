'use strict';

const { HTTP_STATUS } = require('../constants/httpStatus');

/**
 * Standardized API response helpers.
 * Controllers call these instead of constructing raw res.json() calls,
 * ensuring every response follows the same envelope shape.
 */
const success = (res, data = null, message = 'Success', statusCode = HTTP_STATUS.OK) => {
  const body = { success: true, statusCode, message };
  if (data !== null) body.data = data;
  return res.status(statusCode).json(body);
};

const created = (res, data = null, message = 'Created successfully') => {
  return success(res, data, message, HTTP_STATUS.CREATED);
};

const paginated = (res, data, pagination, message = 'Success') => {
  return res.status(HTTP_STATUS.OK).json({
    success: true,
    statusCode: HTTP_STATUS.OK,
    message,
    data,
    pagination,
  });
};

const error = (res, message = 'Internal server error', statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, errors = []) => {
  const body = { success: false, statusCode, message };
  if (errors.length > 0) body.errors = errors;
  return res.status(statusCode).json(body);
};

module.exports = { success, created, paginated, error };
