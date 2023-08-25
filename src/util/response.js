const successRes = (res, data, statusCode, messageText) => {
  res.status(statusCode).json({ message: messageText, data });
};

const errorRes = (res, statusCode, messageText) => {
  res.status(statusCode).json({ error: messageText });
};

module.exports = {
  successRes,
  errorRes,
};
