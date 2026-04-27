import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const getAllSessions = () => {
  return prisma.session.findMany({
    where: { status: 'open' },
    include: { coach: { include: { user: true } } },
    orderBy: { scheduled_at: 'asc' }
  })
}

export const createSession = (data: {
  title: string, scheduled_at: Date, duration_min: number,
  max_spots: number, coach_id: number
}) => {
  return prisma.session.create({
    data: { ...data, available_spots: data.max_spots }
  })
}

export const deleteSession = (id: number) => {
  return prisma.session.delete({ where: { id } })
}

export const getCoachSessions = (coach_id: number) => {
  return prisma.session.findMany({
    where: { coach_id },
    include: { bookings: { include: { user: true } } },
    orderBy: { scheduled_at: 'asc' }
  })
}