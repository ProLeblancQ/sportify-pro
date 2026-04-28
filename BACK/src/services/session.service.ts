import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const getAllSessions = () => {
  return prisma.session.findMany({
    where: { status: 'open' },
    include: { coach: { include: { user: true } } },
    orderBy: { scheduled_at: 'asc' }
  })
}

export const createSession = async (data: {
  title: string, scheduled_at: Date, duration_min: number,
  max_spots: number, user_id: number
}) => {
  const coach = await prisma.coach.findUnique({ where: { user_id: data.user_id } })
  if (!coach) throw new Error('Profil coach introuvable pour cet utilisateur')

  return prisma.session.create({
    data: {
      title: data.title,
      scheduled_at: new Date(data.scheduled_at),
      duration_min: data.duration_min,
      max_spots: data.max_spots,
      available_spots: data.max_spots,
      coach_id: coach.id,
    }
  })
}

export const getSessionById = (id: number) => {
  return prisma.session.findUnique({
    where: { id },
    include: { bookings: { include: { user: true } } }
  })
}

export const deleteSession = (id: number) => {
  return prisma.session.delete({ where: { id } })
}

export const getCoachSessions = async (user_id: number) => {
  const coach = await prisma.coach.findUnique({ where: { user_id } })
  if (!coach) throw new Error('Profil coach introuvable')

  return prisma.session.findMany({
    where: { coach_id: coach.id },
    include: { bookings: { include: { user: true } } },
    orderBy: { scheduled_at: 'asc' }
  })
}