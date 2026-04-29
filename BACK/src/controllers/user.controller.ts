import { Request, Response, NextFunction } from 'express'
import * as userService from '../services/user.service'

export const getAllUsers = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userService.getAllUsers()
    res.json(users)
  } catch (err) {
    next(err)
  }
}

export const updateUserRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { role } = req.body
    const user = await userService.updateUserRole(Number(req.params.id), role)
    res.json(user)
  } catch (err) {
    next(err)
  }
}

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await userService.deleteUser(Number(req.params.id))
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.getMe(req.user!.id)
    res.json(user)
  } catch (err) {
    next(err)
  }
}

export const updateMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.updateMe(req.user!.id, req.body)
    res.json(user)
  } catch (err) {
    next(err)
  }
}

export const uploadAvatar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      const err: any = new Error('Aucun fichier reçu')
      err.status = 400
      return next(err)
    }
    const avatarUrl = `/uploads/${req.file.filename}`
    const user = await userService.updateAvatar(req.user!.id, avatarUrl)
    res.json(user)
  } catch (err) {
    next(err)
  }
}
