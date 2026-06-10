// Script para generar hashes válidos de contraseñas
const bcrypt = require('bcrypt');
const fs = require('fs').promises;
const path = require('path');

const PASSWORD = 'password123';
const DB_PATH = path.join(__dirname, 'backend/db/users.json');

async function regenerateHashes() {
  try {
    const hashedPassword = await bcrypt.hash(PASSWORD, 10);
    console.log('🔐 Hash generado para "password123":', hashedPassword);

    const users = [
      {
        id: 1,
        name: 'Admin Pig',
        email: 'admin@pigfit.com',
        password: hashedPassword,
        role: 'Admin',
        createdAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 2,
        name: 'Coach Hammy',
        email: 'coach@pigfit.com',
        password: hashedPassword,
        role: 'Coach',
        createdAt: '2024-01-02T00:00:00Z'
      },
      {
        id: 3,
        name: 'Truffles Athlete',
        email: 'athlete@pigfit.com',
        password: hashedPassword,
        role: 'Athlete',
        createdAt: '2024-01-03T00:00:00Z'
      }
    ];

    await fs.writeFile(DB_PATH, JSON.stringify(users, null, 2));
    console.log('✅ Base de datos actualizada con hashes válidos');
    console.log('📝 Usuarios creados:');
    console.log('  - admin@pigfit.com / password123');
    console.log('  - coach@pigfit.com / password123');
    console.log('  - athlete@pigfit.com / password123');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

regenerateHashes();
