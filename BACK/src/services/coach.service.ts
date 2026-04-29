import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const getCoachById = (id: number) => {
  return prisma.coach.findUnique({
    where: { id },
    include: {
      user: { select: { first_name: true, last_name: true, email: true } },
      sessions: {
        where: { status: 'open', scheduled_at: { gte: new Date() } },
        orderBy: { scheduled_at: 'asc' },
      },
    },
  })
}
