import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = 500;
    const message = error.message || 'Something went wrong';
    error = new ApiError(statusCode, message);
  }

  const apiError = error as ApiError;

  res.status(apiError.statusCode).json(
    new ApiResponse(false, apiError.message)
  );
};