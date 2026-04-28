import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const getMyBookings = (user_id: number) => {
  return prisma.booking.findMany({
    where: { user_id },
    include: { session: true },
    orderBy: { booked_at: 'desc' }
  })
}

export const createBooking = async (user_id: number, session_id: number) => {

  const session = await prisma.session.findUnique({ where: { id: session_id } })
  if (!session) throw new Error('Séance introuvable')

  // Règle 1 : places disponibles
  if (session.available_spots <= 0) throw new Error('Plus de places disponibles')

  // Règle 2 : déjà inscrit à cette session
  const existing = await prisma.booking.findFirst({ where: { user_id, session_id } })
  if (existing) throw new Error('Tu es déjà inscrit à cette session')

  // Règle 4 : pas de conflit de créneau
  const conflict = await prisma.booking.findFirst({
    where: {
      user_id,
      status: 'confirmed',
      session: {
        scheduled_at: session.scheduled_at
      }
    }
  })
  if (conflict) throw new Error('Tu as déjà une réservation sur ce créneau')

  // Création de la réservation + décrémentation des places
  const [booking] = await prisma.$transaction([
    prisma.booking.create({ data: { user_id, session_id } }),
    prisma.session.update({
      where: { id: session_id },
      data: { available_spots: { decrement: 1 } }
    })
  ])

  return booking
}

export const cancelBooking = async (id: number, user_id: number) => {
  const booking = await prisma.booking.findUnique({ where: { id } })
  if (!booking || booking.user_id !== user_id) throw new Error('Réservation introuvable')

  await prisma.$transaction([
    prisma.booking.delete({ where: { id } }),
    prisma.session.update({
      where: { id: booking.session_id },
      data: { available_spots: { increment: 1 } }
    })
  ])
}