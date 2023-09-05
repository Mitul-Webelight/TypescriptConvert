import { Response } from 'express';

export const successRes = (
  res: Response,
  data: any,
  statusCode: number,
  message: string
) => {
  res.status(statusCode).json({ message: message, data });
};

export const errorRes = (
  res: Response,
  statusCode: number,
  message: string
) => {
  res.status(statusCode).json({ error: message });
};
