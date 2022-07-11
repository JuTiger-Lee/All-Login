import express, { Request, Response } from 'express';
import { NextFunction } from 'express';

export default {
  serverError: (
    err,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const result = {
      code: err.code || 500,
      message: err.message || '500 server Error',
      error: {},
    };

    if (err.err || err) result.error = err.err || err;

    if (process.env.NODE_ENV === 'prod') delete result.error;

    res.status(err.httpStatus || 500);

    return res.json({ error: result });
  },
};