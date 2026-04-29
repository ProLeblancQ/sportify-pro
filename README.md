# Sportify Pro

Projet réalisé dans le cadre d'un examen à forEach Academy, avril 2026.

Sportify Pro est une application web de gestion de sessions sportives. Elle permet à des coachs de planifier des séances, à des clients de s'y inscrire, et à des administrateurs de superviser l'ensemble de la plateforme.

---

## Technologies utilisées

### Back-end
| Technologie | Rôle |
|---|---|
| Node.js + Express 5 | Serveur HTTP et routage |
| TypeScript | Typage statique |
| Prisma ORM v5 | Accès base de données |
| MySQL | Base de données relationnelle |
| JSON Web Token | Authentification stateless |
| bcryptjs | Hachage des mots de passe |
| Jest + Supertest | Tests unitaires et d'intégration |

### Front-end
| Technologie | Rôle |
|---|---|
| React 19 + Vite | Framework UI et bundler |
| TypeScript | Typage statique |
| React Router v6 | Navigation SPA |
| CSS custom properties | Système de design (sans framework) |

---

## Screenshots

### Connexion
![Connexion](<docs/screenshot/Capture d'écran 2026-04-28 152754.png>)

### Inscription
![Inscription](<docs/screenshot/Capture d'écran 2026-04-28 152808.png>)

### Planning coach
![Planning](<docs/screenshot/Capture d'écran 2026-04-28 152736.png>)

### Détail d'une session — participants
![Détail session](<docs/screenshot/Capture d'écran 2026-04-28 152405.png>)

---

## Lancer le projet

### Prérequis

- Node.js >= 18
- MySQL en cours d'exécution
- Un fichier `.env` configuré dans chaque dossier (voir `.env.example`)

### 1. Base de données

Créer une base de données MySQL nommée `sportify_pro`, puis depuis le dossier `BACK/` :

```bash
npx prisma migrate dev
npm run seed
```

### 2. Back-end

```bash
cd BACK
cp .env.example .env   # renseigner DATABASE_URL et JWT_SECRET
npm install
npm run dev
```

### 3. Front-end

```bash
cd FRONT
cp .env.example .env  
npm install
npm run dev  
```

### 4. Tests (back-end uniquement)

```bash
cd BACK
npm test               # lance la suite Jest
npm run test:coverage  # avec rapport de couverture
```

---

## Lancer avec Docker

### Prérequis
- Docker Desktop installé et en cours d'exécution

### Démarrage

```bash
docker compose up --build
```

| Service | URL |
|---|---|
| Front-end | http://localhost:5173 |
| Back-end | http://localhost:3000 |
| MySQL | localhost:3306 |

### Seed (première utilisation)

Une fois les conteneurs démarrés, lancer le seed dans le conteneur back :

```bash
docker compose exec back npm run seed
```

### Arrêt

```bash
docker compose down        # arrête les conteneurs
docker compose down -v     # arrête et supprime les données MySQL
```

---

## Comptes de test (après seed)

| Rôle | Email | Mot de passe |
|---|---|---|
| Admin | admin@sportify.com | password |
| Coach | coach@sportify.com | password |
| Client | alice@sportify.com | password |
