import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
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

export const getMe = (id: number) => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      avatar_url: true,
      role: true,
      coach: true,
    },
  })
}

export const updateAvatar = (id: number, avatar_url: string) => {
  return prisma.user.update({
    where: { id },
    data: { avatar_url },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      avatar_url: true,
      role: true,
      coach: true,
    },
  })
}

export const updateMe = async (
  id: number,
  data: {
    first_name?: string
    last_name?: string
    email?: string
    password?: string
    specialty?: string
    bio?: string
  }
) => {
  const userUpdate: Record<string, any> = {}
  if (data.first_name) userUpdate.first_name = data.first_name
  if (data.last_name) userUpdate.last_name = data.last_name
  if (data.email) userUpdate.email = data.email
  if (data.password) userUpdate.password = await bcrypt.hash(data.password, 10)

  if (Object.keys(userUpdate).length > 0) {
    await prisma.user.update({ where: { id }, data: userUpdate })
  }

  const user = await prisma.user.findUnique({ where: { id }, include: { role: true, coach: true } })
  if (user?.coach && (data.specialty !== undefined || data.bio !== undefined)) {
    await prisma.coach.update({
      where: { user_id: id },
      data: {
        ...(data.specialty !== undefined && { specialty: data.specialty }),
        ...(data.bio !== undefined && { bio: data.bio }),
      },
    })
  }

  return prisma.user.findUnique({ where: { id }, include: { role: true, coach: true } })
}
