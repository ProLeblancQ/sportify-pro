import type { Request, Response, NextFunction } from 'express'

export const errorMiddleware = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status: number = err.status ?? 400
  res.status(status).json({ message: err.message ?? 'Erreur interne' })
}
