import { Request, Response, NextFunction } from "express";

export function loggerMiddleware(req: Request, res: Response, next: NextFunction) {
  console.log(`Recived request for recource ${req.url} with method ${req.method}`);
  next();
}
