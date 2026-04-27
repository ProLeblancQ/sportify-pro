import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const getAllUsers = () => {
  return prisma.user.findMany({
    include: { role: true },
    orderBy: { created_at: 'asc' }
  })
}

export const updateUserRole = async (id: number, role_label: string) => {
  const role = await prisma.role.findUnique({ where: { label: role_label } })
  if (!role) throw new Error('Rôle introuvable')

  return prisma.user.update({
    where: { id },
    data: { role_id: role.id }
  })
}

export const deleteUser = (id: number) => {
  return prisma.user.delete({ where: { id } })
}