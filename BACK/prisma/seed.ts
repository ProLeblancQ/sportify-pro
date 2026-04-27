import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.role.createMany({
    data: [{ label: 'client' }, { label: 'coach' }, { label: 'admin' }],
    skipDuplicates: true,
  })

  await prisma.user.createMany({
    data: [
      { first_name: 'Admin',  last_name: 'Sportify', email: 'admin@sportify.com', password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', role_id: 3 },
      { first_name: 'Jean',   last_name: 'Dupont',   email: 'coach@sportify.com', password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', role_id: 2 },
      { first_name: 'Marie',  last_name: 'Martin',   email: 'marie@sportify.com', password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', role_id: 1 },
      { first_name: 'Lucas',  last_name: 'Bernard',  email: 'lucas@sportify.com', password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', role_id: 1 },
      { first_name: 'Emma',   last_name: 'Leroy',    email: 'emma@sportify.com',  password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', role_id: 1 },
    ],
    skipDuplicates: true,
  })

  await prisma.coach.create({
    data: { user_id: 2, specialty: 'Musculation', bio: 'Coach certifié 5 ans expérience en musculation et remise en forme.' }
  })

  await prisma.session.createMany({
    data: [
      { title: 'Cardio Intensif',         scheduled_at: new Date('2026-05-01T08:00:00'), duration_min: 60, max_spots: 10, available_spots: 8,  status: 'open', coach_id: 1 },
      { title: 'Musculation Débutant',    scheduled_at: new Date('2026-05-01T10:00:00'), duration_min: 45, max_spots: 8,  available_spots: 7,  status: 'open', coach_id: 1 },
      { title: 'Yoga & Stretching',       scheduled_at: new Date('2026-05-02T09:00:00'), duration_min: 60, max_spots: 12, available_spots: 11, status: 'open', coach_id: 1 },
      { title: 'HIIT Express',            scheduled_at: new Date('2026-05-02T18:00:00'), duration_min: 30, max_spots: 6,  available_spots: 5,  status: 'open', coach_id: 1 },
      { title: 'Renforcement Musculaire', scheduled_at: new Date('2026-05-03T11:00:00'), duration_min: 60, max_spots: 10, available_spots: 10, status: 'open', coach_id: 1 },
    ]
  })

  await prisma.booking.createMany({
    data: [
      { user_id: 3, session_id: 1, status: 'confirmed' },
      { user_id: 4, session_id: 1, status: 'confirmed' },
      { user_id: 3, session_id: 3, status: 'confirmed' },
      { user_id: 5, session_id: 2, status: 'confirmed' },
      { user_id: 4, session_id: 4, status: 'confirmed' },
    ]
  })

  console.log('Seed terminé')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
