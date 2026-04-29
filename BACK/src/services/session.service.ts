import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const participantSelect = {
  include: {
    user: {
      select: { id: true, first_name: true, last_name: true, avatar_url: true },
    },
  },
}

export const getAllSessions = () => {
  return prisma.session.findMany({
    where: { status: 'open' },
    include: {
      coach: { include: { user: true } },
      bookings: participantSelect,
    },
    orderBy: { scheduled_at: 'asc' }
  })
}

export const createSession = async (data: {
  title: string, scheduled_at: Date, duration_min: number,
  max_spots: number, user_id: number
}) => {
  const coach = await prisma.coach.findUnique({ where: { user_id: data.user_id } })
  if (!coach) throw new Error('Profil coach introuvable pour cet utilisateur')

  const newStart = new Date(data.scheduled_at)
  const newEnd = new Date(newStart.getTime() + data.duration_min * 60 * 1000)

  const conflicts = await prisma.$queryRaw<{ id: number }[]>`
    SELECT id FROM \`Session\`
    WHERE coach_id = ${coach.id}
    AND scheduled_at < ${newEnd}
    AND DATE_ADD(scheduled_at, INTERVAL duration_min MINUTE) > ${newStart}
  `
  if (conflicts.length > 0) throw new Error('Cette session chevauche une session déjà programmée')

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