const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const DB_PATH = path.join(__dirname, '../db/users.json');

async function readUsers() {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

// GET /api/dashboard
router.get('/', async (req, res) => {
  try {
    const users = await readUsers();
    const role = req.user.role;
    const userId = req.user.id;

    let dashboardData = {};

    if (role === 'Admin') {
      dashboardData = {
        title: 'Panel de administración',
        role: 'Admin',
        stats: [
          { label: 'Total de usuarios', value: users.length },
          { label: 'Entrenadores activos', value: users.filter(u => u.role === 'Coach').length },
          { label: 'Atletas registrados', value: users.filter(u => u.role === 'Athlete').length },
          { label: 'Estado del sistema', value: 'Online' }
        ],
        extraData: {
          allUsers: users.map(u => ({
            id: u.id,
            name: u.name,
            email: u.email,
            role: u.role,
            createdAt: u.createdAt
          }))
        }
      };
    } else if (role === 'Coach') {
      const athletes = users.filter(u => u.role === 'Athlete');
      dashboardData = {
        title: 'Panel de entrenador',
        role: 'Coach',
        stats: [
          { label: 'Atletas asignados', value: athletes.length },
          { label: 'Entrenamientos planificados', value: Math.floor(Math.random() * 20) + 10 },
          { label: 'Rendimiento promedio', value: (Math.random() * 40 + 60).toFixed(1) + '%' },
          { label: 'Sesiones esta semana', value: Math.floor(Math.random() * 15) + 5 }
        ],
        extraData: {
          athletes: athletes.map(a => ({
            id: a.id,
            name: a.name,
            email: a.email,
            progress: Math.floor(Math.random() * 100),
            status: Math.random() > 0.5 ? 'Excelente' : 'Requiere revisión'
          }))
        }
      };
    } else {
      dashboardData = {
        title: 'Mi progreso',
        role: 'Athlete',
        stats: [
          { label: 'Sesiones esta semana', value: Math.floor(Math.random() * 7) },
          { label: 'Calorías quemadas', value: (Math.random() * 2000 + 1000).toFixed(0) },
          { label: 'Cumplimiento de objetivos', value: (Math.random() * 40 + 60).toFixed(1) + '%' },
          { label: 'Récords personales', value: Math.floor(Math.random() * 10) + 1 }
        ],
        extraData: {
          nextWorkouts: [
            { name: 'Entrenamiento de fuerza', date: 'Hoy', time: '14:00' },
            { name: 'Cardio', date: 'Mañana', time: '10:00' },
            { name: 'Flexibilidad y estiramientos', date: 'Miércoles', time: '16:00' }
          ]
        }
      };
    }

    res.json(dashboardData);
  } catch (err) {
    console.error('Error en dashboard:', err);
    res.status(500).json({ error: 'Error al cargar el dashboard' });
  }
});

module.exports = router;
