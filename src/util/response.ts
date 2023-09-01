export const successRes = (res, data, statusCode, message) => {
  res.status(statusCode).json({ message: message, data });
};

export const errorRes = (res, statusCode, message) => {
  res.status(statusCode).json({ error: message });
};
