import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export const register = async (first_name: string, last_name: string, email: string, password: string) => {
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) throw new Error('Email déjà utilisé')

  const clientRole = await prisma.role.findUnique({ where: { label: 'client' } })
  const hashed = await bcrypt.hash(password, 10)

  return prisma.user.create({
    data: { first_name, last_name, email, password: hashed, role_id: clientRole!.id }
  })
}

export const login = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email }, include: { role: true } })
  if (!user) throw new Error('Utilisateur introuvable')

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) throw new Error('Mot de passe incorrect')

  const token = jwt.sign(
    { id: user.id, role: user.role.label },
    process.env.JWT_SECRET as string,
    { expiresIn: '24h' }
  )
  return { token, user: { id: user.id, email: user.email, role: user.role.label } }
}