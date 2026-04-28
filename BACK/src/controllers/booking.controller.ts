import { Request, Response } from 'express'
import * as bookingService from '../services/booking.service'

export const getMyBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await bookingService.getMyBookings(req.user!.id)
    res.json(bookings)
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
}

export const createBooking = async (req: Request, res: Response) => {
  try {
    const user_id = req.user!.id
    const { session_id } = req.body
    const booking = await bookingService.createBooking(user_id, session_id)
    res.status(201).json(booking)
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
}

export const cancelBooking = async (req: Request, res: Response) => {
  try {
    const user_id = req.user!.id
    await bookingService.cancelBooking(Number(req.params.id), user_id)
    res.status(204).send()
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
}