export const successRes = (
  res: any,
  data: any,
  statusCode: number,
  message: string
) => {
  res.status(statusCode).json({ message: message, data });
};

export const errorRes = (res: any, statusCode: number, message: string) => {
  res.status(statusCode).json({ error: message });
};
